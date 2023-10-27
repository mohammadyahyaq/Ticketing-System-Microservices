import { Express } from 'express';
import { getUser, signIn, signOut, signUp } from '../controllers/auth.controller';
import { emailRequired, passwordRequired, showMessages } from '@mohammadyahyaq-learning/common';

export const authRoutes = (app: Express) => {
    // here we will list all the routes for the authentication
    app.get('/api/auth/user', getUser);

    app.post('/api/auth/signout', signOut);

    app.post('/api/auth/signup', [emailRequired, passwordRequired, showMessages], signUp);

    app.post('/api/auth/signin', [emailRequired, passwordRequired, showMessages], signIn);
}