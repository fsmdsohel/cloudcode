import { Server } from "socket.io";
import logger from "./utils/logger";
import {
  createTerminal,
  writeInput,
  resizeTerminal,
  killTerminal,
  cleanupTerminalsForSocket,
} from "./terminalManager";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on("terminal-connect", ({ terminalId }) => {
      logger.info(`Terminal ${terminalId} connected from client ${socket.id}`);
      createTerminal(terminalId, socket);
    });

    socket.on("input", ({ terminalId, data }) => {
      writeInput(terminalId, data);
    });

    socket.on("resize", ({ terminalId, cols, rows }) => {
      resizeTerminal(terminalId, cols, rows);
    });

    socket.on("terminal-disconnect", async ({ terminalId }) => {
      logger.info(
        `Terminal ${terminalId} disconnected from client ${socket.id}`
      );
      await killTerminal(terminalId);
    });

    socket.on("disconnect", async () => {
      logger.info(`Client disconnected: ${socket.id}`);
      await cleanupTerminalsForSocket(socket.id);
    });
  });
};
