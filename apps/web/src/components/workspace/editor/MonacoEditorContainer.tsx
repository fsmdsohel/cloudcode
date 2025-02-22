import React, { useState, useCallback, useEffect } from "react";
import { FileCode, X } from "lucide-react";
import EditorPanel from "./EditorPanel";

interface EditorTab {
  id: string;
  path: string;
  content: string;
  language: string;
}

interface MonacoEditorContainerProps {
  onInit?: (api: {
    openFile: (path: string, content: string, language: string) => void;
  }) => void;
}

const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = ({
  onInit,
}) => {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const openFile = useCallback(
    (path: string, content: string, language: string) => {
      const existingTab = tabs.find((tab) => tab.path === path);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }

      const newTab: EditorTab = {
        id: Date.now().toString(),
        path,
        content,
        language,
      };

      setTabs((prev) => [...prev, newTab]);
      setActiveTab(newTab.id);
    },
    [tabs]
  );

  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabId);
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTab(null);
      }
      return newTabs;
    });
  };

  const getFileName = (path: string) => {
    return path.split("/").pop() || path;
  };

  useEffect(() => {
    if (onInit) {
      onInit({ openFile });
    }
  }, [onInit, openFile]);

  return (
    <div className="flex flex-col flex-1">
      {tabs.length > 0 ? (
        <>
          <div className="flex border-b border-gray-800 bg-[#1E1E1E] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center h-9 px-3 border-r border-gray-800 min-w-[150px] max-w-[200px]
                  ${
                    activeTab === tab.id
                      ? "bg-[#0F1117] text-white"
                      : "text-gray-400 hover:bg-[#2D2D2D]"
                  }`}
              >
                <FileCode className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <span className="truncate">{getFileName(tab.path)}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="ml-2 p-0.5 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
          </div>
          <div className="flex-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="h-full"
                style={{
                  display: activeTab === tab.id ? "flex" : "none",
                }}
              >
                <EditorPanel
                  value={tab.content}
                  language={tab.language}
                  onChange={(newValue) => {
                    setTabs((prev) =>
                      prev.map((t) =>
                        t.id === tab.id ? { ...t, content: newValue || "" } : t
                      )
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No files open
        </div>
      )}
    </div>
  );
};

export default MonacoEditorContainer;
