import express, { Router } from "express";

import { checkAuth } from "../middleware/checkAuth";
import { uploadFile, downloadFile, streamFile } from "../controllers/file";
import { upload } from "../services/aws";

const fileRouter : Router = express.Router();

fileRouter.post("/upload", checkAuth, upload.single("file"), uploadFile);
fileRouter.get("/download/:id", checkAuth, downloadFile);
fileRouter.get("/stream/:id", checkAuth, streamFile);

export default fileRouter;