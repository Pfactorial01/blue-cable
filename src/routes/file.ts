import express, { Router } from "express";

import { checkAuth } from "../middleware/checkAuth";
import { uploadFile, downloadFile } from "../controllers/file";
import { upload } from "../services/aws";

const fileRouter : Router = express.Router();

fileRouter.post("/upload", checkAuth, upload.single("file"), uploadFile);
fileRouter.get("/download", checkAuth, downloadFile);

export default fileRouter;