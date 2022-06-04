import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.route';

const app = express();

// connect to the database
import './config/database';

// setup the initial middlewares
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
    signed: false, // to remove encryption
    secure: true   // restrict the cookie to only work in https connection
}));

authRoutes(app);

// now we add the error handler
app.use(errorHandler);

app.listen(3000, () => console.log('Listening in port 3000'));