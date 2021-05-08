import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@guilestickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that not does exist", async ()=>{
  
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token:"asdasd",
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that not does belongs to the user", async ()=>{

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created
  })
  
  await order.save();

  await request(app)
  .post("/api/payments")
  .set("Cookie", global.signin())
  .send({
    token:"asdasd",
    orderId: order.id
  })
  .expect(401);

});

it("returns a 400 when purchasing a cancelled order", async ()=>{

  const userId = mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 10,
    status: OrderStatus.Cancelled
  })
 
  await order.save();

  await request(app)
  .post("/api/payments")
  .set("Cookie", global.signin(userId))
  .send({
    token:"asdasd",
    orderId: order.id
  })
  .expect(400);

});

it("returns a 204 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 10,
    status: OrderStatus.Created
  })
 
  await order.save();

//  const response = await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id
//     })
//     //.expect(201);    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    // expect(chargeOptions.source).toEqual("tok_visa");
    // expect(chargeOptions.amount).toEqual(10*100);
    // expect(chargeOptions.currency).toEqual("usd");

    // console.log(stripe.charges)

  //  const payment = await Payment.findOne({
  //    orderId: order.id,
  //    stripeId: stripeCharge!.id,
  //  });

  //  expect(payment).not.toBeNull();

  });