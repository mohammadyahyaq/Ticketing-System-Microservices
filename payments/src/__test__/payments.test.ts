import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { OrderStatus } from "@mohammadyahyaq-learning/common";
import { stripe } from "../config/stripe";
import { Payment } from "../models/payment.model";

jest.mock("../config/stripe");

it("returns 404 when purchasing non existing order", async () => {
  const token = getAuthCookie();

  const nonExistingOrderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({ token: "random_token", orderId: nonExistingOrderId })
    .expect(404);
});

it("returns 401 if order not belongs to user", async () => {
  const token = getAuthCookie();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({ token: "random_token", orderId: order.id })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const token = getAuthCookie(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({ token: "random_token", orderId: order.id })
    .expect(400);
});

it("returns a 201 with valid input", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const token = getAuthCookie(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: "random_id",
  });
  expect(payment).not.toBeNull();
});
