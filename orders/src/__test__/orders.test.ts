import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { OrderStatus } from "@mohammadyahyaq-learning/common";

// get all orders
it("fetches orders for particular user", async () => {
  // create three tickets
  async function buildTicket() {
    const ticket = Ticket.build({
      title: "Movie",
      price: 20,
    });
    await ticket.save();
    return ticket;
  }
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOneToken = getAuthCookie();
  const userTwoToken = getAuthCookie();

  // create one order for user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOneToken)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  // create two orders for user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoToken)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoToken)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  // make the request to [GET] /api/orders
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwoToken);

  // test if the response is correct
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

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

it.todo("emits an event");

// get order details

it("fetches the order", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const ticket = Ticket.build({
    title: "movie",
    price: 20,
  });
  await ticket.save();

  // make an order for that ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", validCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to get that ticket
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", validCookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if user request another user order", async () => {
  const userOneToken = getAuthCookie();
  const userTwoToken = getAuthCookie();

  // create a ticket
  const ticket = Ticket.build({
    title: "movie",
    price: 20,
  });
  await ticket.save();

  // make an order for that ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOneToken)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to get that ticket
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwoToken)
    .send()
    .expect(401);
});
