import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '../Errors/RouteError';
import { User } from '../models/user.model'; // the user model

export const getUser = (req: Request, res: Response) => {
    res.status(200).send('Hi there!');
}

export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new RouteError('Email in use', 400);
    }

    const user = User.build({ email, password });
    await user.save();

    // generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    // Store it in session object
    req.session = { jwt: userJwt };

    console.log('the user is created');
    res.status(201).send(user); // 201 means the record is created successfully! 
}

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
}