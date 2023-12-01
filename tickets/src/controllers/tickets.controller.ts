import { Request, Response } from "express";
import { Ticket } from "../models/tickets.model";
import { RouteError } from "@mohammadyahyaq-learning/common";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // create the ticket
  const ticket = Ticket.build({ title, price, userId: req.user!.id });
  await ticket.save();

  res.status(201).send(ticket);
};

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new RouteError("Not Found", 404);
  }

  res.send(ticket);
};
