import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

// we want to make a random client ID for each service to allow making replicas of this service
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

// callback when the app successfully connected to the stan server
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // callback on close
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "movie",
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }

  // lets create a data to send
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "movie",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   // callback will be triggered after event published
  //   console.log("Event published");
  // });
});

// close connection on interrupt
process.on("SIGINT", () => stan.close());
// close connection on terminate
process.on("SIGTERM", () => stan.close());
