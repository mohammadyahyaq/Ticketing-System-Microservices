import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { OrderStatus, RouteError } from "@mohammadyahyaq-learning/common";
import { stripe } from "../config/stripe";

export const createPayment = async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new RouteError("Order not found", 404);
  }

  if (order.userId !== req.user!.id) {
    throw new RouteError("Not autherize", 401);
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new RouteError("Order cancelled", 400);
  }

  await stripe.charges.create({
    amount: order.price * 100,
    currency: "usd",
    source: token,
  });

  res.status(201).send({ success: true });
};
