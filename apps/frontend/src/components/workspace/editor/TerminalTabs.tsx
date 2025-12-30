import React from "react";
import { Terminal as TerminalIcon, X, Plus, Split, Sparkles } from "lucide-react";
import { TerminalTab } from "./types";

interface TerminalTabsProps {
    terminals: TerminalTab[];
    activeTerminal: string;
    onTabClick: (id: string) => void;
    onCloseTab: (id: string) => void;
    onNewTerminal: () => void;
    onSplitTerminal: () => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({
    terminals,
    activeTerminal,
    onTabClick,
    onCloseTab,
    onNewTerminal,
    onSplitTerminal,
}) => {
    return (
        <div className="flex items-center bg-[#1E1E1E] text-gray-300 border-t border-gray-800">
            <div className="flex flex-1">
                {terminals.map((term) => (
                    <div
                        key={term.id}
                        className={`group flex items-center h-8 px-3 cursor-pointer border-r border-gray-800 transition-colors ${activeTerminal === term.id ? "bg-black" : "hover:bg-[#2D2D2D]"
                            }`}
                        onClick={() => onTabClick(term.id)}
                    >
                        {term.type === "agent" ? (
                            <Sparkles className="w-3.5 h-3.5 text-purple-500 mr-2" />
                        ) : (
                            <TerminalIcon className="w-4 h-4 text-gray-500 mr-2" />
                        )}
                        <span className="mr-2 text-sm">
                            {term.title}{" "}
                            {term.instances.length > 1 && (
                                <span className="text-gray-500">({term.instances.length})</span>
                            )}
                        </span>
                        {terminals.length > 1 && term.type !== "agent" && (
                            <button
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-2 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseTab(term.id);
                                }}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center h-8 px-2 border-l border-gray-800">
                <button
                    className="p-1.5 hover:bg-[#2D2D2D] rounded-sm transition-colors"
                    onClick={onNewTerminal}
                    title="New Terminal"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                    className="p-1.5 hover:bg-[#2D2D2D] rounded-sm transition-colors ml-1"
                    onClick={onSplitTerminal}
                    title="Split Terminal"
                >
                    <Split className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};
