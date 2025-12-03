"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Github, Mail, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FormInput } from "@/components/ui/form/FormInput";
import { FormCheckbox } from "@/components/ui/form/FormCheckbox";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { register } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const githubError = searchParams?.get("error") === "github_auth_failed";
  const toastShown = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (githubError && !toastShown.current) {
      toast.error("GitHub registration failed", {
        description: "Please try again or use another registration method",
      });
      toastShown.current = true;
    }
  }, [githubError]);

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

    try {
      setIsLoading(true);
      await dispatch(
        register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          acceptTerms: formData.acceptTerms,
        })
      ).unwrap();

      // Redirect to login with success flag
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      console.error("Registration error:", error);

      // The error object now contains the full backend response
      const { message, code, suggestion } = error;

      toast.error(message || "Registration failed", {
        description: suggestion,
        ...(code === "EMAIL_EXISTS" && {
          action: {
            label: "Login",
            onClick: () => router.push("/auth/login"),
          },
        }),
      });

      // Set form errors if validation failed
      if (code === "VALIDATION_ERROR" && error.details) {
        setErrors(error.details);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubRegister = () => {
    setIsLoading(true);
    try {
      const from = searchParams?.get("from");
      const state = from ? encodeURIComponent(from) : "dashboard";
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github?state=${state}`;
    } catch {
      toast.error("Failed to register with GitHub");
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    try {
      const from = searchParams?.get("from");
      const state = from ? encodeURIComponent(from) : "dashboard";
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google?state=${state}`;
    } catch {
      toast.error("Failed to register with Google");
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
              Create an account
            </h1>
            <p className="text-gray-400">Get started with CloudCode today</p>
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-medium px-4 py-3 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-7 h-7" />
            <span>Sign up with Google</span>
          </button>

          <button
            onClick={handleGithubRegister}
            disabled={isLoading}
            className="w-full bg-gray-800 text-white font-medium px-4 py-3 rounded-lg mb-4 hover:bg-gray-900 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5" />
            Sign up with GitHub
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
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                disabled={isLoading}
                error={errors.firstName}
                // icon={User}
              />
              <FormInput
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                disabled={isLoading}
                error={errors.lastName}
                // icon={User}
              />
            </div>
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
              placeholder="Create a password"
              disabled={isLoading}
              error={errors.password}
              icon={Lock}
            />
            <FormCheckbox
              id="terms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              disabled={isLoading}
              error={errors.acceptTerms}
              label={
                <>
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    className="text-purple-500 hover:text-purple-400"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-purple-500 hover:text-purple-400"
                  >
                    Privacy Policy
                  </Link>
                </>
              }
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-purple-500 hover:text-purple-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
