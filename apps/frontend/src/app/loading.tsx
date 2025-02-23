import { Terminal } from "lucide-react";

export default function LandingLoading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F1117]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Terminal className="w-8 h-8 text-purple-500" />
          </div>
          <div className="absolute -inset-3">
            <div className="w-[5.5rem] h-[5.5rem] rounded-xl animate-pulse bg-purple-500/20" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">CloudCode</h2>
            <span className="px-3 py-1 text-sm bg-primary-blue-100 text-primary-blue-400 rounded-full">
              Beta
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
