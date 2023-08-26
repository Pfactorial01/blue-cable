import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createAWSStream } from '../../services/aws';
import { createWriteStream } from 'fs';

const prisma = new PrismaClient()

const streamFile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore        
        const userId = req.session.userId
        const fileId = req.params.id as string
        if (!fileId) return res.status(400).json({ message: "fileId in query params is required" })
        const fileData = await prisma.file.findUnique({
            where: {
                id: fileId,
                userId
            }
        })
        if (!fileData) return res.status(400).json({ message: "File doesn't exist" })
        if (!fileData.type.includes('video') && !fileData.type.includes('audio')) return res.status(400).json({ message: "Only audio and video can be streamed" })
        const { key, size} = fileData
        const CHUNK_SIZE = 10 ** 6
        const range = req.headers.range || "0";
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, size - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const stream = await createAWSStream(req, res, key)
        stream.pipe(res)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occured" });
    }    
}

export default streamFile;
