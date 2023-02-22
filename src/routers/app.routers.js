import { Router } from "express";
import authRouter from "./auth.routers.js";
import rankingRouter from "./rankings.routers.js";
import urlRouter from "./url.routers.js";
import userRouter from "./users.routers.js";



const router = Router();

router.use([authRouter, urlRouter, userRouter, rankingRouter]);

export default router;