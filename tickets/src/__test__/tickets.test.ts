import request from "supertest";
import { app } from "../app";
import { Ticket } from "../models/tickets.model";
import { Types } from "mongoose";
import { singletonNatsClient } from "../config/SingletonNatsClient";

// ============= create ticket =============
it("should returns an error if the user is not logged in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("does not gives 401 error if the user is logged in", async () => {
  const validCookie = getAuthCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const validCookie = getAuthCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "",
      price: 10,
    });

  // expect error 400
  expect(response.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const validCookie = getAuthCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "test test",
      price: -10,
    });

  // expect error 400
  expect(response.status).toEqual(400);
});

it("should create a ticket if the request is valid", async () => {
  // make sure that the tickets collection is empty
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const validCookie = getAuthCookie();

  const requestBody = {
    title: "test test test",
    price: 20,
  };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send(requestBody);

  expect(response.status).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  // check that the record contains the same details as the request
  expect(tickets[0].title).toEqual(requestBody.title);
  expect(tickets[0].price).toEqual(requestBody.price);
});

it("publeshes an event", async () => {
  const validCookie = getAuthCookie();

  const requestBody = {
    title: "test test test",
    price: 20,
  };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send(requestBody);

  expect(response.status).toEqual(201);
  expect(singletonNatsClient.client.publish).toHaveBeenCalled();
});

// ============= read tickets =============
it("can get the list of tickets", async () => {
  // create list of tickets to test the api
  const validCookie = getAuthCookie();

  const listOfTickets = [
    {
      title: "ticket 1",
      price: 20,
    },
    {
      title: "ticket 2",
      price: 10,
    },
  ];

  for (const ticket of listOfTickets) {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", validCookie)
      .send(ticket)
      .expect(201);
  }

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
});

// =========== read ticket by id ===========
it("returns 404 if the ticket not found", async () => {
  // generate a valid mongoose id
  const invalidId = new Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${invalidId}`)
    .expect(404);
});

it("returns the ticket if the ticket found", async () => {
  // create a ticket
  const validCookie = getAuthCookie();

  const createdTicket = {
    title: "test test test",
    price: 20,
  };
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send(createdTicket)
    .expect(201);

  const response = await request(app)
    .get(`/api/tickets/${createTicketResponse.body.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(createdTicket.title);
  expect(response.body.price).toEqual(createdTicket.price);
});

// ============ update tickets ============
it("should returns 404 if provided id not exist", async () => {
  const validCookie = getAuthCookie();

  const invalidId = new Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${invalidId}`)
    .set("Cookie", validCookie)
    .send({
      title: "test test",
      price: 10,
    })
    .expect(404);
});

it("should returns 401 if user not authorized", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "test test test",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    // no valid token sent
    .send({
      title: "test test",
      price: 10,
    })
    .expect(401);
});

it("should returns 401 if user is not owning the ticket", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "old title",
      price: 10,
    })
    .expect(201);

  // update the same ticket with another user
  const newValidId = getAuthCookie();
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set("Cookie", newValidId)
    .send({
      title: "new title",
      price: 20,
    })
    .expect(401);
});

it("should returns 400 if provides an invalid title or price", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "old title",
      price: 10,
    })
    .expect(201);

  // on invalid title
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set("Cookie", validCookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  // on invalid price
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set("Cookie", validCookie)
    .send({
      title: "new test",
      price: -10,
    })
    .expect(400);
});

it("should updates the ticket if the request is valid", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "old title",
      price: 10,
    })
    .expect(201);

  // update the ticket
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set("Cookie", validCookie)
    .send({
      title: "new title",
      price: 20,
    })
    .expect(200);

  // make sure that the ticket is updated
  const getTicketResponse = await request(app)
    .get(`/api/tickets/${createTicketResponse.body.id}`)
    .send()
    .expect(200);

  expect(getTicketResponse.body.title).toEqual("new title");
  expect(getTicketResponse.body.price).toEqual(20);
});

it("publeshes an event", async () => {
  const validCookie = getAuthCookie();

  // create a ticket
  const createTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", validCookie)
    .send({
      title: "old title",
      price: 10,
    })
    .expect(201);

  // update the ticket
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set("Cookie", validCookie)
    .send({
      title: "new title",
      price: 20,
    })
    .expect(200);

  expect(singletonNatsClient.client.publish).toHaveBeenCalled();
});
