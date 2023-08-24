import { Request, Response } from 'express';
import { createFolderFn, checkIfFolderExists }  from "../../services/aws";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const createFolder = async (req: Request, res: Response) => {
    try {
        const { folderName } = req.body;
        if (!folderName) {
            return res.status(400).json({ message: "folderName missing" });
        }
        // @ts-ignore
        const userId = req.session.userId
        const existingFolder = await checkIfFolderExists(`${userId}/${folderName}`)
        if (existingFolder) {
            return res.status(400).json({ message: "Folder already exists" });
        }
        const result = await createFolderFn(`${userId}/${folderName}`);
        if (result) {
            return res.status(200).json({ message: "Folder created" });
        } else {
            return res.status(400).json({ message: "An error occured, Folder not created" });
        }   
    }
     catch (error) {
        console.log(error)
        return res.status(400).json({ message: "An error occured" });
     }
}

export default createFolder