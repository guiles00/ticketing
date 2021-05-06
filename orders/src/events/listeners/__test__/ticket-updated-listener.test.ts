import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@guilestickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import  mongoose  from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () =>{

  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title:"Concert",
    price: 10
  });
  await ticket.save();
  //create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "andes",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  //create a fake object message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg}
}

it("finds, updates and saves a ticket", async ()=>{
  const { listener, data, ticket, msg } = await setup();
  //call the onMessage function with data object + message object
  await listener.onMessage(data, msg)
  //write assertion funcion, the ticket is created!
  
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it("acks the message", async ()=>{
  const { listener, data, msg } = await setup();
  //call the onMessage function with data object + message object
  await listener.onMessage(data, msg)

  //write assertino funcion 
  expect(msg.ack).toHaveBeenCalled();

});

it("does not call ack if the event is in the future",async ()=>{
  const { msg, data, listener, ticket } = await setup();

  data.version = 10;
  try{

    await listener.onMessage(data, msg)
  } catch(err) {
    
  }

  expect(msg.ack).not.toHaveBeenCalled();

})