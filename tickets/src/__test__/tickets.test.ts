import request from "supertest";
import { app } from "../app";
import { Ticket } from "../models/tickets.model";

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
