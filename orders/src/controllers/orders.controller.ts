import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { OrderStatus, RouteError } from "@mohammadyahyaq-learning/common";
import { Order } from "../models/order.model";

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  }).populate("ticket");

  res.status(200).send(orders);
};

export const createOrder = async (req: Request, res: Response) => {
  // check if ticket is already exist
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new RouteError("Ticket not found", 404);
  }

  // check that ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new RouteError("Ticket is already reserved", 400);
  }

  // calculate expiration date (15 mins)
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 16 * 60); // set 15 minutes into the future

  // build/store the order
  const order = Order.build({
    userId: req.user!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket,
  });
  await order.save();

  res.status(201).send(order);
};

export const getOrderDetails = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) {
    throw new RouteError("Order not found", 404);
  }
  if (order.userId !== req.user!.id) {
    throw new RouteError("You are not authorized to get this resource", 401);
  }
  res.status(200).send(order);
};

export const deleteOrder = (req: Request, res: Response) => {
  res.send({});
};
