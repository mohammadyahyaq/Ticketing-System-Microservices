import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// we want to make a random client ID for each service to allow making replicas of this service
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // the second argument allows us to make a replica of this service were this service will receive only one message to this queue group
  const subscription = stan.subscribe("ticket:created", "listenerQueueGroup");

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}`);
      console.log("data:", data);
    }
  });
});
