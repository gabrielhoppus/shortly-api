import { Router } from "express";
import { getRankings } from "../controllers/rankings.controllers.js";

const rankingRouter = Router();

rankingRouter.get("/ranking", getRankings);

export default rankingRouter;