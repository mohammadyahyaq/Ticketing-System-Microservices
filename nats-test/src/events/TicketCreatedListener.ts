import { Message } from "node-nats-streaming";
import { Listener } from "./baseListener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "paymentsService";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data", data);
    msg.ack();
  }
}
