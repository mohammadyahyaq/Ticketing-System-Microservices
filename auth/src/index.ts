import express from 'express';
import { authRoutes } from './routes/authRoutes';

const app = express();

// setup the initial middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

authRoutes(app);

app.listen(3000, () => console.log('Listening in port 3000'));