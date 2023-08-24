import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fileDownload } from '../../services/aws';

const prisma = new PrismaClient()

const downloadFile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore        
        const userId = req.session.userId
        const fileId = req.query.fileId as string
        if (!fileId) return res.status(400).json({ message: "fileId in query params is required" })
        const fileData = await prisma.file.findUnique({
            where: {
                id: fileId,
                userId
            }
        })
        if (!fileData) return res.status(400).json({ message: "File doesn't exist" })
        const key = fileData.key
        await fileDownload(req, res, key)
    }
     catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occured" });
    }    
}

export default downloadFile;