import { Listener, ExpirationCompleteEvent, Subjects, NotFoundError, OrderStatus } from "@guilestickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { version } from "typescript";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

 async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
   console.log("Order Cancelled");

   const order = await Order.findById(data.orderId).populate("ticket");

   if(!order){
     throw new NotFoundError();
   }

   if(order.status === OrderStatus.Complete) {
     return msg.ack();
   }
   order.set({
     status: OrderStatus.Cancelled
   });

   await order.save();

   await new OrderCancelledPublisher(natsWrapper.client).publish({
     id: order.id,
     version: order.version,
     ticket: {
       id: order.ticket.id
     }
   });

   msg.ack();
 }
} 