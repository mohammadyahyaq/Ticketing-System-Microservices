import { Express } from "express";
import {
  deleteOrder,
  getAllOrders,
  getOrderDetails,
} from "../controllers/orders.controller";
import { authRequired, showMessages } from "@mohammadyahyaq-learning/common";
import { checkSchema } from "express-validator";

export const ordersRoutes = (app: Express) => {
  // here we will list all the routes related to the orders
  app.get("/api/orders", getAllOrders);

  app.get("/api/orders/:orderId", getOrderDetails);

  app.delete(
    "/api/orders/:orderId",
    authRequired,
    checkSchema({
      ticketId: {
        in: "body",
        notEmpty: true,
      },
    }),
    showMessages,
    deleteOrder
  );
};
