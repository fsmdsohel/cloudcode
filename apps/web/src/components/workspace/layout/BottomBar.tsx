import React from "react";

const BottomBar = () => {
  return (
    <div className="flex items-center justify-center w-[100%] h-[30px] bg-gray-900">
      <div className="flex items-center justify-between w-full px-4 text-sm text-gray-400">
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Connected</span>
          </div>

          {/* Git Status */}
          <div className="flex items-center gap-2">
            <span>main</span>
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>3 changes</span>
            </div>
          </div>

          {/* Active Port */}
          <div className="flex items-center gap-1">
            <span>Port:</span>
            <span className="text-purple-400">3000</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* System Resources */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>CPU:</span>
              <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[45%]"></div>
              </div>
              <span>45%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>RAM:</span>
              <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[60%]"></div>
              </div>
              <span>2.4/4GB</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Storage:</span>
              <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[25%]"></div>
              </div>
              <span>5/20GB</span>
            </div>
          </div>

          {/* Environment Info */}
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 rounded bg-gray-800">
              <span>Node v18.x</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-gray-800">
              <span>npm 9.x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
