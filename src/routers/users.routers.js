import { Router } from "express";
import { getUser } from "../controllers/users.controllers.js";


const userRouter = Router();

userRouter.get("/users/me", getUser);

export default userRouter;