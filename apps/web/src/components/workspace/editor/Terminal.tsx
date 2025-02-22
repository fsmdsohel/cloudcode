import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface TerminalProps {
  terminalId: string;
  refHandleResize: React.RefObject<Array<{ id: string; fun: () => void }>>;
}

const Terminal: React.FC<TerminalProps> = ({ terminalId, refHandleResize }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const [isClient, setIsClient] = useState(false);
  const terminalIdRef = useRef(terminalId);
  const connectedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Update ref when terminalId changes
  useEffect(() => {
    terminalIdRef.current = terminalId;
  }, [terminalId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !terminalRef.current) return;

    // Initialize Socket.IO connection
    const socket = io("http://localhost:8002", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: maxRetries,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    // Initialize xterm.js
    const xterm = new XTerminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: {
        background: "#000000",
        foreground: "#ffffff",
      },
    });
    xtermRef.current = xterm;

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    // Handle resize
    const handleResize = () => {
      try {
        fitAddon.fit();
        if (connectedRef.current) {
          socket.emit("resize", {
            terminalId: terminalIdRef.current,
            cols: xterm.cols,
            rows: xterm.rows,
          });
        }
      } catch (error) {
        console.error("Resize error:", error);
        toast.error("Failed to resize terminal");
      }
    };

    // Store resize handler in ref
    if (refHandleResize.current) {
      const existingRef = refHandleResize.current.find(
        (ref) => ref.id === terminalIdRef.current
      );
      if (existingRef) {
        existingRef.fun = handleResize;
      } else {
        refHandleResize.current.push({
          id: terminalIdRef.current,
          fun: handleResize,
        });
      }
    }

    const connectTerminal = () => {
      if (retryCountRef.current >= maxRetries) {
        toast.error(
          "Failed to connect to terminal server after multiple attempts"
        );
        return;
      }
      socket.emit("terminal-connect", { terminalId: terminalIdRef.current });
    };

    // Handle connection success
    socket.on("terminal-ready", ({ id }) => {
      if (id === terminalIdRef.current) {
        connectedRef.current = true;
        retryCountRef.current = 0;
        handleResize(); // Initial resize after connection
        // toast.success("Terminal connected successfully");
      }
    });

    // Handle connection error
    socket.on("connect_error", () => {
      if (!connectedRef.current && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        toast.error(
          `Connection failed, retrying... (${retryCountRef.current}/${maxRetries})`
        );
        setTimeout(connectTerminal, 1000);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (connectedRef.current) {
        connectedRef.current = false;
        toast.error("Terminal server disconnected");
      }
    });

    // Initial connection attempt
    connectTerminal();

    // Handle input only after connection is established
    xterm.onData((data) => {
      if (connectedRef.current) {
        socket.emit("input", { terminalId: terminalIdRef.current, data });
      }
    });

    // Handle output
    socket.on("output", (data: { id: string; data: string }) => {
      if (data.id === terminalIdRef.current && xtermRef.current) {
        xtermRef.current.write(data.data);
      }
    });

    // Handle server errors
    socket.on("error", (error: string) => {
      toast.error(`Terminal error: ${error}`);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      connectedRef.current = false;

      if (socketRef.current) {
        socketRef.current.emit("terminal-disconnect", {
          terminalId: terminalIdRef.current,
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      if (xtermRef.current) {
        try {
          xtermRef.current.dispose();
        } catch (error) {
          console.error("Terminal disposal error:", error);
          toast.error("Error cleaning up terminal");
        }
        xtermRef.current = null;
      }

      // Clean up resize handler
      if (refHandleResize.current) {
        refHandleResize.current = refHandleResize.current.filter(
          (ref) => ref.id !== terminalIdRef.current
        );
      }
    };
  }, [isClient]); // Only depend on isClient

  if (!isClient) {
    return <div className="h-full w-full flex-1 bg-black pl-3" />;
  }

  return (
    <div ref={terminalRef} className="h-full w-full flex-1 bg-black pl-3" />
  );
};

export default Terminal;
