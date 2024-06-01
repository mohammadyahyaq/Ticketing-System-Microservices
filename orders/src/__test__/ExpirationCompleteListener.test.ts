import {
  ExpirationCompleteEvent,
  OrderStatus,
} from "@mohammadyahyaq-learning/common";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { ExpirationCompleteListener } from "../listeners/ExpirationCompleteListener";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { Message } from "node-nats-streaming";

async function setup() {
  // create a ticket listener
  const listener = new ExpirationCompleteListener(singletonNatsClient.client);

  // create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "movie",
    price: 50,
  });
  await ticket.save();

  // create order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "fadlkfdaafd",
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  // create a fake data event
  const eventData: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    order,
    eventData,
    msg,
  };
}
