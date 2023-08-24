import {hash, compare} from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const login = async (req: Request, res: Response) => {
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
            // @ts-ignore
            req.session.isAuth = true;
            // @ts-ignore
            req.session.userId = user.id;
            return res.status(200).json({ message: "success" });
        } else {
            return res.status(400).json({ message: "password incorrect" });
        }
    }
}

export default login