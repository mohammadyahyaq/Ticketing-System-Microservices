import { singletonNatsClient } from "./config/SingletonNatsClient";

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
  } catch (error) {
    console.log(error);
  }
})();
