"use client";

import React from "react";
import {
  Plus,
  Search,
  FolderGit2,
  Clock,
  Users,
  MoreVertical,
  Star,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

interface Workspace {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  members: number;
  isStarred?: boolean;
}

export default function WorkspacesPage() {
  const workspaces: Workspace[] = [
    {
      id: "1",
      name: "Frontend Dashboard",
      description: "Main dashboard application using React and TailwindCSS",
      lastUpdated: "2 hours ago",
      members: 4,
      isStarred: true,
    },
    {
      id: "2",
      name: "API Backend",
      description: "REST API using Node.js and Express",
      lastUpdated: "1 day ago",
      members: 3,
    },
    {
      id: "3",
      name: "Mobile App",
      description: "React Native mobile application",
      lastUpdated: "3 days ago",
      members: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <SettingsHeader breadcrumbs={[{ title: "Workspaces" }]} />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Workspaces</h1>
              <p className="mt-1 text-base text-gray-400">
                Manage and organize your coding projects
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-4xl">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Workspaces List */}
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group bg-surface-card border border-white/[0.08] rounded-xl p-4 hover:border-purple-500/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <FolderGit2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-white flex items-center gap-2">
                            {workspace.name}
                            {workspace.isStarred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {workspace.description}
                          </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-surface-hover opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{workspace.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{workspace.members} members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
