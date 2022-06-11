import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '../Errors/RouteError';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

// the reason for this middleware is to serialize the user from the cookie to req.user
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.jwt) {
        try {
            const payload = await jwt.verify(
                req.session.jwt,
                process.env.JWT_KEY!
            ) as UserPayload;
            req.user = payload;
        } catch (error) {}
    }
    return next();
}


export const authRequired = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new RouteError('Not authorized', 401);
    }
    next();
}