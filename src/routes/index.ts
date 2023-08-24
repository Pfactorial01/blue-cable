import express, { Router } from "express";
import authRoutes from "./auth";
import folderRoutes from "./folder";
import fileRoutes from "./file";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/folder", folderRoutes);
router.use("/file", fileRoutes);

export default router;