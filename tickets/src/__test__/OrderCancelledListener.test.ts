import mongoose from "mongoose";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { OrderCancelledListener } from "../listeners/OrderCancelledListener";
import { Ticket } from "../models/tickets.model";
import { OrderCancelledEvent } from "@mohammadyahyaq-learning/common";
import { Message } from "node-nats-streaming";

async function setup() {
  // create a order listener
  const listener = new OrderCancelledListener(singletonNatsClient.client);

  // create fake orderId
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // create a ticket to attatch to that order
  const ticket = Ticket.build({
    title: "movie",
    price: 13,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  // create a fake data event
  const eventData: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    orderId,
    ticket,
    eventData,
    msg,
  };
}

it("updates, publishes, and ack the event after listen", async () => {
  const { listener, orderId, ticket, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();

  expect(singletonNatsClient.client.publish).toHaveBeenCalled();
});
