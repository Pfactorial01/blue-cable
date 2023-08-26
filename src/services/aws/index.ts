import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import {S3ReadStream} from 's3-readstream';
import { Request, Response } from "express";
import multer from "multer";
import dotenv from 'dotenv';
import {Readable} from 'stream';

dotenv.config();

const awsBucket = process.env.AWS_BUCKET_NAME as string
const awsSecret = process.env.AWS_SECRET_KEY as string
const awsAccessKey = process.env.AWS_ACCESS_KEY as string
const awsRegion = process.env.AWS_BUCKET_REGION as string

const s3 = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecret
    }
});

export const upload = multer({
  limits: {
    parts: Infinity,
    fileSize: 1024 * 1024 * 200
  },
  storage: multer.memoryStorage()
});

export const fileUpload = async (file: Express.Multer.File, Key: string) => {
    const options = {
        Bucket: awsBucket,
        Key,
        Body: file.buffer,
    }
    const command = new PutObjectCommand(options)
    return await s3.send(command)
}

export const createFolderFn = async (Key: string) => {
    const options = {
      Bucket: awsBucket,
      Key: `${Key}/`
    }
    const command = new PutObjectCommand(options)
    return await s3.send(command)
  }

export const checkIfFolderExists = async (Key: string): Promise<boolean> => {
    try {
      const options = {
        Bucket: awsBucket,
        Key: `${Key}/`
      }
      const command = new HeadObjectCommand(options)  
      await s3.send(command)    
      return true;
    } catch (error) {
      return false;
    }
}

export const checkIfFileWithNameExists = async (Key: string): Promise<boolean> => {
    try {
      const options = {
        Bucket: awsBucket,
        Key
      }
      const command = new HeadObjectCommand(options)  
      await s3.send(command)   
      return true;
    } catch (error) {
      return false;
    }
}

export const fileDownload = async (
    req: Request,
    res: Response,
    filepath: string
  ): Promise<void> => {
    const options = {
      Bucket: awsBucket,
      Key: filepath,
    };  
    res.attachment(filepath);
    const command = new GetObjectCommand(options)
    const file = await s3.send(command);
    const fileStream = file.Body as Readable
    fileStream.pipe(res);
};

export const createAWSStream = async (
  req: Request,
  res: Response,
  filepath: string,
  start: number,
  end: number
): Promise<void> => {
  const options = {
    Bucket: awsBucket,
    Key: filepath,
    Range: `bytes=${start}-${end}`
  };  
  res.attachment(filepath);
  const command = new GetObjectCommand(options)
  const file = await s3.send(command);
  const fileStream = file.Body as Readable
  fileStream.pipe(res);
};

// export async function createAWSStream(req: Request, res: Response, Key: string) {
//     const bucketParams = {
//         Bucket: awsBucket,
//         Key,
//         Range: 'bytes=0-1024'
//     }
//     const headObjectCommand = new HeadObjectCommand(bucketParams);
//     const headObject = await s3.send(headObjectCommand);
//     const maxLength = headObject.ContentLength as number;
//     const options = {
//     s3,
//     command: new GetObjectCommand(bucketParams),
//     maxLength,
//     byteRange: 1024 * 1024
//     };
//     const stream = new S3ReadStream(options);
//     return stream
// }

export const deleteFile = async (
  filepath: string
): Promise<void> => {
  const params = { Bucket: awsBucket, Key: filepath };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};