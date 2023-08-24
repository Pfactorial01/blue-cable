import express, { Router } from "express";
import { login, logout, signup } from "../controllers/auth";
import { checkAuth } from "../middleware";

const authRouter: Router = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", checkAuth, logout);

export default authRouter;