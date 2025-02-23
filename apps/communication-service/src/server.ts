import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import logger from "./utils/logger";
import { PORT, CORS_ORIGIN } from "./config";
import { setupSocket } from "./socket";
import fileManager from "./fileManager";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", fileManager);

setupSocket(io);

server.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
