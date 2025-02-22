"use client";

import React from "react";
import {
  Book,
  Code2,
  Terminal,
  Rocket,
  ArrowRight,
  Search,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

const DocsPage = () => {
  const guides = [
    {
      title: "Getting Started",
      description:
        "Learn the basics of CloudCode and set up your first workspace",
      icon: Rocket,
      sections: [
        { title: "Quick Start Guide", href: "/docs/quickstart" },
        { title: "Installation", href: "/docs/installation" },
        { title: "Basic Concepts", href: "/docs/concepts" },
      ],
    },
    {
      title: "Workspaces",
      description: "Everything you need to know about CloudCode workspaces",
      icon: Terminal,
      sections: [
        { title: "Creating Workspaces", href: "/docs/workspaces/create" },
        { title: "Configuration", href: "/docs/workspaces/config" },
        { title: "Templates", href: "/docs/workspaces/templates" },
      ],
    },
    {
      title: "Development",
      description: "Development guides and best practices",
      icon: Code2,
      sections: [
        { title: "Code Editor", href: "/docs/editor" },
        { title: "Git Integration", href: "/docs/git" },
        { title: "Debugging", href: "/docs/debugging" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SettingsHeader breadcrumbs={[{ title: "Documentation" }]} />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div>
            <h1 className="text-2xl font-semibold text-white">Documentation</h1>
            <p className="mt-1 text-base text-gray-400">
              Learn how to use CloudCode effectively
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          {/* Search */}
          <div className="max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Documentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.title}
                className="bg-surface-card border border-white/[0.08] rounded-xl p-6 hover:border-purple-500/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <guide.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {guide.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {guide.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {guide.sections.map((section) => (
                    <a
                      key={section.href}
                      href={section.href}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover group transition-colors"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-white">
                        {section.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12">
            <h2 className="text-lg font-medium text-white mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "API Reference", icon: Book },
                { title: "CLI Documentation", icon: Terminal },
                { title: "Examples", icon: Code2 },
                { title: "Release Notes", icon: Rocket },
              ].map((link) => (
                <a
                  key={link.title}
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-lg bg-surface-card border border-white/[0.08] hover:border-purple-500/20 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-300">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
