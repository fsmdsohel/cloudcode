"use client";

import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Key,
  LogOut,
  Lock,
  Check,
  Loader2,
  Mail,
  ArrowLeft,
  Monitor,
  Smartphone as MobileIcon,
  Globe,
  Clock,
  MapPin,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Modal from "@/components/shared/Modal";

// Types
type TwoFactorMethod = "email" | "authenticator";

interface TwoFactorStatus {
  enabled: boolean;
  method?: TwoFactorMethod;
  email?: string;
}

interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ipAddress: string;
}

interface EnableTwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: TwoFactorMethod, resetStep: () => void) => void;
  currentEmail: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Data
const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    device: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome",
    os: "macOS",
    location: "San Francisco, US",
    lastActive: "Active now",
    isCurrent: true,
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    device: "iPhone 12",
    deviceType: "mobile",
    browser: "Safari",
    os: "iOS",
    location: "San Francisco, US",
    lastActive: "2 hours ago",
    isCurrent: false,
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    device: "Windows PC",
    deviceType: "desktop",
    browser: "Firefox",
    os: "Windows",
    location: "New York, US",
    lastActive: "3 days ago",
    isCurrent: false,
    ipAddress: "192.168.1.3",
  },
];

// 2FA Modal Component
const EnableTwoFactorModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentEmail,
}: EnableTwoFactorModalProps) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<TwoFactorMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const resetState = () => {
    setStep(1);
    setMethod(null);
    setVerificationCode("");
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(resetState, 200);
  };

  const handleBack = () => {
    setStep(1);
    setMethod(null);
    setVerificationCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) return;

    setIsLoading(true);
    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(3);
      onSuccess(method, handleBack);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Enable Two-Factor Authentication"
      description="Choose your preferred 2FA method"
      icon={<Shield className="w-5 h-5 text-primary-purple-400" />}
    >
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-4 bg-surface-hover rounded-lg text-sm text-gray-400">
            Choose how you want to receive your two-factor authentication codes
          </div>

          <button
            onClick={() => {
              setMethod("authenticator");
              setStep(2);
            }}
            className="w-full flex items-center gap-3 p-4 bg-surface-hover hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-primary-purple-400" />
            </div>
            <div>
              <div className="font-medium text-white">Authenticator App</div>
              <div className="text-sm text-gray-400">
                Use an authenticator app like Google Authenticator or Authy
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setMethod("email");
              setStep(2);
            }}
            className="w-full flex items-center gap-3 p-4 bg-surface-hover hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary-purple-400" />
            </div>
            <div>
              <div className="font-medium text-white">Email</div>
              <div className="text-sm text-gray-400">
                Receive codes via email at {currentEmail}
              </div>
            </div>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleBack}
              className="p-1 -ml-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-400">
              {method === "authenticator" ? "Authenticator App" : "Email"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "authenticator" ? (
              <>
                <div className="p-4 bg-surface-hover rounded-lg text-sm text-gray-400">
                  Download an authenticator app like Google Authenticator or
                  Authy, then scan this QR code to set up two-factor
                  authentication.
                </div>

                {/* QR Code Placeholder */}
                <div className="aspect-square w-48 mx-auto bg-white p-4 rounded-lg">
                  <div className="w-full h-full bg-gray-100 rounded" />
                </div>
              </>
            ) : (
              <div className="p-4 bg-surface-hover rounded-lg text-sm text-gray-400">
                We've sent a verification code to {currentEmail}. Enter it below
                to enable two-factor authentication.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Enable 2FA"
              )}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            2FA is now enabled
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Your account is now more secure with{" "}
            {method === "authenticator" ? "authenticator" : "email"} two-factor
            authentication.
          </p>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-surface-hover text-white rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      handleClose();
    } catch (error) {
      setError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      icon={<Key className="w-5 h-5 text-primary-purple-400" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-surface-hover border border-white/[0.08] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary-purple-400/50"
            placeholder="Confirm new password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            isLoading || !currentPassword || !newPassword || !confirmPassword
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Changing Password...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </Modal>
  );
};

// Main Page Component
const SecurityPage = () => {
  // State
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
    method: undefined,
    email: "j***@example.com",
  });
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [activeSessions, setActiveSessions] = useState(MOCK_SESSIONS);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Handlers
  const handleEnableTwoFactor = () => {
    setShowTwoFactorModal(true);
  };

  const handleTwoFactorSuccess = async (
    method: TwoFactorMethod,
    resetStep: () => void
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      resetStep();
      setTwoFactorStatus((prev) => ({
        enabled: true,
        method,
        email: prev.email,
      }));
      setShowTwoFactorModal(false);
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
    }
  };

  const handleDisableTwoFactor = async () => {
    setIsDisabling2FA(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTwoFactorStatus((prev) => ({
        enabled: false,
        method: undefined,
        email: prev.email,
      }));
    } catch (error) {
      console.error("Failed to disable 2FA:", error);
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActiveSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      console.error("Failed to revoke session:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Security" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <h1 className="text-2xl font-semibold text-white">Security</h1>
          <p className="mt-1 text-base text-gray-400">
            Manage your account security and active sessions
          </p>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl space-y-8">
            {/* Two-Factor Authentication */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      Two-Factor Authentication
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        twoFactorStatus.enabled
                          ? "bg-green-400/10 text-green-400"
                          : "bg-gray-400/10 text-gray-400"
                      }`}
                    >
                      {twoFactorStatus.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {twoFactorStatus.enabled
                      ? `Currently using ${
                          twoFactorStatus.method === "authenticator"
                            ? "an authenticator app"
                            : "email authentication"
                        }`
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
              </div>

              {twoFactorStatus.enabled ? (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-hover rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      {twoFactorStatus.method === "authenticator" ? (
                        <Smartphone className="w-5 h-5 text-primary-purple-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary-purple-400" />
                      )}
                      <span className="text-white">
                        {twoFactorStatus.method === "authenticator"
                          ? "Authenticator App"
                          : `Email (${twoFactorStatus.email})`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 ml-8">
                      Last verified 2 days ago
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleEnableTwoFactor}
                      className="flex-1 px-4 py-2 bg-surface-hover text-white rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      Change Method
                    </button>
                    <button
                      onClick={handleDisableTwoFactor}
                      disabled={isDisabling2FA}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDisabling2FA ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Disabling...
                        </>
                      ) : (
                        "Disable 2FA"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEnableTwoFactor}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors"
                >
                  Enable 2FA
                </button>
              )}
            </div>

            {/* Password */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Password</h2>
                  <p className="text-sm text-gray-400">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-hover text-white rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>

            {/* Active Sessions */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Active Sessions
                    </h2>
                    <p className="text-sm text-gray-400">
                      Manage your active sessions across devices
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                    Revoke All Other Sessions
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 ${
                      session.isCurrent ? "bg-surface-hover" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                            {session.deviceType === "mobile" ? (
                              <MobileIcon className="w-5 h-5 text-primary-purple-400" />
                            ) : (
                              <Monitor className="w-5 h-5 text-primary-purple-400" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {session.browser} on {session.device}
                            </span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-400/10 text-green-400 rounded-full">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                <span>{session.ipAddress}</span>
                              </div>
                              <span className="text-white/20">•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{session.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{session.lastActive}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnableTwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        onSuccess={handleTwoFactorSuccess}
        currentEmail={twoFactorStatus.email || ""}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default SecurityPage;
