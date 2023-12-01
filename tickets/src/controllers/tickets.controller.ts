import { Request, Response } from "express";
import { Ticket } from "../models/tickets.model";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // create the ticket
  const ticket = Ticket.build({ title, price, userId: req.user!.id });
  await ticket.save();

  res.status(201).send(ticket);
};
