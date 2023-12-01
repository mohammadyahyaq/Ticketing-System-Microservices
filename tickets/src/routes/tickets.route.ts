import { Express } from "express";
import { createTicket } from "../controllers/tickets.controller";
import { authRequired, showMessages } from "@mohammadyahyaq-learning/common";
import { checkSchema } from "express-validator";

export const ticketsRoutes = (app: Express) => {
  // here we will list all the routes related to the tickets
  app.post(
    "/api/tickets",
    authRequired,
    checkSchema({
      title: {
        in: "body",
        trim: true,
        isLength: {
          options: { min: 3 },
          errorMessage: "title must be more than 3 characters length",
        },
      },
      price: {
        in: "body",
        isFloat: {
          // must be greater than 0
          options: { gt: 0 },
          errorMessage: "price must be greater than 0",
        },
      },
    }),
    showMessages,
    createTicket
  );
};
