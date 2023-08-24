import express, { Router } from "express";
import createFolder from "../controllers/folder/createFolder";
import { checkAuth } from "../middleware/checkAuth";

const folderRouter : Router = express.Router();

folderRouter.post("/create", checkAuth, createFolder);

export default folderRouter;