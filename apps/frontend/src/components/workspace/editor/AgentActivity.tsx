import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Loader2, FileText, Terminal, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface AgentLog {
    id: string;
    message: string;
    type: "info" | "action" | "success" | "error";
    timestamp: Date;
}

export const AgentActivity = () => {
    const params = useParams() as { workspaceId: string };
    const workspaceId = params?.workspaceId;
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!workspaceId) return;

        const socket = io("http://localhost:8002", {
            transports: ["websocket"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("AgentActivity connected to gateway");
            socket.emit("workspace:join", { workspaceId });
        });

        socket.on("agent:log", (data: { message: string, type: any, timestamp: string }) => {
            setLogs(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                message: data.message,
                type: data.type,
                timestamp: new Date(data.timestamp)
            }]);
        });

        socket.on("agent:file:update", (data: { path: string, action: string }) => {
            setLogs(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                message: `${data.action === 'write' ? 'Updated' : 'Read'} file: ${data.path}`,
                type: "action",
                timestamp: new Date()
            }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [workspaceId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getIcon = (type: string) => {
        switch (type) {
            case "info": return <Info className="w-4 h-4 text-blue-400" />;
            case "action": return <Terminal className="w-4 h-4 text-purple-400" />;
            case "success": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case "error": return <Info className="w-4 h-4 text-red-400" />; // Use alert icon if available
            default: return <Info className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1E1E1E] text-sm font-mono">
            <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                <span className="text-gray-300 font-medium">Agent Activity</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {logs.length === 0 && (
                    <div className="text-gray-500 italic text-center mt-10">
                        Waiting for agent actions...
                    </div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mt-0.5 flex-shrink-0">
                            {getIcon(log.type)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-300">{log.message}</span>
                            <span className="text-[10px] text-gray-600">
                                {log.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
