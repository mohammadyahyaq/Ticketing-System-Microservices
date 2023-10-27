import express from "express";

// this library will allow express to use error handlers in async api's
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUser, errorHandler } from "@mohammadyahyaq-learning/common";
import { authRoutes } from "./routes/auth.route";

const app = express();

// setup the initial middlewares
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // to remove encryption
    // restrict the cookie to only work in https connection in non test environment
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

authRoutes(app);

// now we add the error handler
app.use(errorHandler);

export { app };
