"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Terminal as TerminalIcon, X, Plus, Split } from "lucide-react";
import Terminal from "./Terminal";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import { toast } from "sonner";
interface TerminalTab {
  id: string;
  title: string;
  instances: TerminalInstance[];
}

interface TerminalInstance {
  id: string;
  title: string;
}

interface TerminalContainerProps {
  refHandleResize: React.RefObject<Array<{ id: string; fun: () => void }>>;
}

const MAX_GROUP_TERMINALS = 2; // Maximum number of terminal instances per group
const MAX_ROOT_TERMINALS = 4; // Maximum number of terminal instances at root level

const TerminalContainer = ({ refHandleResize }: TerminalContainerProps) => {
  const [terminals, setTerminals] = useState<TerminalTab[]>([
    {
      id: "1",
      title: "Terminal",
      instances: [{ id: "1-1", title: "1" }],
    },
  ]);
  const [activeTerminal, setActiveTerminal] = useState("1");
  const [splitSizes, setSplitSizes] = useState<number[]>([]);
  const splitSizesRef = useRef<{ [key: string]: number[] }>({});

  const updateSplitSizes = useCallback(
    (terminalId: string, count: number) => {
      if (count <= 0) {
        delete splitSizesRef.current[terminalId];
        setSplitSizes([]);
        return;
      }

      const equalSize = 100 / count;
      const newSizes = Array(count).fill(equalSize);
      splitSizesRef.current[terminalId] = newSizes;
      if (terminalId === activeTerminal) {
        setSplitSizes(newSizes);
      }
    },
    [activeTerminal]
  );

  const handleNewTerminal = () => {
    const totalInstances = terminals.reduce(
      (acc, term) => acc + term.instances.length,
      0
    );

    if (totalInstances >= MAX_ROOT_TERMINALS) {
      toast.error(
        `Maximum limit of ${MAX_ROOT_TERMINALS} terminals reached. Please close an existing terminal before creating a new one.`
      );
      return;
    }

    const newId = (terminals.length + 1).toString();
    const newTerminal: TerminalTab = {
      id: newId,
      title: "Terminal",
      instances: [{ id: `${newId}-1`, title: "1" }],
    };
    setTerminals((prev) => [...prev, newTerminal]);
    setActiveTerminal(newId);
  };

  const handleSplitTerminal = () => {
    const currentTerminal = terminals.find((t) => t.id === activeTerminal);
    if (!currentTerminal) return;

    const totalInstances = terminals.reduce(
      (acc, term) => acc + term.instances.length,
      0
    );

    if (totalInstances >= MAX_ROOT_TERMINALS) {
      toast.error("Maximum number of terminals reached at root level.");
      return;
    }

    if (currentTerminal.instances.length >= MAX_GROUP_TERMINALS) {
      toast.error("Maximum number of terminals reached in this group.");
      return;
    }

    const newInstanceId = `${currentTerminal.id}-${
      currentTerminal.instances.length + 1
    }`;
    const newInstance = {
      id: newInstanceId,
      title: (currentTerminal.instances.length + 1).toString(),
    };

    setTerminals((prev) =>
      prev.map((term) => {
        if (term.id === activeTerminal) {
          const newInstances = [...term.instances, newInstance];
          updateSplitSizes(term.id, newInstances.length);
          return { ...term, instances: newInstances };
        }
        return term;
      })
    );
  };

  const handleCloseTerminal = (tabId: string, instanceId?: string) => {
    if (terminals.length === 1 && !instanceId) return;

    setTerminals((prev) => {
      if (instanceId) {
        const updatedTerminals = prev.map((term) => {
          if (term.id === tabId) {
            const instances = term.instances.filter(
              (inst) => inst.id !== instanceId
            );
            if (instances.length === 0) {
              delete splitSizesRef.current[tabId];
              return null;
            }
            updateSplitSizes(tabId, instances.length);
            return { ...term, instances };
          }
          return term;
        });
        return updatedTerminals.filter(Boolean) as TerminalTab[];
      }
      delete splitSizesRef.current[tabId];
      return prev.filter((t) => t.id !== tabId);
    });

    if (activeTerminal === tabId) {
      const nextTerminal = terminals[0];
      if (nextTerminal) {
        setActiveTerminal(nextTerminal.id);
        setSplitSizes(splitSizesRef.current[nextTerminal.id] || []);
      }
    }
  };

  const handleSplitResize = (newSizes: number[]) => {
    if (newSizes.length > 0 && newSizes.every((size) => !isNaN(size))) {
      splitSizesRef.current[activeTerminal] = newSizes;
      setSplitSizes(newSizes);
    }
  };

  useEffect(() => {
    setSplitSizes(splitSizesRef.current[activeTerminal] || []);
  }, [activeTerminal]);

  const renderTerminal = (instanceId: string) => (
    <div className="h-full flex-1 flex flex-col">
      <div className="flex-1 border-r border-gray-800">
        <Terminal terminalId={instanceId} refHandleResize={refHandleResize} />
      </div>
    </div>
  );

  console.log(refHandleResize.current);

  const renderTerminalInstances = (terminal: TerminalTab) => (
    <div className="w-[200px] min-w-[200px] max-w-[250px] border-l border-gray-800 bg-[#1E1E1E]">
      <div className="p-2 text-sm text-gray-400 border-b border-gray-800 flex items-center space-x-2">
        <TerminalIcon className="w-3.5 h-3.5" />
        <span>Terminal Instances</span>
        <button
          onClick={() => {
            refHandleResize.current.forEach((ref) => ref.fun());
          }}
        >
          reload
        </button>
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
                onClick={() => handleCloseTerminal(terminal.id, instance.id)}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSplitTerminals = (terminal: TerminalTab) => {
    if (terminal.instances.length === 1) {
      return (
        <div className="flex flex-1">
          {renderTerminal(terminal.instances[0].id)}
          {renderTerminalInstances(terminal)}
        </div>
      );
    }

    const currentSizes =
      splitSizesRef.current[terminal.id] ||
      Array(terminal.instances.length).fill(100 / terminal.instances.length);

    return (
      <div className="flex flex-1">
        <SplitPane
          split="vertical"
          sizes={currentSizes}
          onChange={handleSplitResize}
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
        {renderTerminalInstances(terminal)}
      </div>
    );
  };

  const renderTerminalTab = (term: TerminalTab) => (
    <div
      key={term.id}
      className={`group flex items-center h-8 px-3 cursor-pointer border-r border-gray-800 transition-colors
        ${activeTerminal === term.id ? "bg-black" : "hover:bg-[#2D2D2D]"}`}
      onClick={() => setActiveTerminal(term.id)}
    >
      <TerminalIcon className="w-4 h-4 text-gray-500 mr-2" />
      <span className="mr-2 text-sm">
        {term.title}{" "}
        {term.instances.length > 1 && (
          <span className="text-gray-500">({term.instances.length})</span>
        )}
      </span>
      {terminals.length > 1 && (
        <button
          className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-2 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleCloseTerminal(term.id);
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 bg-black">
      <div className="flex items-center bg-[#1E1E1E] text-gray-300 border-t border-gray-800">
        <div className="flex flex-1">{terminals.map(renderTerminalTab)}</div>
        <div className="flex items-center h-8 px-2 border-l border-gray-800">
          <button
            className="p-1.5 hover:bg-[#2D2D2D] rounded-sm transition-colors"
            onClick={handleNewTerminal}
            title="New Terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#2D2D2D] rounded-sm transition-colors ml-1"
            onClick={handleSplitTerminal}
            title="Split Terminal"
          >
            <Split className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        {terminals.map((term) => (
          <div
            key={term.id}
            style={{
              display: term.id === activeTerminal ? "flex" : "none",
              height: "100%",
            }}
          >
            {renderSplitTerminals(term)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalContainer;
