"use client";

import React, { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Modal from "@/components/shared/Modal";

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: React.ElementType;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    icon: Zap,
    features: [
      "Up to 3 workspaces",
      "Basic chat features",
      "Standard support",
      "1GB storage",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    icon: Crown,
    features: [
      "Unlimited workspaces",
      "Advanced chat features",
      "Priority support",
      "10GB storage",
      "Custom branding",
      "API access",
    ],
    isPopular: true,
    isCurrent: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    icon: Sparkles,
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited storage",
      "Advanced security",
      "Custom integrations",
      "Usage insights",
      "SLA guarantee",
    ],
  },
];

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelModal = ({ isOpen, onClose, onConfirm }: CancelModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Subscription"
      description="This action cannot be undone"
      icon={<AlertCircle className="w-5 h-5 text-red-400" />}
    >
      <div className="bg-surface-hover border border-white/[0.08] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-5 h-5 text-primary-purple-400" />
          <span className="font-medium text-white">Pro Plan</span>
        </div>
        <p className="text-sm text-gray-400 ml-8">
          Your subscription will be cancelled at the end of the current billing
          period. You'll lose access to Pro features on April 1, 2024.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-surface-hover text-white rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          Keep Subscription
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Cancel Subscription
        </button>
      </div>
    </Modal>
  );
};

const SubscriptionPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      // Add your cancellation logic here
      console.log("Subscription cancelled");
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Subscription" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Subscription
              </h1>
              <p className="mt-1 text-base text-gray-400">
                Manage your subscription plan and usage
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-surface-hover hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Manage Subscription
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-card border border-white/[0.08] rounded-lg shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Add your billing portal logic here
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-surface-hover transition-colors"
                  >
                    Billing Portal
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowCancelModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-surface-hover transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl space-y-8">
            {/* Current Usage */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Current Usage
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-surface-hover rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Workspaces</div>
                  <div className="text-2xl font-semibold text-white">5/∞</div>
                </div>
                <div className="p-4 bg-surface-hover rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Storage Used</div>
                  <div className="text-2xl font-semibold text-white">
                    2.1/10GB
                  </div>
                </div>
                <div className="p-4 bg-surface-hover rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">API Calls</div>
                  <div className="text-2xl font-semibold text-white">
                    8.2k/10k
                  </div>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-surface-card border rounded-xl p-6 flex flex-col ${
                      plan.isPopular
                        ? "border-primary-purple-400"
                        : "border-white/[0.08]"
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-purple-400 text-white text-xs font-medium rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          plan.isCurrent
                            ? "bg-primary-purple-400/20 text-primary-purple-400"
                            : "bg-white/[0.05] text-white/60"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {plan.name}
                        </h3>
                        <div className="text-sm text-gray-400">
                          ${plan.price}/month
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-gray-400"
                        >
                          <Check className="w-4 h-4 text-primary-purple-400 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        plan.isCurrent
                          ? "bg-white/[0.08] text-white/60 cursor-default"
                          : "bg-primary-purple-400 text-white hover:bg-primary-purple-500"
                      }`}
                      disabled={plan.isCurrent}
                    >
                      {plan.isCurrent ? "Current Plan" : "Upgrade"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
};

export default SubscriptionPage;
