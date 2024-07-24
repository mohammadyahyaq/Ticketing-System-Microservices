// connect to the database
import "./config/database";

import { app } from "./app";

import { singletonNatsClient } from "./config/SingletonNatsClient";
import { TicketCreatedListener } from "./listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./listeners/TicketUpdatedListener";
import { ExpirationCompleteListener } from "./listeners/ExpirationCompleteListener";
import { PaymentCreatedListener } from "./listeners/PaymentCreatedListener";

(async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID environment variable must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID environment variable must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL environment variable must be defined");
  }
  try {
    await singletonNatsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // callback on close
    singletonNatsClient.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => singletonNatsClient.client.close());
    // close connection on terminate
    process.on("SIGTERM", () => singletonNatsClient.client.close());

    new TicketCreatedListener(singletonNatsClient.client).listen();
    new TicketUpdatedListener(singletonNatsClient.client).listen();
    new ExpirationCompleteListener(singletonNatsClient.client).listen();
    new PaymentCreatedListener(singletonNatsClient.client).listen();
  } catch (error) {
    console.log(error);
  }
})();

app.listen(3000, () => console.log("Listening in port 3000"));
