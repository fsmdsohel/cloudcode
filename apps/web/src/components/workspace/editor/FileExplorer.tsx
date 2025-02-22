import React, { useEffect, useState } from "react";
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode,
  Folder,
  RefreshCw,
} from "lucide-react";
import { useEditor } from "@/contexts/EditorContext";

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface FileTreeItem extends FileItem {
  children?: FileTreeItem[];
  level: number;
}

const FileExplorer: React.FC = () => {
  const { openFile } = useEditor();
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async (
    dirPath: string,
    level: number = 0
  ): Promise<FileTreeItem[]> => {
    try {
      const response = await fetch(
        `http://localhost:8002/api/files?path=${encodeURIComponent(dirPath)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map((file: FileItem) => ({
        ...file,
        path: dirPath === "." ? file.name : `${dirPath}/${file.name}`,
        level,
        children: [],
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  };

  const loadInitialFiles = async () => {
    setIsLoading(true);
    try {
      const rootFiles = await fetchFiles(".");
      setFiles(rootFiles);
    } catch (error) {
      console.error("Error loading files:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialFiles();
  }, []);

  const handleFileClick = async (file: FileTreeItem) => {
    if (file.isDirectory) {
      const isExpanded = expandedFolders.has(file.path);
      if (isExpanded) {
        // Collapse folder
        const newExpanded = new Set(expandedFolders);
        newExpanded.delete(file.path);
        setExpandedFolders(newExpanded);
      } else {
        // Expand folder
        setIsLoading(true);
        try {
          const children = await fetchFiles(file.path, file.level + 1);
          setFiles((prevFiles) => {
            const updateFiles = (items: FileTreeItem[]): FileTreeItem[] => {
              return items.map((item) => {
                if (item.path === file.path) {
                  return { ...item, children };
                }
                if (item.children && item.children.length > 0) {
                  return { ...item, children: updateFiles(item.children) };
                }
                return item;
              });
            };
            return updateFiles(prevFiles);
          });
          const newExpanded = new Set(expandedFolders);
          newExpanded.add(file.path);
          setExpandedFolders(newExpanded);
        } catch (error) {
          console.error("Error loading folder:", error);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setActiveFile(file.path);
      try {
        const response = await fetch(
          `http://localhost:8002/api/files/read?path=${encodeURIComponent(
            file.path
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        const language = getLanguageFromExtension(fileExtension);
        openFile(file.path, data.content, language);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const getLanguageFromExtension = (extension: string): string => {
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      // Add more mappings as needed
    };
    return languageMap[extension] || "plaintext";
  };

  const renderFileTree = (items: FileTreeItem[]) => {
    return items
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      })
      .map((file) => {
        const isExpanded = expandedFolders.has(file.path);
        const isActive = activeFile === file.path;
        const paddingLeft = `${file.level * 12 + 4}px`;

        return (
          <div key={file.path}>
            <button
              onClick={() => handleFileClick(file)}
              className={`flex items-center w-full py-[3px] text-[13px] group hover:bg-gray-800/50
                ${isActive ? "bg-gray-800 text-white" : "text-gray-400"}`}
              style={{ paddingLeft }}
            >
              <div className="flex items-center min-w-[24px]">
                {file.isDirectory && (
                  <span className="flex items-center justify-center w-4">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {file.isDirectory ? (
                  isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                  )
                ) : (
                  <FileCode className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </div>
            </button>
            {file.isDirectory && isExpanded && file.children && (
              <div className="flex flex-col">
                {renderFileTree(file.children)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] bg-gray-900 overflow-hidden border border-t-0 border-gray-800 shadow-2xl flex flex-col">
      <div className="p-2 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Explorer
          </h2>
          <button
            onClick={loadInitialFiles}
            className={`p-1 rounded hover:bg-gray-800 text-gray-400
              ${isLoading ? "animate-spin" : ""}`}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="py-1">
          {isLoading && files.length === 0 ? (
            <div className="text-sm text-gray-500 px-4">Loading...</div>
          ) : (
            <div className="space-y-[1px]">{renderFileTree(files)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
