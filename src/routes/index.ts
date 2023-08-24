import express, { Router } from "express";
import authRouter from "./auth";
import folderRouter from "./folder";
import fileRouter from "./file";
import adminRouter from "./admin";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/folder", folderRouter);
router.use("/file", fileRouter);
router.use("/admin", adminRouter)

export default router;