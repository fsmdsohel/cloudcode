"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  FileText,
  HelpCircle,
  Plus,
  Bell,
  Settings,
  ChevronDown,
  Terminal,
  Ellipsis,
  Boxes,
  Database,
  MonitorPlay,
  Server,
  ArrowRight,
  Wand2,
  User,
  CreditCard,
  LogOut,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLoading from "./loading";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/redux/store";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { ErrorBoundary } from "react-error-boundary";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { WorkspaceCard } from "@/components/dashboard/WorkspaceCard";
import { ErrorFallback } from "@/components/shared/ErrorFallback";

interface UserProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

const DashboardLayout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "members">("recent");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // TODO: Fetch user profile
  const [user] = useState<UserProfile | null>(null);
  const debouncedSearch = useDebounce(searchQuery);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const workspaceItems = [
    {
      name: "Project Alpha",
      lastEdited: "2 days ago",
      members: 4,
      workspaceId: "workspace-123",
    },
    {
      name: "Backend API",
      lastEdited: "5 days ago",
      members: 2,
      workspaceId: "workspace-123",
    },
  ];

  const categories = [
    {
      id: "frontend",
      name: "Frontend Development",
      icon: MonitorPlay,
      color: "from-blue-500 to-indigo-500",
      templates: [
        { id: "react", name: "React", description: "Modern UI development" },
        {
          id: "next",
          name: "Next.js",
          description: "Full-stack React framework",
        },
        { id: "vue", name: "Vue", description: "Progressive framework" },
      ],
    },
    {
      id: "backend",
      name: "Backend Development",
      icon: Server,
      color: "from-emerald-500 to-green-500",
      templates: [
        { id: "node", name: "Node.js", description: "JavaScript runtime" },
        { id: "python", name: "Python", description: "Python backend" },
        { id: "java", name: "Java", description: "Enterprise backend" },
      ],
    },
    {
      id: "fullstack",
      name: "Full-Stack Apps",
      icon: Boxes,
      color: "from-purple-500 to-pink-500",
      templates: [
        {
          id: "mern",
          name: "MERN Stack",
          description: "MongoDB, Express, React, Node",
        },
        {
          id: "lamp",
          name: "LAMP Stack",
          description: "Linux, Apache, MySQL, PHP",
        },
      ],
    },
    {
      id: "database",
      name: "Database Projects",
      icon: Database,
      color: "from-orange-500 to-red-500",
      templates: [
        {
          id: "postgres",
          name: "PostgreSQL",
          description: "Relational database",
        },
        { id: "mongodb", name: "MongoDB", description: "NoSQL database" },
        { id: "mysql", name: "MySQL", description: "Popular SQL database" },
        { id: "sqlite", name: "SQLite", description: "Embedded database" },
      ],
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New template available",
      message: "Next.js 14 template is now available",
      time: "2 mins ago",
      unread: true,
    },
    {
      id: 2,
      title: "Workspace shared",
      message: "John Doe shared 'Project Alpha' with you",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      message: "CloudCode has been updated to v2.1.0",
      time: "2 days ago",
      unread: false,
    },
  ];

  const handleNavigateWorkspace = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  const handleQuickStartTemplate = (templateId: string) => {
    router.push(`/templates/template?name=${templateId}`);
  };

  const handleNavigateCategory = (categoryId: string) => {
    router.push(`/templates?category=${categoryId}`);
  };

  // First, create a function to handle dropdown toggles
  const handleDropdownToggle = (dropdown: "notifications" | "profile") => {
    if (dropdown === "notifications") {
      setShowProfileDropdown(false); // Close profile dropdown
      setShowNotifications(!showNotifications);
    } else if (dropdown === "profile") {
      setShowNotifications(false); // Close notifications dropdown
      setShowProfileDropdown(!showProfileDropdown);
    }
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-trigger") &&
        !target.closest(".dropdown-menu")
      ) {
        setShowNotifications(false);
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the handleLogout function
  const handleLogout = async () => {
    try {
      setShowProfileDropdown(false); // Close the dropdown
      await dispatch(logout()).unwrap();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout", {
        description: "Please try again later",
      });
    }
  };

  // Filter and sort workspaces
  const filteredWorkspaces = useMemo(() => {
    return workspaceItems.filter((workspace) =>
      workspace.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  const sortedWorkspaces = useMemo(() => {
    return [...filteredWorkspaces].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "members") return b.members - a.members;
      return (
        new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );
    });
  }, [filteredWorkspaces, sortBy]);

  if (!isMounted) return <DashboardLoading />;

  return (
    <div className="min-h-screen">
      {/* Content */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:block w-16 border-r border-gray-200 dark:border-gray-800/40 bg-white dark:bg-transparent p-4">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo */}
            <div className="text-purple-500 mb-8 cursor-pointer">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                <Terminal className="h-5 w-5" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-4">
              {[
                { icon: Home, label: "Home", active: true, href: "/dashboard" },
                { icon: FileText, label: "Docs", href: "/docs" },
                { icon: HelpCircle, label: "Support", href: "/support" },
              ].map(({ icon: Icon, label, active, href }) => (
                <div key={label}>
                  <Link
                    href={href}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 cursor-pointer ${
                      active
                        ? "text-purple-600 dark:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/10"
                        : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/40 bg-white/80 dark:bg-[#0F1117]/80 backdrop-blur-md">
            <div className="px-4 sm:px-6 py-4">
              {/* Mobile Header */}
              <div className="flex md:hidden items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                    <Terminal className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  </div>
                  <nav className="flex items-center gap-2">
                    {[
                      {
                        icon: Home,
                        label: "Home",
                        active: true,
                        href: "/dashboard",
                      },
                      { icon: FileText, label: "Docs", href: "/docs" },
                      { icon: HelpCircle, label: "Support", href: "/support" },
                    ].map(({ icon: Icon, label, active, href }) => (
                      <Link
                        key={label}
                        href={href}
                        className={`p-2 rounded-lg transition-colors ${
                          active
                            ? "text-purple-600 dark:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/10"
                            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/10"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors dropdown-trigger"
                    onClick={() => handleDropdownToggle("notifications")}
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some((n) => n.unread) && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <ThemeToggle />
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                    Welcome back,{" "}
                    <span className="text-purple-600 dark:text-purple-400">
                      Sohel Rana
                    </span>
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors dropdown-trigger"
                    onClick={() => handleDropdownToggle("notifications")}
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some((n) => n.unread) && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push("/settings/subscription")}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle("profile")}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-colors dropdown-trigger"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-500">
                          {user?.firstName?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileDropdown && (
                      <div className="dropdown-menu absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1117]/95 backdrop-blur-sm shadow-lg dark:shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10"></div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.firstName || "User"}{" "}
                                {user?.lastName || ""}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.email || "user@example.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={() => router.push("/profile")}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
                          >
                            <User className="w-4 h-4" />
                            Your Profile
                          </button>
                          <button
                            onClick={() => router.push("/settings")}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                          <button
                            onClick={() =>
                              router.push("/settings/subscription")
                            }
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
                          >
                            <CreditCard className="w-4 h-4" />
                            Subscription
                          </button>
                        </div>

                        <div className="p-2 border-t border-gray-200 dark:border-white/[0.08]">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="dropdown-menu absolute right-4 sm:right-6 mt-2 w-[320px] sm:w-[380px] rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1117]/95 backdrop-blur-sm shadow-lg dark:shadow-2xl z-10">
              <div className="p-4 border-b border-gray-200 dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      You have {notifications.filter((n) => n.unread).length}{" "}
                      unread messages
                    </p>
                  </div>
                  <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    Mark all as read
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      notification.unread
                        ? "bg-gray-50 dark:bg-white/[0.01]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                          notification.unread
                            ? "bg-purple-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {notification.time}
                          </span>
                          {notification.unread && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-white/[0.08]">
                <button
                  onClick={() => router.push("/notifications")}
                  className="w-full text-sm text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  View all notifications
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Your Workspaces Section */}
            <div className="space-y-6">
              {/* Main Workspaces Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Your Workspaces
                  </h2>
                  <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                    Create and manage your development environments
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => router.push("/templates")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Workspace</span>
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-all text-gray-700 dark:text-gray-300">
                    <Wand2 className="w-4 h-4" />
                    <span>Import</span>
                  </button>
                </div>
              </div>

              {/* Recent Workspaces Section */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Recent Workspaces
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your recently accessed workspaces
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search workspaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as "recent" | "name" | "members"
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="name">Name</option>
                      <option value="members">Members</option>
                    </select>
                  </div>
                </div>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : sortedWorkspaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedWorkspaces.map((item) => (
                        <WorkspaceCard
                          key={item.workspaceId}
                          item={item}
                          onNavigate={handleNavigateWorkspace}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No workspaces found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        {searchQuery
                          ? `No workspaces match "${searchQuery}"`
                          : "You haven't created any workspaces yet"}
                      </p>
                      <button
                        onClick={() => router.push("/templates")}
                        className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Workspace
                      </button>
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Start Building
                </h2>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                  Choose a template or start from scratch to begin your project
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: "react",
                    name: "React",
                    icon: "⚛️",
                    color: "from-blue-500 to-cyan-500",
                    description: "Modern UI development with React ecosystem",
                    popularity: "Popular",
                  },
                  {
                    id: "next",
                    name: "Next.js",
                    icon: "▲",
                    color: "from-gray-500 to-black",
                    description: "Full-stack React framework with SSR",
                    popularity: "Trending",
                  },
                  {
                    id: "node",
                    name: "Node.js",
                    icon: "⬢",
                    color: "from-green-500 to-emerald-500",
                    description: "Backend development with JavaScript",
                    popularity: "Popular",
                  },
                ].map((template) => (
                  <div
                    key={template.id}
                    className="group relative rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-5 hover:border-gray-300 dark:hover:border-white/[0.15] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/60">
                        {template.popularity}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between h-full">
                      <div className="mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg mb-3 bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl shadow-lg`}
                        >
                          {template.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-white/60">
                          {template.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleQuickStartTemplate(template.id)}
                        className="w-full py-2.5 text-sm bg-gray-100 hover:bg-blue-600 dark:bg-white/[0.05] dark:hover:bg-[#4D7DFF] text-gray-700 hover:text-white dark:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-blue-600 dark:group-hover:bg-[#4D7DFF] group-hover:text-white"
                      >
                        Use Template
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Custom Workspace Card */}
                <div
                  className="group relative rounded-xl border-2 border-dashed border-gray-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.02] p-5 hover:border-blue-500 dark:hover:border-[#4D7DFF] transition-colors cursor-pointer"
                  onClick={() => handleQuickStartTemplate("custom")}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <Wand2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Custom Workspace
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-white/60">
                      Start from scratch with complete control
                    </p>
                    <div className="mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-white/[0.05] rounded-lg text-blue-600 dark:text-[#4D7DFF] flex items-center gap-2">
                      Start from Scratch
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Browse Categories */}
            <div className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Browse Categories
                </h3>
                <button
                  onClick={() => router.push("/templates")}
                  className="text-sm text-blue-600 dark:text-[#4D7DFF] hover:text-blue-800 dark:hover:text-[#4069cc] flex items-center gap-2"
                >
                  <span className="hidden sm:inline">See All Categories</span>
                  <span className="sm:hidden">See All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleNavigateCategory(category.id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-transparent dark:hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}
                    >
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-white/40">
                        {category.templates.length} templates
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
