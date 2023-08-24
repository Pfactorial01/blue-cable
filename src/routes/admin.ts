import express, { Router } from "express";

import { checkAuth, checkAdmin } from "../middleware";
import { markUnsafe, revokeSession } from "../controllers/admin";

const adminRouter : Router = express.Router();

adminRouter.post("/mark-file-unsafe", checkAuth, checkAdmin, markUnsafe);
adminRouter.post("/revoke-session-token", checkAuth, checkAdmin, revokeSession);

export default adminRouter;