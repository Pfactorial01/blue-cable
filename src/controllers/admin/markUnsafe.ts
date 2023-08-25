import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../services/aws';

const prisma = new PrismaClient()

const markUnsafe = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.session.userId
        const {fileId} = req.body;
        if (!fileId) return res.status(400).json({ message: "fileId missing"});
        const file = await prisma.file.findFirst({
            where: {
                id: fileId
            }
        })
        if (!file) return res.status(404).json({ message: "file not found"});
        if (!file.type.includes("image") && !file.type.includes("video") ) return res.status(400).json({ message: "Only Images and Videos can be marked as unsafe"})
        if ( file.markedby.includes(userId)) return res.status(400).json({ message: "You have already marked this file as unsafe"})
        const updatedFile = await prisma.file.update({
            data: {
                markedby: {
                    push: userId
                },
                safe: false
            },
            where: {
                id: fileId
            }
        })
        if (updatedFile.markedby.length >= 3) {
            await deleteFile(file.key)
            await prisma.file.delete({
                where: {
                    id: fileId
                }
            })
        }
        return res.status(200).json({ message: "File marked as unsafe succesfully"});
    } catch (error) {
        return res.status(500).json({ message: "An error occured" });
    }
}

export default markUnsafe;