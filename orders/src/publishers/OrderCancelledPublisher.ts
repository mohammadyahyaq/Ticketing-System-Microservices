import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@mohammadyahyaq-learning/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
