import Queue from "bull";
import { ExpirationCompletePublisher } from "../publishers/ExpirationCompletePublisher";
import { singletonNatsClient } from "../config/SingletonNatsClient";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(singletonNatsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
