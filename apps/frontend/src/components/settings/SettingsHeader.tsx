"use client";

import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Breadcrumb {
  title: string;
  href?: string;
}

interface SettingsHeaderProps {
  breadcrumbs?: Breadcrumb[];
  showDashboard?: boolean;
}

const SettingsHeader = ({
  breadcrumbs,
  showDashboard = true,
}: SettingsHeaderProps) => {
  const router = useRouter();

  const allBreadcrumbs: Breadcrumb[] = [
    ...(showDashboard ? [{ title: "Dashboard", href: "/dashboard" }] : []),
    ...(breadcrumbs || []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F1117]/80 backdrop-blur-md border-b border-gray-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12">
        <div className="flex items-center gap-3 h-full">
          <button
            onClick={() => router.back()}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {allBreadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.title}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    {crumb.title}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    {crumb.title}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;
