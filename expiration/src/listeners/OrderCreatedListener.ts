import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@mohammadyahyaq-learning/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expirationQueue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process this job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        // setup delay to handle expiration
        delay,
      }
    );

    msg.ack();
  }
}
