"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Terminal, Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F1117]">
      <div className="flex flex-col items-center gap-8 px-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Terminal className="w-8 h-8 text-purple-500" />
          </div>
          <div className="absolute -inset-3">
            <div className="w-[5.5rem] h-[5.5rem] rounded-xl animate-pulse bg-purple-500/20" />
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-bold text-white">
            404 - Page Not Found
          </h1>
          <p className="text-gray-400 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Check the URL or try navigating back home.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
