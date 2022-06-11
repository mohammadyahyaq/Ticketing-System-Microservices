import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '../Errors/RouteError';
import { User } from '../models/user.model'; // the user model
import { Password } from '../utils/password';

export const getUser = (req: Request, res: Response) => {
    if (!req.session?.jwt) {
        return res.send({ currentUser: null });
    }

    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        );

        res.send({ currentUser: payload });
    } catch (error) {
        console.log({ currentUser: null });
    }
}

export const signOut = (req: Request, res: Response) => {
    req.session = null;
    res.send({});
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

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new RouteError('Invalid credintials', 401);
    }

    const passwordCheck = await Password.compare(existingUser.password, password);
    if (!passwordCheck) {
        throw new RouteError('Invalid credintials', 401);
    }

    /* ------------------- Now sign the cookie ------------------- */

    // generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);

    // Store it in session object
    req.session = { jwt: userJwt };

    console.log('the user is created');
    res.status(200).send(existingUser); // 201 means the record is created successfully! 
}