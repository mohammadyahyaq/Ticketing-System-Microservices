import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RouteError } from "../Errors/RouteError";

export const emailRequired = body('email')
    .isEmail()
    .withMessage('you need to send an email');


export const passwordRequired = body('password')
    .trim()
    .isLength({ min: 8, max: 40 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);


// we need the following middleware each time we need to validate the req body
export const showMessages = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RouteError(errors.array().map(error => ' ' + error.msg).toString(), 400);
    } else {
        next();
    }
}