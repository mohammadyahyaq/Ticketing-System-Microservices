import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@mohammadyahyaq-learning/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
