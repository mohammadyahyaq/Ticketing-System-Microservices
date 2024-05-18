import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@mohammadyahyaq-learning/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: +data.price,
    });
    await ticket.save();

    // acknowledge the nats streaming server that we processed this event successfully
    msg.ack();
  }
}
