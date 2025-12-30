"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FolderGit2,
  Clock,
  Users,
  MoreVertical,
  Star,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchWorkspaces } from "@/redux/slices/workspaceSlice";

export default function WorkspacesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { workspaces, loading } = useSelector(
    (state: RootState) => state.workspace
  );

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

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
            <Link
              href="/templates"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </Link>
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
            {loading && workspaces.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No workspaces found. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => router.push(`/workspaces/${workspace.id}`)}
                    className="group bg-surface-card border border-white/[0.08] rounded-xl p-4 hover:border-purple-500/20 transition-colors cursor-pointer"
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
                              {/* {workspace.isStarred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )} */}
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                              {workspace.description || "No description"}
                            </p>
                          </div>
                          <button className="p-2 rounded-lg hover:bg-surface-hover opacity-0 group-hover:opacity-100 transition-all">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(workspace.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{workspace.members} members</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
