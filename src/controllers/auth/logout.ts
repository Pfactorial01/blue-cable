import {hash, compare} from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const logout = async (req: Request, res: Response) => {
    req.session.destroy(() => {
        return res.status(200).json({ message: "success" });
        }
    )    
}

export default logout;