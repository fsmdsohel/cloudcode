export const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* Workspace Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-white/[0.08] p-6"
          >
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"
                    />
                  ))}
                </div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
