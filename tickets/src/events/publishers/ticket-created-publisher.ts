import { Publisher, Subjects, TicketCreatedEvent} from "@guilestickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; 
}