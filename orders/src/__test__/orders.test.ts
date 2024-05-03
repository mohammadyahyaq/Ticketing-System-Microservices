import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { OrderStatus } from "@mohammadyahyaq-learning/common";

// create order
it("should returns an error if the ticket doesn't exist", async () => {
  const validCookie = getAuthCookie();
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", validCookie)
    .send({ ticketId })
    .expect(404);
});

it("should returns an error if the ticket is already reserved", async () => {
  const validCookie = getAuthCookie();

  // step 1: create a ticket
  const ticket = Ticket.build({
    title: "movie",
    price: 20,
  });
  await ticket.save();
  // step 2: reserve that ticket
  const order = Order.build({
    userId: "fasfdsaafsd",
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  // step 3: create the request
  await request(app)
    .post("/api/orders")
    .set("Cookie", validCookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const validCookie = getAuthCookie();

  // step 1: create a ticket
  const ticket = Ticket.build({
    title: "movie",
    price: 20,
  });
  await ticket.save();

  // step 2: create an order for that ticket
  await request(app)
    .post("/api/orders")
    .set("Cookie", validCookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});
