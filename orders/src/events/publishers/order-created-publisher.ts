import { Publisher, OrderCreatedEvent, Subjects } from "@guilestickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
