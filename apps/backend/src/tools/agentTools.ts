import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Socket } from "socket.io-client";

const fileWriteSchema = z.object({
    path: z.string().describe("The relative path of the file to write (e.g., src/App.tsx)"),
    content: z.string().describe("The full content of the file")
});

type FileWriteInput = z.infer<typeof fileWriteSchema>;

const terminalExecSchema = z.object({
    command: z.string().describe("The shell command to execute")
});

type TerminalExecInput = z.infer<typeof terminalExecSchema>;

export const createFileWriteTool = (socket: Socket, workspaceId: string) => {
    return new DynamicStructuredTool<typeof fileWriteSchema>({
        name: "file_write",
        description: "Write content to a file in the workspace. Use this to create or update files.",
        schema: fileWriteSchema,
        func: async ({ path, content }: FileWriteInput) => {
            socket.emit("agent:log", { workspaceId, message: `Creating file: ${path}`, type: "action" });
            socket.emit("file:write", { path, content, workspaceId });
            return `File ${path} written successfully.`;
        }
    });
};

export const createTerminalExecTool = (socket: Socket, workspaceId: string) => {
    return new DynamicStructuredTool<typeof terminalExecSchema>({
        name: "terminal_exec",
        description: "Execute a shell command in the workspace terminal. Use this to install dependencies, run tests, etc.",
        schema: terminalExecSchema,
        func: async ({ command }: TerminalExecInput) => {
            socket.emit("agent:log", { workspaceId, message: `Running command: ${command}`, type: "action" });
            socket.emit("input", {
                terminalId: workspaceId,
                data: `${command}\r`
            });
            // Wait a bit for command to potentially start/finish. 
            // In a real robust system, we would wait for a specific exit code or prompt.
            await new Promise(resolve => setTimeout(resolve, 2000));
            return `Command "${command}" sent to terminal.`;
        }
    });
};
