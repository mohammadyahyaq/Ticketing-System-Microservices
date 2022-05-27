import { NextFunction, Request, Response } from "express";
import { RouteError } from '../Errors/RouteError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof RouteError) {
        return res.status(err.statusCode).send(err.message);
    } else {
        // in this state the error is un-expected error where there is no status code in the error object
        res.status(500).send(err.message)
    }
}