import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const AUTH_KEY: string = process.env.ROUTE_AUTH_STRING || '';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authKey = req.headers.authorization;
    console.log(authKey);
    if (!authKey || authKey !== AUTH_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

export default authMiddleware;
