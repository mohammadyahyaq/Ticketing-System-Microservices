import { Express } from 'express';
import { getUser, signUp } from '../controllers/authController';
import { emailRequired, passwordRequired, showMessages } from '../middleware/bodyCheckers';

export const authRoutes = (app: Express) => {
    // here we will list all the routes for the authentication
    app.get('/api/auth/user', getUser);
    app.post('/api/auth/signup', [emailRequired, passwordRequired, showMessages], signUp);
}