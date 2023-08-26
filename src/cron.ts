import cron from "node-cron";
import { PrismaClient } from '@prisma/client';
import { deleteFile } from './services/aws';

const prisma = new PrismaClient()

const deleteUnsafeFilesCron = cron.schedule("0 * * * *", async () => {
    const files = await prisma.file.findMany({
        where: {
            safe: false
        }
    })
    await prisma.file.deleteMany({
        where: {
            safe: false
        }
    })
    for (const file of files) {
        await deleteFile(file.key)
    }
})

export default deleteUnsafeFilesCron;