import {hash, compare} from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email or password missing" });
    }
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }
    if (user) {
        const isMatch = await compare(password, user.password);
        if (isMatch) {
            req.session.isAuth = true;
            req.session.user = user.email;
            return res.status(200).json({ message: "success" });
        } else {
            return res.status(400).json({ message: "password incorrect" });
        }
    }
}

export const signup = async (req: Request, res: Response) => {
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
    await prisma.user.create({
        data: {
            email,
            fullname,
            password: passwordHash,
            role: admin === "true" ? "ADMIN" : "REGULAR"
        }
    })
    return res.status(200).json({ message: "success" });
}

export const logout = async (req: Request, res: Response) => {
    req.session.destroy(() => {
        return res.status(200).json({ message: "success" });
        }
    )    
}