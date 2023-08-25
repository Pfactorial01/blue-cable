import {hash, compare} from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const logout = async (req: Request, res: Response) => {
    // @ts-ignore        
    const userId = req.session.userId
    const sessionData = await prisma.session.findFirst({
        where: {
            sess: {
                path: ['userId'],
                string_contains: userId
            }
        }
    })
    if (!sessionData) return res.status(401).json({ message: "Unauthorized" })
    await prisma.session.delete({
        where: {
            sid: sessionData.sid
        }
    })
    req.session.destroy(() => {
        return res.status(200).json({ message: "success" });
        }
    )    
}

export default logout;