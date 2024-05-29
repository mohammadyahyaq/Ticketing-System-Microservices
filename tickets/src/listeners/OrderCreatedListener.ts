import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@mohammadyahyaq-learning/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/tickets.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find ticket the order reserving
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // mark ticket as reserved
    ticket.set({ orderId: data.id });
    // save ticket
    await ticket.save();
    // ack the message
    msg.ack();
  }
}
