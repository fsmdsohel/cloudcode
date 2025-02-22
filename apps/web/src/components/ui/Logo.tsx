import { Terminal } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
        <Terminal className="h-5 w-5 text-purple-500" />
      </div>
      <span className="text-lg font-medium text-white">CloudCode</span>
    </div>
  );
};
