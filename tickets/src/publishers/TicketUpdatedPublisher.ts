import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@mohammadyahyaq-learning/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
