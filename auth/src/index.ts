import express from 'express';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.route';

const app = express();

// connect to the database
import './config/database';

// setup the initial middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

authRoutes(app);

// now we add the error handler
app.use(errorHandler);

app.listen(3000, () => console.log('Listening in port 3000'));