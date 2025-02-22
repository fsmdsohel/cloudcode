import { Fullscreen, Minimize2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface TopBarProps {
  workspaceId: string;
}

const TopBar = (props: TopBarProps) => {
  const { workspaceId } = props;
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen changes from other methods (like Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div className="relative flex items-center w-[100%] h-[30px] bg-[#090d14] px-4">
      <div className="flex items-center gap-4 cursor-pointer">
        <h4 className="text-sm hover:text-purple-500 transition-colors">
          File
        </h4>
        <h4 className="text-sm hover:text-purple-500 transition-colors">
          Edit
        </h4>
        <h4 className="text-sm hover:text-purple-500 transition-colors">
          View
        </h4>
        <h4 className="text-sm hover:text-purple-500 transition-colors">
          Terminal
        </h4>
        <h4 className="text-sm hover:text-purple-500 transition-colors">
          Help
        </h4>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h3 className="text-md">Workspace: {workspaceId}</h3>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          Share
        </button>
        <button
          onClick={toggleFullscreen}
          className="text-sm text-gray-400 hover:text-white transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 cursor-pointer hover:text-purple-500 transition-colors" />
          ) : (
            <Fullscreen className="w-4 h-4 cursor-pointer hover:text-purple-500 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
