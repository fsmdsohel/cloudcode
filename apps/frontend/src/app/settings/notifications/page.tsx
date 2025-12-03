"use client";

import React, { useState } from "react";
import { Bell, MessageSquare, Zap, Mail, Globe } from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationPreference {
  id: string;
  category: string;
  description: string;
  icon: React.ElementType;
  channels: NotificationChannel[];
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: "messages",
    category: "Messages",
    description: "Notifications for direct messages and mentions",
    icon: MessageSquare,
    channels: [
      {
        id: "messages-push",
        name: "Push Notifications",
        description: "Receive notifications on your device",
        enabled: true,
      },
      {
        id: "messages-email",
        name: "Email",
        description: "Receive email notifications",
        enabled: false,
      },
    ],
  },
  {
    id: "activity",
    category: "Activity",
    description: "Notifications for workspace activity and updates",
    icon: Zap,
    channels: [
      {
        id: "activity-push",
        name: "Push Notifications",
        description: "Receive notifications on your device",
        enabled: true,
      },
      {
        id: "activity-email",
        name: "Email",
        description: "Receive email notifications",
        enabled: true,
      },
    ],
  },
  {
    id: "marketing",
    category: "Marketing",
    description: "Product updates and announcements",
    icon: Globe,
    channels: [
      {
        id: "marketing-email",
        name: "Email",
        description: "Receive promotional emails",
        enabled: false,
      },
    ],
  },
];

const NotificationsPage = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [emailDigest, setEmailDigest] = useState<"daily" | "weekly" | "off">(
    "daily"
  );

  const handleToggleChannel = (preferenceId: string, channelId: string) => {
    setPreferences((prev) =>
      prev.map((pref) => {
        if (pref.id === preferenceId) {
          return {
            ...pref,
            channels: pref.channels.map((channel) => {
              if (channel.id === channelId) {
                return { ...channel, enabled: !channel.enabled };
              }
              return channel;
            }),
          };
        }
        return pref;
      })
    );
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Notifications" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="mt-1 text-base text-gray-400">
            Manage how you receive notifications
          </p>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl space-y-8">
            {/* Email Digest */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Email Digest
                  </h2>
                  <p className="text-sm text-gray-400">
                    Get a summary of your notifications
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["daily", "weekly", "off"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setEmailDigest(option as typeof emailDigest)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      emailDigest === option
                        ? "bg-primary-purple-400 text-white"
                        : "bg-surface-hover text-gray-400 hover:text-white"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-6">
              {preferences.map((preference) => {
                const Icon = preference.icon;
                return (
                  <div
                    key={preference.id}
                    className="bg-surface-card border border-white/[0.08] rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {preference.category}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {preference.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {preference.channels.map((channel) => (
                        <div
                          key={channel.id}
                          className="flex items-center justify-between p-4 bg-surface-hover rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-white">
                              {channel.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {channel.description}
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={channel.enabled}
                              onChange={() =>
                                handleToggleChannel(preference.id, channel.id)
                              }
                            />
                            <div className="w-11 h-6 bg-surface-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple-400 peer-checked:after:bg-white" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
