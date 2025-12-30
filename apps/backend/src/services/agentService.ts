import { io, Socket } from "socket.io-client";
import logger from "@/utils/logger";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { createFileWriteTool, createTerminalExecTool } from "../tools/agentTools";

class AgentService {
    private gatewayUrl = process.env.CONTAINER_GATEWAY_URL || "http://localhost:8002";

    public async startSession(workspaceId: string, prompt: string) {
        logger.info(`Starting Agent Session for workspace ${workspaceId}`);

        const socket = io(this.gatewayUrl);

        socket.on("connect", () => {
            logger.info(`Agent connected to Gateway for workspace ${workspaceId}`);

            // Hook into the terminal session of the workspace
            socket.emit("terminal-connect", { terminalId: workspaceId });

            this.runAgentLoop(socket, workspaceId, prompt);
        });

        socket.on("connect_error", (err) => {
            logger.error(`Agent connection error: ${err.message}`);
        });
    }

    private async runAgentLoop(socket: Socket, workspaceId: string, prompt: string) {
        logger.info(`Agent Planning for: "${prompt}"...`);
        socket.emit("agent:log", { workspaceId, message: "Analyzing your request...", type: "info" });

        try {
            const tools = [
                createFileWriteTool(socket, workspaceId),
                createTerminalExecTool(socket, workspaceId)
            ];

            const llm = new ChatOpenAI({
                modelName: "gpt-4-turbo-preview",
                temperature: 0,
                // Assumes OPENAI_API_KEY is in process.env
            }).bindTools(tools);

            const messages: any[] = [
                new SystemMessage(`You are an expert full-stack developer building an application in a cloud IDE. 
Your goal is to fulfill the user's request by writing files and executing terminal commands.
You have access to a terminal and a file system.

Guidelines:
1. Plan your actions step-by-step.
2. Write necessary files first.
3. Install dependencies using 'npm install' or 'pnpm install' or 'yarn' if needed.
4. Do not ask for user confirmation, just execute.
5. If creating a new project (like React/Vite), assume the folder is empty or create a new one.
6. Make sure to writing index.html / package.json if creating from scratch manually.
`),
                new HumanMessage(prompt)
            ];

            socket.emit("agent:log", { workspaceId, message: "Agent started execution.", type: "info" });

            const MAX_STEPS = 15;
            for (let i = 0; i < MAX_STEPS; i++) {
                const aiMessage = await llm.invoke(messages);
                messages.push(aiMessage);

                if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
                    socket.emit("agent:log", { workspaceId, message: `Executing ${aiMessage.tool_calls.length} actions...`, type: "info" });

                    for (const toolCall of aiMessage.tool_calls) {
                        const tool = tools.find(t => t.name === toolCall.name);
                        if (tool) {
                            try {
                                const output = await (tool as any).invoke(toolCall.args);
                                messages.push(new ToolMessage({
                                    tool_call_id: toolCall.id || "call_" + Math.random().toString(36).substring(7),
                                    content: String(output)
                                }));
                            } catch (err: any) {
                                messages.push(new ToolMessage({
                                    tool_call_id: toolCall.id || "call_" + Math.random().toString(36).substring(7),
                                    content: `Error: ${err.message}`
                                }));
                            }
                        }
                    }
                } else {
                    // Agent finished
                    logger.info("Agent stopped.");
                    break;
                }
            }

            socket.emit("agent:log", { workspaceId, message: "Task completed!", type: "success" });
            logger.info("Agent complete");

            setTimeout(() => {
                socket.disconnect();
            }, 5000);

        } catch (error: any) {
            logger.error("Agent failed:", error);
            socket.emit("agent:log", { workspaceId, message: `Agent Error: ${error.message}`, type: "error" });
            socket.disconnect();
        }
    }
}

export default new AgentService();
