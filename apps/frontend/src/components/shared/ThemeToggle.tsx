"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-transparent dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 shadow-sm"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <div className="relative">
        {/* Sun icon - visible in light theme */}
        <Sun
          className={`h-5 w-5 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-90 scale-0 text-yellow-500"
              : "rotate-0 scale-100 text-yellow-500"
          } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        />

        {/* Moon icon - visible in dark theme */}
        <Moon
          className={`h-5 w-5 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 scale-100 text-blue-400"
              : "-rotate-90 scale-0 text-gray-400"
          } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
