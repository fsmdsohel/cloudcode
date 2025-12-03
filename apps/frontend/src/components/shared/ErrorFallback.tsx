import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorBoundaryProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-100 dark:border-red-900/20 bg-red-50 dark:bg-red-900/10">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 dark:text-red-300 mb-4 text-center">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
};
