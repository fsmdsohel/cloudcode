import React from "react";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import Terminal from "./Terminal";
import { TerminalTab } from "./types";
import { TerminalList } from "./TerminalList";

interface TerminalSplitViewProps {
    terminal: TerminalTab;
    splitSizes: number[];
    onSplitResize: (sizes: number[]) => void;
    refHandleResize: React.RefObject<Array<{ id: string; fun: () => void }>>;
    onCloseInstance: (tabId: string, instanceId: string) => void;
    onReload: () => void;
}

export const TerminalSplitView: React.FC<TerminalSplitViewProps> = ({
    terminal,
    splitSizes,
    onSplitResize,
    refHandleResize,
    onCloseInstance,
    onReload,
}) => {
    const renderTerminal = (instanceId: string) => (
        <div className="h-full flex-1 flex flex-col">
            <div className="flex-1 border-r border-gray-800">
                <Terminal terminalId={instanceId} refHandleResize={refHandleResize} />
            </div>
        </div>
    );

    if (terminal.instances.length === 1) {
        return (
            <div className="flex flex-1">
                {renderTerminal(terminal.instances[0]!.id)}
                <TerminalList
                    terminal={terminal}
                    onCloseInstance={onCloseInstance}
                    onReload={onReload}
                />
            </div>
        );
    }

    const currentSizes =
        splitSizes.length > 0
            ? splitSizes
            : Array(terminal.instances.length).fill(100 / terminal.instances.length);

    return (
        <div className="flex flex-1">
            <SplitPane
                split="vertical"
                sizes={currentSizes}
                onChange={onSplitResize}
                sashRender={() => (
                    <SashContent className="!w-[1px] !bg-gray-800 hover:!bg-purple-500 hover:!w-[2px]" />
                )}
            >
                {terminal.instances.map((instance) => (
                    <Pane key={instance.id} minSize={100}>
                        {renderTerminal(instance.id)}
                    </Pane>
                ))}
            </SplitPane>
            <TerminalList
                terminal={terminal}
                onCloseInstance={onCloseInstance}
                onReload={onReload}
            />
        </div>
    );
};
