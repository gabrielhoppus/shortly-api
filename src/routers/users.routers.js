import { Router } from "express";
import { getUser } from "../controllers/users.controllers.js";
import { validateToken } from "../middleware/token.middleware.js";


const userRouter = Router();

userRouter.get("/users/me",validateToken, getUser);

export default userRouter;