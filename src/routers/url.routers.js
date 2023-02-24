import { Router } from "express";
import { deleteURL, getURL, openURL, shortenURL } from "../controllers/url.controllers.js";
import { validateToken } from "../middleware/token.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { urlSchema } from "../schemas/url.schema.js";



const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, validateSchema(urlSchema), shortenURL);
urlRouter.get("/urls/:id", getURL);
urlRouter.get("/urls/open/:shortUrl", openURL);
urlRouter.delete("/urls/:id", validateToken, deleteURL);

export default urlRouter;