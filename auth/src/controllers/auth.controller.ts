import { Request, Response } from 'express';

export const getUser = (req: Request, res: Response) => {
    res.status(200).send('Hi there!');
}

export const signUp = (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log('Creating a user...');
    res.status(200).send({ email, password });
}