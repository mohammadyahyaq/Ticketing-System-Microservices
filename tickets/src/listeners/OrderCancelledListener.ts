import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@mohammadyahyaq-learning/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/tickets.model";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // find the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // unreserve the ticket
    ticket.set({ orderId: undefined });
    await ticket.save();

    // publish ticket updated listener
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    });

    msg.ack();
  }
}
