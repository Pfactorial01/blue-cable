import {hash} from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const signup = async (req: Request, res: Response) => {
    const { fullname, email, password, admin } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "fullname, email or password missing" });    
    }
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (existingUser) {
        return res.status(400).json({ message: "user already exists" });    
    }
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
        data: {
            email,
            fullname,
            password: passwordHash,
            role: admin === "true" ? "ADMIN" : "REGULAR"
        }
    })
    return res.status(200).json({ message: "success", userId: user.id });
}

export default signup