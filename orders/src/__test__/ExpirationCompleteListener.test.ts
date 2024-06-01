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

it("updates order status to cancelled", async () => {
  const { listener, order, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const { listener, order, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  const publishMock = singletonNatsClient.client.publish as jest.Mock;
  expect(publishMock).toHaveBeenCalled();

  const actualEventData = JSON.parse(publishMock.mock.calls[0][1]);

  expect(actualEventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});
