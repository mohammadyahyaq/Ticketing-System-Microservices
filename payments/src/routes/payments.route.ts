import { Express } from "express";
import { authRequired, showMessages } from "@mohammadyahyaq-learning/common";
import { checkSchema } from "express-validator";
import { createPayment } from "../controllers/payments.controller";

export const paymentsRoutes = (app: Express) => {
  app.post(
    "/api/payments",
    authRequired,
    checkSchema({
      token: {
        in: "body",
        notEmpty: true,
      },
      orderId: {
        in: "body",
        notEmpty: true,
      },
    }),
    showMessages,
    createPayment
  );
};
