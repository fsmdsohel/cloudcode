"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FormInput } from "@/components/ui/form/FormInput";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual password reset request
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setIsSubmitted(true);
      toast.success("Reset instructions sent to your email");
    } catch {
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm space-y-6">
        <Logo />

        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Forgot password?
                </h1>
                <p className="text-gray-400">
                  Enter your email to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  icon={Mail}
                />

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    "Send instructions"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 mb-6">
                We&apos;ve sent password reset instructions to{" "}
                <span className="text-white">{email}</span>
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Use a different email address
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
