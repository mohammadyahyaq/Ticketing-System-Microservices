import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@mohammadyahyaq-learning/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
