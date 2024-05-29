import {
  OrderCreatedEvent,
  OrderStatus,
} from "@mohammadyahyaq-learning/common";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { OrderCreatedListener } from "../listeners/OrderCreatedListener";
import mongoose, { set } from "mongoose";
import { Ticket } from "../models/tickets.model";
import { Message } from "node-nats-streaming";

async function setup() {
  // create a order listener
  const listener = new OrderCreatedListener(singletonNatsClient.client);

  // create a ticket to attatch to that order
  const ticket = Ticket.build({
    title: "movie",
    price: 13,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // create a fake data event
  const eventData: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: +ticket.price,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    eventData,
    msg,
  };
}

it("sets the ordersId of the ticket", async () => {
  const { listener, ticket, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(eventData.id);
});

it("acks the message", async () => {
  const { listener, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes ticket updated event", async () => {
  const { listener, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  expect(singletonNatsClient.client.publish).toHaveBeenCalled();

  const ticketUpdatedEventData = JSON.parse(
    (singletonNatsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(ticketUpdatedEventData.orderId);
});
