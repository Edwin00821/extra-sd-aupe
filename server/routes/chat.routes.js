import { Router } from "express";
import { getMessage, chat } from "../controllers/chat.controller.js";

const router = Router();


router.get("/", chat);
router.get("/example", getMessage);

export default router;
