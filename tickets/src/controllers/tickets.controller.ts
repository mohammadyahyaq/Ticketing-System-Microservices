import { Request, Response } from "express";
import { Ticket } from "../models/tickets.model";
import { RouteError } from "@mohammadyahyaq-learning/common";
import { TicketCreatedPublisher } from "../publishers/TicketCreatedPublisher";
import { singletonNatsClient } from "../config/SingletonNatsClient";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export const createTicketController = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // create the ticket
  const ticket = Ticket.build({ title, price, userId: req.user!.id });
  await ticket.save();

  // publish a ticket created event
  await new TicketCreatedPublisher(singletonNatsClient.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    version: ticket.version,
  });

  res.status(201).send(ticket);
};

export const getAllTicketsController = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
};

export const getTicketByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new RouteError("Not Found", 404);
  }

  res.send(ticket);
};

export const updateTicketController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new RouteError("Not Found", 404);
  }

  if (ticket.userId !== req.user!.id) {
    throw new RouteError("Not authorized", 401);
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });
  await ticket.save();

  // publish update event
  await new TicketUpdatedPublisher(singletonNatsClient.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    version: ticket.version,
  });

  res.send(ticket);
};
