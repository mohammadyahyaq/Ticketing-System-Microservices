import { Request, Response } from "express";

export const createPayment = async (req: Request, res: Response) => {
  res.send({ success: true });
};
