import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface EditorPanelProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  value,
  language,
  onChange,
}) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-gray-800 w-full bg-[#0F1117]">
        <div className="flex items-center justify-between px-2 h-9">
          <div className="flex items-center space-x-2">
            <div className="px-3 h-9 bg-gray-800 text-gray-300 text-sm flex items-center gap-2 border-r border-gray-700">
              <span>{language}</span>
            </div>
          </div>
        </div>
      </div>
      <MonacoEditor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default EditorPanel;
