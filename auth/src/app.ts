import express from "express";

// this library will allow express to use error handlers in async api's
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth.route";

const app = express();

import { currentUser } from "./middleware/authMiddleware";

// setup the initial middlewares
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // to remove encryption
    secure: true, // restrict the cookie to only work in https connection
  })
);
app.use(currentUser);

authRoutes(app);

// now we add the error handler
app.use(errorHandler);

export { app };
