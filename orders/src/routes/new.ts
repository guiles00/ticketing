import mongoose from "mongoose";
import express, { Request, response, Response } from "express";
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from "@guilestickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

 router.post("/api/orders", requireAuth,
  [
    body("ticketId").not()
      .isEmpty()
      .custom((input: string )=> mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided")
  ], 
  validateRequest,
  async (req: Request, res: Response) => {
    // finde the ticket the user is trying to orderin the database
    // Make sure that this ticket is not already reserved
    // Calculate an expiration date for this order
    // Build the order and save it to the database
    // Publish an event saying that an order was created

    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
      throw new NotFoundError();
    }
    
    //Run query to look at all orders. Find an order where the ticket
    //is the ticket we just found and he orders status is not cancelled
    //If we find an order from that menas the ticket is reserved

    const isReserved = await ticket.isReserved();

    if(isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version:order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order);
 });

export { router as createOrderRouter }