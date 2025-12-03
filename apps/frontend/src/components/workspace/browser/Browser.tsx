import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Globe, RefreshCw } from "lucide-react";

const Browser = () => {
  const [url, setUrl] = useState("https://cloudcode.dev");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  };
  return (
    <div className="w-full mx-auto space-y-4 flex flex-col">
      {/* Browser Chrome */}
      <div className="w-full bg-gray-900  overflow-hidden shadow-2xl flex flex-col flex-grow-[1]">
        {/* URL Bar and Controls */}
        <div className="bg-gray-800 p-3 flex items-center gap-2 ">
          {/* Navigation Controls */}
          <div className="flex gap-1">
            <button className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              className={`p-1.5 rounded-md hover:bg-gray-700 text-gray-400 transition-transform ${
                isLoading ? "animate-spin" : ""
              }`}
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* URL Input */}
          <div className="flex-1 flex items-center bg-gray-900 rounded-md border border-gray-700 hover:border-gray-600 focus-within:border-purple-500 px-3 py-1.5">
            <Globe className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
              placeholder="Enter URL"
            />
          </div>
        </div>

        {/* Website View */}
        <div className="w-full bg-[#020817] h-[100%] p-8 overflow-auto">
          {/* CloudCode Content */}
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Code Without Complexity
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Eliminate environment setup. Start coding instantly with
              containerized workspaces and AI-powered learning support.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
              <button className="border border-gray-700 text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
