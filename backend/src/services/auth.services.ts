import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from "jsonwebtoken";

const SALT_ROUNDS = 8
const SECRET_KEY = "THIS_IS_SUPER_SECRET_KEY"

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { algorithm: "HS256", expiresIn: "2 days" })
}

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

// Used as middleware
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error("No token passed to authed endpoint");
        }
        const deocdedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
        req.headers = { ...req.headers, "userId": deocdedToken.id }
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};
