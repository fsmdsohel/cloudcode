import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex h-screen">
        {/* Sidebar Skeleton */}
        <div className="w-16 border-r border-gray-800/40 p-4">
          <div className="flex flex-col items-center space-y-8">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Header Skeleton */}
          <header className="border-b border-gray-800/40 bg-[#0F1117]/80">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-64 h-10 rounded-lg hidden md:block" />
              </div>
              <div className="flex items-center space-x-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-lg" />
                ))}
                <Skeleton className="w-28 h-10 rounded-lg" />
              </div>
            </div>
          </header>

          {/* Dashboard Content Skeleton */}
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Workspaces Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="w-40 h-8" />
                <div className="flex gap-4">
                  <Skeleton className="w-32 h-10 rounded-lg" />
                  <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Quick Start Section */}
            <div className="space-y-6">
              <Skeleton className="w-36 h-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
