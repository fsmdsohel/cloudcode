import React from "react";
import { EditorContext } from "@/contexts/EditorContext";

interface EditorProviderProps {
  children: React.ReactNode;
  openFile: (path: string, content: string, language: string) => void;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  openFile,
}) => {
  return (
    <EditorContext.Provider value={{ openFile }}>
      {children}
    </EditorContext.Provider>
  );
};
