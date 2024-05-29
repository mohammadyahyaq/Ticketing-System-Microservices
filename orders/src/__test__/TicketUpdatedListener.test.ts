import mongoose from "mongoose";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { TicketUpdatedListener } from "../listeners/TicketUpdatedListener";
import { Ticket } from "../models/ticket.model";
import { TicketUpdatedEvent } from "@mohammadyahyaq-learning/common";
import { Message } from "node-nats-streaming";

async function setup() {
  // create listener
  const listener = new TicketUpdatedListener(singletonNatsClient.client);

  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "movie",
    price: 50,
  });
  await ticket.save();

  // create a fake data event
  const eventData: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "concert",
    price: "100",
    userId: new mongoose.Types.ObjectId().toHexString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

it("finds, updates, and save a ticket", async () => {
  const { listener, ticket, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(eventData.title);
  expect(updatedTicket?.price.toString()).toEqual(eventData.price);
  expect(updatedTicket?.version).toEqual(eventData.version);
});

it("acks the message", async () => {
  const { listener, eventData, msg } = await setup();

  await listener.onMessage(eventData, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not ack request if it's a skipped version", async () => {
  const { listener, eventData, msg } = await setup();

  eventData.version = 10;

  try {
    await listener.onMessage(eventData, msg);
  } catch (error) {
    expect(msg.ack).not.toHaveBeenCalled();
  }
});
