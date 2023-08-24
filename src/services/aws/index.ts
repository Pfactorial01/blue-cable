import aws from "aws-sdk";
import { Request, Response } from "express";
import multer from "multer";
import dotenv from 'dotenv';


dotenv.config();

const awsBucket = process.env.AWS_BUCKET_NAME as string
const awsSecret = process.env.AWS_SECRET_KEY as string
const awsAccessKey = process.env.AWS_ACCESS_KEY as string

const s3 = new aws.S3({
  secretAccessKey: awsSecret,
  accessKeyId: awsAccessKey
});

export const upload = multer({
  limits: {
    parts: Infinity,
    fileSize: 1024 * 1024 * 1 
  },
  storage: multer.memoryStorage()
});

export const fileUpload = async (file: Express.Multer.File, Key: string) => {
  const options = {
    Bucket: awsBucket,
    Key,
    Body: file.buffer,
  }
  return await s3.putObject(options).promise();
}

export const createFolderFn = async (Key: string) => {
  const options = {
    Bucket: awsBucket,
    Key: `${Key}/`
  }
  return await s3.putObject(options).promise();
}

export const checkIfFolderExists = async (Key: string): Promise<boolean> => {
  try {
    const options = {
      Bucket: awsBucket,
      Key: `${Key}/`
    }
    await s3.headObject(options).promise();
    return true;
  } catch (error) {
    return false;
  }
}

export const checkIfFileWithNameExists = async (Key: string): Promise<boolean> => {
  try {
    const options = {
      Bucket: awsBucket,
      Key: `${Key}`
    }
    await s3.headObject(options).promise();
    return true;
  } catch (error) {
    return false;
  }
}

// export const deleteSingleFile = async (
//   req: Request,
//   filepath: string
// ): Promise<void> => {
//   const params = { Bucket: awsBucket, Key: filepath };

//   await s3.deleteObject(params, (err) => {
//     if (err) throw new Error(err.message);
//     else logger.info(formatLog(req, `Deleted file with key "${filepath}"`));
//   });
// };

export const fileDownload = async (
  req: Request,
  res: Response,
  filepath: string
): Promise<void> => {
  const options = {
    Bucket: awsBucket,
    Key: filepath
  };

  res.attachment(filepath);
  const fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
};

// export const deleteMultipleFiles = async (
//   req: Request,
//   filepaths: { Key: string }[]
// ): Promise<void> => {
//   logger.info(
//     formatLog(
//       req,
//       `Deleting files with filepaths "${JSON.stringify(filepaths)}"`
//     )
//   );

//   const params = { Bucket: awsBucket, Delete: { Objects: filepaths } };

//   await s3.deleteObjects(params, (err) => {
//     if (err) throw new Error(err.message);
//     else
//       logger.info(
//         formatLog(
//           req,
//           `Deleted files with filepaths "${JSON.stringify(filepaths)}`
//         )
//       );
//   });
// };