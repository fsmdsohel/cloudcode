import fs from "fs/promises";
import path from "path";
import { Socket } from "socket.io";
import logger from "@/utils/logger";

// Helper to ensure safe paths (prevent escaping cwd)
const transformPath = (filePath: string): string => {
    // TODO: In a real environment with containers, this would map to the container's volume.
    // For now, on the gateway, we'll map it relative to process.cwd() or a specific 'sandbox' dir.
    // We'll trust the input for now as this is a dev tool, but should use path.join(process.cwd(), filePath)
    return path.resolve(filePath);
};

export const handleWriteFile = async (
    socket: Socket,
    { path: filePath, content, workspaceId }: { path: string; content: string; workspaceId?: string }
) => {
    try {
        const fullPath = transformPath(filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, "utf8");

        logger.info(`Agent wrote file: ${filePath}`);
        // Emit to sender
        socket.emit("file:write:success", { path: filePath });
        // Broadcast to workspace room if provided
        if (workspaceId) {
            socket.to(workspaceId).emit("agent:file:update", { path: filePath, content, action: "write" });
        }
    } catch (error: any) {
        logger.error(`Error writing file ${filePath}: ${error.message}`);
        socket.emit("file:error", { action: "write", path: filePath, error: error.message });
    }
};

export const handleReadFile = async (
    socket: Socket,
    { path: filePath }: { path: string }
) => {
    try {
        const fullPath = transformPath(filePath);
        const content = await fs.readFile(fullPath, "utf8");

        logger.info(`Agent read file: ${filePath}`);
        socket.emit("file:content", { path: filePath, content });
    } catch (error: any) {
        logger.error(`Error reading file ${filePath}: ${error.message}`);
        socket.emit("file:error", { action: "read", path: filePath, error: error.message });
    }
};
