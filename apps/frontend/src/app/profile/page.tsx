"use client";

import React from "react";
import {
  Mail,
  Calendar,
  Settings,
  User,
  CreditCard,
  Github,
  Globe,
  MapPin,
  Code,
  Star,
  GitFork,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Link from "next/link";

export default function ProfilePage() {
  const profileLinks = [
    {
      title: "Edit Profile",
      href: "/settings/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Subscription",
      href: "/settings/subscription",
      icon: CreditCard,
    },
  ];

  const recentActivities = [
    {
      type: "code",
      title: "Updated React Project",
      description: "Made changes to authentication flow",
      time: "2 hours ago",
      icon: Code,
    },
    {
      type: "fork",
      title: "Forked Repository",
      description: "CloudCode/templates",
      time: "1 day ago",
      icon: GitFork,
    },
    {
      type: "star",
      title: "Starred Project",
      description: "next-auth/next-auth",
      time: "2 days ago",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen">
      <SettingsHeader breadcrumbs={[{ title: "Public Profile" }]} />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Public Profile
              </h1>
              <p className="mt-1 text-base text-gray-400">
                This is how others will see you on the platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              {profileLinks.map(({ title, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl">
            {/* Profile Info Card */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl divide-y divide-white/[0.08]">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-400">
                  Your public profile details and information
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                      <div className="w-full h-full rounded-[10px] bg-purple-500/10 overflow-hidden">
                        {/* Add actual image here */}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-white">
                      Sohel Rana
                    </h1>
                    <p className="mt-2 text-gray-400">Full-stack Developer</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>sohel.rana.coder@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        <span>@sohelrana</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Bangladesh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a
                          href="#"
                          className="hover:text-purple-400 transition-colors"
                        >
                          portfolio.dev
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined Dec 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="mt-6 bg-surface-card border border-white/[0.08] rounded-xl divide-y divide-white/[0.08]">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-400">
                  Your latest actions and updates
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-surface-hover hover:bg-surface-hover/70 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-surface-card">
                        <activity.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
