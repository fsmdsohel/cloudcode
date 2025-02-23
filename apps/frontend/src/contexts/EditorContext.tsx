import { createContext, useContext } from "react";

interface EditorContextType {
  openFile: (path: string, content: string, language: string) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
