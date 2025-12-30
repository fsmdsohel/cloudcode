import { Router } from "express";
import { generateProject } from "../controllers/agentController";

const router = Router();

router.post("/generate", generateProject);

export default router;
