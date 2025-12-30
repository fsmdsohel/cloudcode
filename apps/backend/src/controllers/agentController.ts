import { Request, Response } from "express";
import agentService from "../services/agentService";
import logger from "@/utils/logger";

export const generateProject = async (req: Request, res: Response) => {
    try {
        const { workspaceId, prompt } = req.body;

        if (!workspaceId || !prompt) {
            res.status(400).json({ error: "workspaceId and prompt are required" });
            return;
        }

        // Start the agent session asynchronously (fire and forget)
        // The agent will connect to the socket and stream updates.
        agentService.startSession(workspaceId, prompt).catch((err) => {
            logger.error(`Agent Session failed: ${err}`);
        });

        res.status(202).json({
            message: "Agent started. Connect to workspace websocket for updates.",
            workspaceId,
        });
    } catch (error) {
        logger.error(`Error starting agent: ${error}`);
        res.status(500).json({ error: "Failed to start agent" });
    }
};
