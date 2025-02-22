"use client";

import React from "react";
import Link from "next/link";
import {
  Palette,
  Bell,
  Shield,
  User,
  ChevronRight,
  CreditCard,
  Wallet,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

interface SettingCategory {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const settingCategories: SettingCategory[] = [
  {
    title: "Profile",
    description: "Manage your account information and preferences",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of your workspace",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Notifications",
    description: "Choose what notifications you want to receive",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Security",
    description: "Configure your security preferences and 2FA",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Subscription",
    description: "Manage your subscription plan and billing cycle",
    href: "/settings/subscription",
    icon: Wallet,
  },
  {
    title: "Billing",
    description: "View billing history and manage payment methods",
    href: "/settings/billing",
    icon: CreditCard,
  },
];

const SettingsPage = () => {
  return (
    <div className="min-h-screen">
      <SettingsHeader breadcrumbs={[{ title: "Settings" }]} />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="mt-1 text-base text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-2xl divide-y divide-gray-800/40">
            {settingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex items-center gap-4 py-6 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/40 text-gray-400 group-hover:bg-primary-purple-400/10 group-hover:text-primary-purple-400 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium text-white group-hover:text-primary-purple-400 transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-gray-600 group-hover:text-primary-purple-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
