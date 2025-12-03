"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Globe,
  Clock,
  Camera,
  Loader2,
  CheckCircle,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  bio: string;
  avatarUrl: string;
  timezone: string;
  language: string;
}

const defaultProfile: UserProfile = {
  fullName: "John Doe",
  email: "john@example.com",
  username: "johndoe",
  bio: "Software engineer and tech enthusiast",
  avatarUrl: "/placeholder-avatar.jpg",
  timezone: "America/Los_Angeles",
  language: "en",
};

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
];

const timezones = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
];

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProfile((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Profile" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Profile</h1>
              <p className="mt-1 text-base text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-hover ring-2 ring-white/[0.08] ring-offset-2 ring-offset-surface-card">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-hover">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary-purple-400 text-white hover:bg-primary-purple-500 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Avatar</h3>
                    <p className="text-sm text-gray-400">
                      Upload a profile picture (recommended size: 400x400px)
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-surface-card border border-white/[0.08] rounded-xl divide-y divide-white/[0.08]">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-400">
                    Update your personal details and public profile
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          @
                        </span>
                        <input
                          type="text"
                          name="username"
                          value={profile.username}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50 resize-none"
                      placeholder="Write a short bio about yourself..."
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      Brief description for your profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-surface-card border border-white/[0.08] rounded-xl divide-y divide-white/[0.08]">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    Preferences
                  </h3>
                  <p className="text-sm text-gray-400">
                    Customize your language and timezone settings
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="language"
                          value={profile.language}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-primary-purple-400/50 appearance-none"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="timezone"
                          value={profile.timezone}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-2.5 bg-surface-hover border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-primary-purple-400/50 appearance-none"
                        >
                          {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                              {tz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Save Indicator */}
            {isSaved && (
              <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-green-400/10 text-green-400 rounded-lg border border-green-400/20">
                <CheckCircle className="w-5 h-5" />
                <span>Changes saved successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
