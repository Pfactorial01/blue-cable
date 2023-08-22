import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const checkAuth = (req: Request, res: Response, next: any) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });    
    }
}