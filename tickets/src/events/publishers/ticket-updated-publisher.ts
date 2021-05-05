import { Publisher, Subjects, TicketUpdatedEvent} from "@guilestickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated; 
}