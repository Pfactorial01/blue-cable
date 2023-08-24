import express, { Router } from "express";
import { login, logout, signup } from "../controllers/auth"

const authRouter: Router = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;