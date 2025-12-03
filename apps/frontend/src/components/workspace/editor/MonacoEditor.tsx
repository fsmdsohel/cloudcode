import { useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  onMount?: OnMount;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

const customTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#0F1117",
    "editor.foreground": "#E4E4E7",
    "editor.lineHighlightBackground": "#1F2937",
    "editorLineNumber.foreground": "#6B7280",
    "editor.selectionBackground": "#374151",
    "editor.inactiveSelectionBackground": "#374151",
    "editorBracketMatch.background": "#374151",
    "editorBracketMatch.border": "#4B5563",
  },
};

const MonacoEditorWrapper = ({
  value,
  language = "javascript",
  onChange,
  onMount,
  theme = "cloudCodeTheme",
  options = {},
}: MonacoEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("cloudCodeTheme", customTheme);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.setTheme("cloudCodeTheme");
    onMount?.(editor, monaco);
  };

  const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: 14,
    fontFamily: "JetBrains Mono, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: "on",
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    ...options,
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme={theme}
      options={defaultOptions}
    />
  );
};

export default MonacoEditorWrapper;
