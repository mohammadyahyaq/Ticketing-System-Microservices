import { TicketCreatedEvent } from "@mohammadyahyaq-learning/common";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { TicketCreatedListener } from "../listeners/TicketCreatedListener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket.model";

async function setup() {
  // create a ticket listener
  const listener = new TicketCreatedListener(singletonNatsClient.client);
  // create a fake data event
  const eventData: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "movie",
    price: "500",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
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
    eventData,
    msg,
  };
}

it("creates and save ticket", async () => {
  const { listener, eventData, msg } = await setup();

  // call onMessage function
  await listener.onMessage(eventData, msg);

  const ticket = await Ticket.findById(eventData.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(eventData.title);
  expect(ticket?.price.toString()).toEqual(eventData.price);
});

it("acks the message", async () => {
  const { listener, eventData, msg } = await setup();

  // call onMessage function
  await listener.onMessage(eventData, msg);

  expect(msg.ack).toHaveBeenCalled();
});
