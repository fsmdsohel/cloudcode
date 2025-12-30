export interface TerminalInstance {
    id: string;
    title: string;
}

export interface TerminalTab {
    id: string;
    title: string;
    type: "terminal" | "agent";
    instances: TerminalInstance[];
}
