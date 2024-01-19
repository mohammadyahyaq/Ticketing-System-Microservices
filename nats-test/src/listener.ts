import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// we want to make a random client ID for each service to allow making replicas of this service
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // callback on close
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // we want to make the nats service to wait for us to send acknowledgement when we processed the message correctly
  const options = stan.subscriptionOptions().setManualAckMode(true);
  // the second argument allows us to make a replica of this service
  // were this service will receive only one message to this queue group
  const subscription = stan.subscribe(
    "ticket:created",
    "listenerQueueGroup",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}`);
      console.log("data:", data);
    }
    // send the acknowledgement to NATS service
    msg.ack();
  });
});

// close connection on interrupt
process.on("SIGINT", () => stan.close());
// close connection on terminate
process.on("SIGTERM", () => stan.close());
