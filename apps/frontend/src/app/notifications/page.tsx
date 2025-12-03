"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  MailCheck,
  MessageSquare,
  Shield,
  User,
  Zap,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

interface Notification {
  id: string;
  type: "message" | "security" | "system" | "workspace";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: React.ElementType;
  color?: string;
}

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "message",
      title: "New message from John Doe",
      message: "Hey, I've updated the project files...",
      time: "2 minutes ago",
      read: false,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      id: "2",
      type: "security",
      title: "Security alert",
      message: "New login from unknown device in London, UK",
      time: "1 hour ago",
      read: false,
      icon: Shield,
      color: "bg-red-500",
    },
    {
      id: "3",
      type: "system",
      title: "System update",
      message: "CloudCode has been updated to v2.1.0",
      time: "2 days ago",
      read: true,
      icon: Zap,
      color: "bg-purple-500",
    },
    {
      id: "4",
      type: "workspace",
      title: "Workspace shared",
      message: "Alice shared 'Project Beta' with you",
      time: "3 days ago",
      read: true,
      icon: User,
      color: "bg-green-500",
    },
  ]);

  const filters = [
    { id: "all", name: "All", icon: Bell },
    { id: "unread", name: "Unread", icon: MailCheck },
    { id: "message", name: "Messages", icon: MessageSquare },
    { id: "security", name: "Security", icon: Shield },
    { id: "system", name: "System", icon: Zap },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notification.read;
    return notification.type === selectedFilter;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen relative">
      <SettingsHeader breadcrumbs={[{ title: "Notifications" }]} />

      {/* Content Container with backdrop blur */}
      <div className="relative max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
                Notifications
              </h1>
              <p className="mt-1 text-base text-gray-400/90">
                Manage your notifications and preferences
              </p>
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white/90 rounded-lg hover:bg-white/[0.03] transition-all duration-200"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          {/* Filters with glass effect */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 backdrop-blur-sm ${
                    selectedFilter === filter.id
                      ? "bg-primary-purple-400/90 text-white/95 shadow-lg shadow-primary-purple-400/20"
                      : "bg-white/[0.02] text-gray-400 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.name}
                </button>
              );
            })}
          </div>

          {/* Notifications List with glass cards */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon || Bell;
              return (
                <div
                  key={notification.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] ${
                    notification.read
                      ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]"
                      : "bg-primary-purple-400/[0.02] border-primary-purple-400/20 hover:bg-primary-purple-400/[0.03]"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                      notification.read
                        ? `${notification.color} bg-opacity-10`
                        : `${notification.color} bg-opacity-15`
                    } flex items-center justify-center backdrop-blur-sm`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        notification.read ? "text-white/70" : "text-white/90"
                      }`}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-medium flex items-center gap-2 ${
                            notification.read
                              ? "text-white/70"
                              : "text-white/90"
                          }`}
                        >
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary-purple-400/90 animate-pulse shadow-sm shadow-primary-purple-400/20" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-400/90 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-400/80">
                          <Clock className="w-4 h-4 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-primary-purple-400/90 hover:text-primary-purple-400 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-sm text-red-400/70 hover:text-red-400/90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Empty state with glass effect */}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                <Bell className="w-12 h-12 text-gray-400/80 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white/90 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-400/90">
                  You&apos;re all caught up! Check back later for new
                  notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
