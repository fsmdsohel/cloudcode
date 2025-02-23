"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import "@xterm/xterm/css/xterm.css";
import FileExplorer from "@/components/workspace/editor/FileExplorer";
import Sidebar from "@/components/workspace/layout/Sidebar";
import dynamic from "next/dynamic";
import Browser from "@/components/workspace/browser/Browser";
import TopBar from "@/components/workspace/layout/TopBar";
import BottomBar from "@/components/workspace/layout/BottomBar";
import { Globe, X, Loader2 } from "lucide-react";
import MonacoEditorContainer from "@/components/workspace/editor/MonacoEditorContainer";
import { EditorProvider } from "@/components/workspace/editor/EditorProvider";

const TerminalContainer = dynamic(
  () => import("@/components/workspace/editor/TerminalContainer"),
  {
    ssr: false,
  }
);

const WorkspacePage: React.FC = () => {
  const params = useParams() as { workspaceId: string };
  const workspaceId = params?.workspaceId ?? "";

  const refHandleResize = useRef<Array<{ id: string; fun: () => void }>>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<(number | string)[]>([
    280,
    "auto",
  ]);
  const [editorTerminalHeight, setEditorTerminalHeight] = useState<
    (number | string)[]
  >([400, 200]);
  const [editorBrowserWidth, setEditorBrowserWidth] = useState<
    (number | string)[]
  >(["auto", "auto"]);
  const [editorRef, setEditorRef] = useState<{
    openFile: (path: string, content: string, language: string) => void;
  } | null>(null);

  const handleEditorInit = useCallback(
    (api: {
      openFile: (path: string, content: string, language: string) => void;
    }) => {
      setEditorRef(api);
    },
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  const layoutCSS: React.CSSProperties = {
    height: "100%",
    display: "flex",
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F1117]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <span className="text-gray-400">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0F1117]">
      <TopBar workspaceId={workspaceId} />
      <div className="h-[calc(100vh-60px)] flex flex-row">
        <Sidebar />
        <EditorProvider openFile={editorRef?.openFile || (() => {})}>
          <SplitPane
            sashRender={() => (
              <SashContent className="bg-gray-800 hover:bg-purple-500 transition-colors" />
            )}
            sizes={sidebarWidth}
            onChange={setSidebarWidth}
          >
            <Pane minSize={200} maxSize={400}>
              <FileExplorer />
            </Pane>
            <SplitPane
              sashRender={() => (
                <SashContent className="bg-gray-800 hover:bg-purple-500 transition-colors" />
              )}
              sizes={editorTerminalHeight}
              split="horizontal"
              onChange={setEditorTerminalHeight}
            >
              <SplitPane
                sashRender={() => (
                  <SashContent className="bg-gray-800 hover:bg-purple-500 transition-colors" />
                )}
                sizes={editorBrowserWidth}
                onChange={setEditorBrowserWidth}
              >
                <div style={{ ...layoutCSS, flexDirection: "column" }}>
                  <MonacoEditorContainer onInit={handleEditorInit} />
                </div>
                <div style={{ ...layoutCSS, flexDirection: "column" }}>
                  <div className="border-b border-gray-800 w-full bg-[#0F1117]">
                    <div className="flex items-center justify-between px-2 h-9">
                      <div className="flex items-center space-x-2">
                        <div className="px-3 h-9 bg-gray-800 text-gray-300 text-sm flex items-center gap-2 border-r border-gray-700">
                          <Globe className="w-4 h-4 text-purple-500" />
                          <span>Browser</span>
                          <button className="hover:bg-gray-700 p-1 rounded transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Browser />
                </div>
              </SplitPane>
              <Pane>
                <div style={{ ...layoutCSS }}>
                  <TerminalContainer refHandleResize={refHandleResize} />
                </div>
              </Pane>
            </SplitPane>
          </SplitPane>
        </EditorProvider>
      </div>
      <BottomBar />
    </div>
  );
};

export default WorkspacePage;
