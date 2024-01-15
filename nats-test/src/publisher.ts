import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// callback when the app successfully connected to the stan server
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  // lets create a data to send
  const data = JSON.stringify({
    id: "123",
    title: "movie",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    // callback will be triggered after event published
    console.log("Event published");
  });
});
