import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@mohammadyahyaq-learning/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
