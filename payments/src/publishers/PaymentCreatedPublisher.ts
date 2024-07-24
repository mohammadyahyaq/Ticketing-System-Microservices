import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@mohammadyahyaq-learning/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
