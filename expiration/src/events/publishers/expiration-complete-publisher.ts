import { Publisher, ExpirationCompleteEvent, Subjects } from "@guilestickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
