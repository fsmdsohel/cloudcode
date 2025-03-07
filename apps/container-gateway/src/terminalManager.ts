import { spawn, IPty } from "node-pty";
import treeKill from "tree-kill";
import logger from "@/utils/logger";

interface TerminalInstance {
  pty: IPty;
  socket: any;
}

const terminals: { [key: string]: TerminalInstance } = {};

export const createTerminal = (terminalId: string, socket: any) => {
  if (!terminals[terminalId]) {
    const ptyProcess = spawn("bash", [], {
      name: "xterm-256color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.cwd(),
      env: {
        ...process.env,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
      },
    });

    terminals[terminalId] = {
      pty: ptyProcess,
      socket: socket,
    };

    ptyProcess.onData((data: string) => {
      socket.emit("output", { id: terminalId, data });
    });

    setTimeout(() => {
      socket.emit("terminal-ready", { id: terminalId });
    }, 100);

    logger.debug(
      `Terminal ${terminalId} process started with PID ${ptyProcess.pid}`
    );
  } else {
    terminals[terminalId].socket = socket;
    logger.debug(`Terminal ${terminalId} reconnected to existing process`);
  }
};

export const writeInput = (terminalId: string, data: string) => {
  const terminal = terminals[terminalId];
  if (terminal) {
    terminal.pty.write(data);
  } else {
    logger.warn(`Received input for non-existent terminal ${terminalId}`);
  }
};

export const resizeTerminal = (
  terminalId: string,
  cols: number,
  rows: number
) => {
  const terminal = terminals[terminalId];
  if (terminal) {
    terminal.pty.resize(cols, rows);
    logger.debug(`Terminal ${terminalId} resized to ${cols}x${rows}`);
  }
};

export const killTerminal = async (terminalId: string) => {
  const terminal = terminals[terminalId];
  if (terminal) {
    await new Promise<void>((resolve) => {
      treeKill(terminal.pty.pid, "SIGTERM", (err) => {
        if (err) {
          logger.error(`Error killing terminal ${terminalId}: ${err}`);
        }
        terminal.pty.kill();
        delete terminals[terminalId];
        resolve();
      });
    });
  }
};

export const cleanupTerminalsForSocket = async (socketId: string) => {
  const terminalIds = Object.entries(terminals)
    .filter(([_, terminal]) => terminal.socket.id === socketId)
    .map(([id]) => id);

  logger.debug(
    `Cleaning up ${terminalIds.length} terminals for client ${socketId}`
  );

  for (const terminalId of terminalIds) {
    await killTerminal(terminalId);
  }
};
