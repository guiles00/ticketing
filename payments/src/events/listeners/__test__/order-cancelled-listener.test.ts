import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@guilestickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import  mongoose  from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";

const setup = async () =>{

  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "as0",
    version: 0
  })

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id:"asd"
    }
  }

  //create a fake object message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg}
}

it("updates the status of the order", async ()=>{
  const { listener, data, msg } = await setup();
 
  await listener.onMessage(data, msg)
 
  
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async ()=>{
  const { listener, data, msg } = await setup();
 
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled();

});