import { Files, Github, Search, Settings } from "lucide-react";
import React from "react";

const Sidebar = () => {
  return (
    <div className="w-[4rem] bg-[#090d14] border-r border-gray-800 flex flex-col items-center py-4 space-y-4">
      <button
        className="p-2.5 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors duration-200"
        title="Files"
      >
        <Files className="w-5 h-5" />
      </button>
      <button
        className="p-2.5 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-purple-500 transition-colors duration-200"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        className="p-2.5 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-purple-500 transition-colors duration-200"
        title="Source Control"
      >
        <Github className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <button
        className="p-2.5 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-purple-500 transition-colors duration-200"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Sidebar;
