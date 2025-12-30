"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { AgentActivity } from "./AgentActivity";
import { TerminalTab } from "./types";
import { TerminalTabs } from "./TerminalTabs";
import { TerminalSplitView } from "./TerminalSplitView";

interface TerminalContainerProps {
  refHandleResize: React.RefObject<Array<{ id: string; fun: () => void }>>;
}

const MAX_GROUP_TERMINALS = 2;
const MAX_ROOT_TERMINALS = 4;

const TerminalContainer = ({ refHandleResize }: TerminalContainerProps) => {
  const [terminals, setTerminals] = useState<TerminalTab[]>([
    { id: "agent", title: "Agent", type: "agent", instances: [] },
    { id: "1", title: "Terminal", type: "terminal", instances: [{ id: "1-1", title: "1" }] },
  ]);
  const [activeTerminal, setActiveTerminal] = useState("agent");
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
    const totalInstances = terminals.reduce((acc, term) => acc + term.instances.length, 0);

    if (totalInstances >= MAX_ROOT_TERMINALS) {
      toast.error(`Maximum limit of ${MAX_ROOT_TERMINALS} terminals reached. Please close an existing terminal before creating a new one.`);
      return;
    }

    const newId = (terminals.length + 1).toString();
    const newTerminal: TerminalTab = {
      id: newId,
      title: "Terminal",
      type: "terminal",
      instances: [{ id: `${newId}-1`, title: "1" }],
    };
    setTerminals((prev) => [...prev, newTerminal]);
    setActiveTerminal(newId);
  };

  const handleSplitTerminal = () => {
    const currentTerminal = terminals.find((t) => t.id === activeTerminal);
    if (!currentTerminal || currentTerminal.type === "agent") return;

    const totalInstances = terminals.reduce((acc, term) => acc + term.instances.length, 0);

    if (totalInstances >= MAX_ROOT_TERMINALS) {
      toast.error("Maximum number of terminals reached at root level.");
      return;
    }

    if (currentTerminal.instances.length >= MAX_GROUP_TERMINALS) {
      toast.error("Maximum number of terminals reached in this group.");
      return;
    }

    const newInstanceId = `${currentTerminal.id}-${currentTerminal.instances.length + 1}`;
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
            const instances = term.instances.filter((inst) => inst.id !== instanceId);
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

  return (
    <div className="flex flex-col flex-1 bg-black">
      <TerminalTabs
        terminals={terminals}
        activeTerminal={activeTerminal}
        onTabClick={setActiveTerminal}
        onCloseTab={handleCloseTerminal}
        onNewTerminal={handleNewTerminal}
        onSplitTerminal={handleSplitTerminal}
      />
      <div className="flex-1">
        {terminals.map((term) => (
          <div
            key={term.id}
            style={{
              display: term.id === activeTerminal ? "flex" : "none",
              height: "100%",
              flexDirection: "column",
            }}
          >
            {term.type === "agent" ? (
              <AgentActivity />
            ) : (
              <TerminalSplitView
                terminal={term}
                splitSizes={splitSizesRef.current[term.id] || []}
                onSplitResize={handleSplitResize}
                refHandleResize={refHandleResize}
                onCloseInstance={handleCloseTerminal}
                onReload={() => refHandleResize.current.forEach((ref) => ref.fun())}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalContainer;
