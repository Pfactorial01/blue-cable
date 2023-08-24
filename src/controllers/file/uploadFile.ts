import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { checkIfFolderExists, fileUpload, checkIfFileWithNameExists } from '../../services/aws';

const prisma = new PrismaClient()

const uploadFile = async (req: Request, res: Response) => {
    try {
                // @ts-ignore
        const userId = req.session.userId
        const {folderName} = req.body
        if (!folderName) return res.status(400).send('Folder name is required')
        const existingFolder = await checkIfFolderExists(`${userId}/${folderName}`)
        if (!existingFolder) {
            return res.status(400).json({ message: "Folder doesn't exist, create folder first" });
        }
        const file = req.file
        const filename = file?.originalname
        const key = `${userId}/${folderName}/${filename}`
        const existingFile = await checkIfFileWithNameExists(key)
        if (existingFile) return res.status(400).json({ message: "File with this name already exists in this folder" })
        if (file) {
            await fileUpload(file, key)
            const fileData = await prisma.file.create({
                data: {
                    name: filename as string,
                    key: key,
                    userId,
                    type: file.mimetype,
                }
            })
            return res.status(200).json({ message: "File uploaded successfully", fileId: fileData.id});
        }
        return res.status(400).json({ message: "File is required" });
    } catch (error) {
        return res.status(500).json({ message: "An error occured" });
    }
}

export default uploadFile;