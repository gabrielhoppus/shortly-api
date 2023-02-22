import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controllers.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { loginSchema, userSchema } from "../schemas/auth.schema.js";



const authRouter = Router();

authRouter.post("/signup", validateSchema(userSchema), createUser);
authRouter.post("/signin", validateSchema(loginSchema), loginUser);

export default authRouter;