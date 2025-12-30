import React from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { TerminalTab, TerminalInstance } from "./types";

interface TerminalListProps {
    terminal: TerminalTab;
    onCloseInstance: (tabId: string, instanceId: string) => void;
    onReload: () => void;
}

export const TerminalList: React.FC<TerminalListProps> = ({
    terminal,
    onCloseInstance,
    onReload,
}) => {
    return (
        <div className="w-[200px] min-w-[200px] max-w-[250px] border-l border-gray-800 bg-[#1E1E1E]">
            <div className="p-2 text-sm text-gray-400 border-b border-gray-800 flex items-center space-x-2">
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Terminal Instances</span>
                <button onClick={onReload}>reload</button>
            </div>
            <div className="overflow-y-auto">
                {terminal.instances.map((instance) => (
                    <div
                        key={instance.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-[#2D2D2D] group"
                    >
                        <div className="flex items-center space-x-2">
                            <TerminalIcon className="w-3.5 h-3.5 text-gray-500" />
                            <span>
                                {terminal.title} {instance.title}
                            </span>
                        </div>
                        {terminal.instances.length > 1 && (
                            <button
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                                onClick={() => onCloseInstance(terminal.id, instance.id)}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
