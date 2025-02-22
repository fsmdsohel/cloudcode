"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Github, Mail, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FormInput } from "@/components/ui/form/FormInput";
import { FormCheckbox } from "@/components/ui/form/FormCheckbox";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { login } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isNewlyRegistered = searchParams?.get("registered") === "true";
  const githubError = searchParams?.get("error") === "github_auth_failed";
  const toastShown = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isNewlyRegistered && !toastShown.current) {
      toast.success("Account created successfully! Please login.");
      toastShown.current = true;
    }

    if (githubError && !toastShown.current) {
      toast.error("GitHub login failed", {
        description: "Please try again or use another login method",
      });
      toastShown.current = true;
    }

    const googleError = searchParams?.get("error") === "google_auth_failed";
    if (googleError && !toastShown.current) {
      toast.error("Google login failed", {
        description: "Please try again or use another login method",
      });
      toastShown.current = true;
    }
  }, [isNewlyRegistered, githubError, searchParams]);

  // TODO: Remove this
  useEffect(() => {
    setFormData({
      email: "sohel@gmail.com",
      password: "@Sohel123",
      rememberMe: true,
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear any existing errors

    try {
      setIsLoading(true);
      const result = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      // Add success toast with user's name if available
      toast.success(
        `Welcome back${
          result.data.user.firstName ? `, ${result.data.user.firstName}` : ""
        }!`
      );

      // Check for redirect path from URL parameters
      const from = searchParams?.get("from");
      const decodedPath = from ? decodeURIComponent(from) : "/dashboard";
      router.push(decodedPath);
    } catch (error: any) {
      console.error("Login error:", error);

      // The error object now contains the full backend response
      const { message, code, suggestion, details } = error;

      // Set form errors if validation failed
      if (code === "VALIDATION_ERROR" && details) {
        setErrors(details);
      }

      // Handle rate limiting
      if (code === "RATE_LIMIT_EXCEEDED") {
        toast.error("Too many login attempts", {
          description: "Please try again in a few minutes",
          duration: 5000,
        });
        return;
      }

      // Handle invalid credentials
      if (code === "INVALID_CREDENTIALS") {
        toast.error(message || "Invalid email or password", {
          description:
            suggestion || "Please check your credentials and try again",
        });
        return;
      }

      // Generic error
      toast.error(message || "Login failed", {
        description: suggestion || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    try {
      const from = searchParams?.get("from");
      const state = from ? encodeURIComponent(from) : "dashboard";
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github?state=${state}`;
    } catch {
      toast.error("Failed to login with GitHub");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      const from = searchParams?.get("from");
      const state = from ? encodeURIComponent(from) : "dashboard";
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google?state=${state}`;
    } catch {
      toast.error("Failed to login with Google");
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm space-y-6">
        <Logo />
        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-medium px-4 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-7 h-7" />
            <span>Sign in with Google</span>
          </button>

          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full bg-gray-800 text-white font-medium px-4 py-3 rounded-lg mb-4 hover:bg-gray-900 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/50 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              disabled={isLoading}
              error={errors.email}
              icon={Mail}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              error={errors.password}
              icon={Lock}
            />

            <div className="flex items-center justify-between">
              <FormCheckbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                label="Remember me"
              />
              <Link
                href="/auth/forgot-password"
                className="text-sm text-purple-500 hover:text-purple-400"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-purple-500 hover:text-purple-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
