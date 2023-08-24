import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const revokeSession = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "userId missing" });
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!user) return res.status(404).json({ message: "user not found" })
        if (user?.role === "ADMIN") return res.status(400).json({ message: "admin session cannot be revoked" })
        const sessionData = await prisma.session.findFirst({
            where: {
                sess: {
                    path: ['userId'],
                    string_contains: userId
                }
            }
        })
        if (!sessionData) return res.status(404).json({ message: "session not found" })
        await prisma.session.delete({
            where: {
                sid: sessionData.sid
            }
        })
        return res.status(200).json({ message: "session deleted" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occured" });
    }    
}

export default revokeSession;