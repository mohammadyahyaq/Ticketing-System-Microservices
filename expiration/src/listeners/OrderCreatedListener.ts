import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@mohammadyahyaq-learning/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
