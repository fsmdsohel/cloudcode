"use client";

import React, { useState } from "react";
import { Moon, Sun, Monitor, Check, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import SettingsHeader from "@/components/settings/SettingsHeader";

type ThemeMode = "light" | "dark" | "system";
type ColorScheme = "purple" | "blue" | "green" | "orange" | "red";

interface ThemeOption {
  id: ThemeMode;
  name: string;
  icon: React.ElementType;
}

interface ColorOption {
  id: ColorScheme;
  name: string;
  class: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
  },
];

const colorOptions: ColorOption[] = [
  {
    id: "purple",
    name: "Purple",
    class: "bg-primary-purple-400",
  },
  {
    id: "blue",
    name: "Blue",
    class: "bg-blue-500",
  },
  {
    id: "green",
    name: "Green",
    class: "bg-green-500",
  },
  {
    id: "orange",
    name: "Orange",
    class: "bg-orange-500",
  },
  {
    id: "red",
    name: "Red",
    class: "bg-red-500",
  },
];

const AppearancePage = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>("dark");
  const [selectedColor, setSelectedColor] = useState<ColorScheme>("purple");
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSaveChanges = () => {
    // Handle saving appearance settings
    console.log({
      theme: selectedTheme,
      color: selectedColor,
      reducedMotion,
    });
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Appearance" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <h1 className="text-2xl font-semibold text-white">Appearance</h1>
          <p className="mt-1 text-base text-gray-400">
            Customize the look and feel of your workspace
          </p>
        </div>

        {/* Settings Content */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-2xl space-y-8">
            {/* Theme Selection */}
            <div>
              <h2 className="text-lg font-medium text-white mb-6">Theme</h2>
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`relative p-4 flex flex-col items-center gap-3 rounded-lg border transition-all ${
                        selectedTheme === theme.id
                          ? "bg-primary-purple-400/10 border-primary-purple-400/20"
                          : "bg-surface-hover border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          selectedTheme === theme.id
                            ? "bg-primary-purple-400/20 text-primary-purple-400"
                            : "bg-white/[0.05] text-white/60"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={
                          selectedTheme === theme.id
                            ? "text-primary-purple-400"
                            : "text-white/80"
                        }
                      >
                        {theme.name}
                      </span>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-primary-purple-400">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <h2 className="text-lg font-medium text-white mb-6">
                Accent Color
              </h2>
              <div className="flex flex-wrap gap-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`relative w-12 h-12 rounded-lg transition-transform ${
                      selectedColor === color.id
                        ? "ring-2 ring-offset-2 ring-offset-surface-card ring-white/20 scale-110"
                        : "hover:scale-105"
                    } ${color.class}`}
                  >
                    {selectedColor === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div>
              <h2 className="text-lg font-medium text-white mb-6">
                Accessibility
              </h2>
              <label className="flex items-center justify-between p-4 bg-surface-hover rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-white">Reduced Motion</div>
                  <div className="text-sm text-white/60">
                    Minimize animations and transitions
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    reducedMotion ? "bg-primary-purple-400" : "bg-white/[0.08]"
                  }`}
                  onClick={() => setReducedMotion(!reducedMotion)}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                      reducedMotion ? "translate-x-6" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSaveChanges}
                className="w-full px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;
