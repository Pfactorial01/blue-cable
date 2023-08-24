import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const checkAdmin = async (req: Request, res: Response, next: any) => {
    // @ts-ignore
    const userId = req.session.userId;
    const user = await prisma.user.findUnique({
        where: {id: userId}        
    })
    if (user?.role === "ADMIN") {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });    
    }
}