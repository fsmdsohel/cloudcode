"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FeatureCard from "@/components/ui/FeatureCard";
import PricingCard from "@/components/ui/PricingCard";
import { IFeatureCard, IPricingCard } from "@/types/app";
import {
  Cpu,
  Cloud,
  Zap,
  Mail,
  MessageCircle,
  Braces,
  GitBranch,
  Sparkles,
  Workflow,
  Terminal,
  Rocket,
  Play,
  Github,
  Send,
} from "lucide-react";
import Link from "next/link";
import LandingLoading from "./loading";
import ThemeToggle from "@/components/shared/ThemeToggle";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set initial scroll state
    setHasScrolled(window.scrollY > 0);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 0);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const features: IFeatureCard[] = [
    {
      icon: Cloud,
      title: "On-Demand Workspaces",
      description:
        "Instantly spin up containerized development environments with individual Kubernetes Pods.",
    },
    {
      icon: Cpu,
      title: "AI-Powered Mentorship",
      description:
        "Integrated AI models provide real-time code review and personalized learning guidance.",
    },
    {
      icon: Zap,
      title: "Resource Efficient",
      description:
        "Automatically managed environments that spin up and down to optimize computational resources.",
    },
  ];

  const pricingPlans: IPricingCard[] = [
    {
      title: "Free",
      price: "$0",
      features: [
        "1 Active Workspace",
        "Basic AI Assistance",
        "Community Support",
        "10 Monthly Hours",
        "Public Templates",
        "Basic Code Insights",
      ],
    },
    {
      title: "Plus",
      price: "$19",
      features: [
        "Up to 5 Workspaces",
        "Enhanced AI Assistance",
        "Faster Support",
        "Collaborative Editing",
        "Private Templates",
        "Detailed Code Analysis",
        "Limited API Access",
      ],
      highlight: true,
    },
    {
      title: "Pro",
      price: "$49",
      features: [
        "Custom Domain Support",
        "Optimized Performance",
        "Priority Support",
        "Enhanced Security",
        "Third-Party Integrations",
        "Advanced Usage Insights",
        "Uptime Commitment",
      ],
    },
  ];

  if (isLoading) {
    return <LandingLoading />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Nav */}
        <nav
          className={`
            fixed top-0 left-0 right-0 py-4 z-50
            border-b border-transparent 
            ${
              hasScrolled
                ? "bg-white/80 dark:bg-[#0F1117]/80 backdrop-blur-md border-gray-200 dark:border-white/[0.08]"
                : "bg-transparent"
            }
            transition-all duration-200
          `}
        >
          {/* Nav Content Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-500/10">
                <Terminal className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                CloudCode
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Documentation
              </Link>
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/auth/login"
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 border border-purple-500/20"
              >
                Login
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <span
                  className={`w-6 h-0.5 bg-gray-400 group-hover:bg-gray-300 transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-gray-400 group-hover:bg-gray-300 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-gray-400 group-hover:bg-gray-300 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed inset-x-0 top-[65px] p-4 transition-all duration-300 ease-in-out transform ${
              mobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8 pointer-events-none"
            }`}
          >
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/[0.08] shadow-xl">
              <div className="p-6">
                <nav className="grid gap-4">
                  <Link
                    href="/docs"
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <a
                    href="#features"
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                </nav>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <main className="pb-12 sm:pb-20 pt-24 sm:pt-32 text-center">
            <div className="max-w-3xl mx-auto animate-fadeIn px-4">
              <div className="inline-block bg-blue-50 dark:bg-primary-blue-100 px-4 py-2 rounded-full text-blue-600 dark:text-primary-blue-400 mb-6 hover:scale-105 transition-all">
                Learn. Code. Grow.
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary-blue-400 dark:to-primary-purple-400 leading-tight">
                Code Without Complexity
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Eliminate environment setup. Start coding instantly with
                containerized workspaces and AI-powered learning support.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
                <Link
                  href="/dashboard"
                  className="group bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
                >
                  <Rocket className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">Get Started</span>
                </Link>
                <button className="group border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all hover:scale-105 text-gray-700 dark:text-white flex items-center justify-center space-x-3 shadow-md">
                  <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                  <span className="font-medium">Watch Demo</span>
                </button>
              </div>
            </div>
          </main>

          {/* Product Screenshot Section */}
          <section className="py-12 sm:py-20">
            <div className="text-center mb-10 sm:mb-16 animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
                Your Coding Environment, Simplified
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
                Experience the seamless interface that brings your coding
                projects to life.
              </p>
            </div>

            <div className="relative group animate-fadeIn">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-lg dark:shadow-2xl shadow-blue-200/50 dark:shadow-blue-500/20 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-blue-300/30 dark:hover:shadow-blue-500/30 transition-all transform hover:scale-[1.01] duration-300">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src="/static/product.png"
                    alt="CloudCode Product Screenshot"
                    width={1280}
                    height={720}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-50 group-hover:opacity-40 transition-opacity"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Workspace Features Section */}
          <section className="py-12 sm:py-20">
            <div className="text-center mb-16 animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
                Powerful Workspace Features
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need for a seamless development experience
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left: Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Braces,
                    title: "Smart Autocomplete",
                    description:
                      "AI-powered code suggestions and intelligent completions",
                  },
                  {
                    icon: GitBranch,
                    title: "Git Integration",
                    description:
                      "Built-in version control with GitHub synchronization",
                  },
                  {
                    icon: Sparkles,
                    title: "AI Assistant",
                    description:
                      "Real-time code review and optimization suggestions",
                  },
                  {
                    icon: Workflow,
                    title: "Custom Workflows",
                    description: "Create and save your development workflows",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group h-full p-6 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-surface-card hover:bg-gray-50 dark:hover:bg-surface-hover hover:border-gray-300 dark:hover:border-white/[0.15] transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-500 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: Interactive Preview */}
              <div className="relative group animate-fadeIn rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 dark:from-purple-500/10 via-transparent to-blue-100/30 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Terminal-like Header */}
                <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30" />
                    <div className="w-3 h-3 rounded-full bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30" />
                    <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    workspace.cloud-code.dev
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                      Ready
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Node.js • TypeScript • React
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-colors text-sm">
                      Open Terminal
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors text-sm">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-12 sm:py-20 scroll-mt-20">
            <div className="text-center mb-10 sm:mb-16 animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
                Simplify Your Coding Journey
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
                CloudCode leverages Kubernetes to provide scalable, efficient,
                and intelligent coding environments.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="animate-fadeIn h-full"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-12 sm:py-20 scroll-mt-20">
            <div className="text-center mb-10 sm:mb-16 animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
                Pricing
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
                Flexible pricing options to fit your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`
                    relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 h-full
                    ${
                      plan.highlight
                        ? "bg-blue-50 dark:bg-primary-blue-100 border-blue-200 dark:border-primary-blue-300 shadow-lg shadow-blue-100 dark:shadow-glow-blue"
                        : "bg-white dark:bg-surface-card border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15]"
                    }
                  `}
                >
                  <PricingCard {...plan} />
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Info */}
                <div>
                  <div className="max-w-lg">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Let&apos;s Build Together
                    </h2>
                    <p className="text-gray-600 dark:text-white/60 mb-8">
                      Have questions about our platform or need help getting
                      started? We&apos;re here to help you build amazing things.
                    </p>

                    {/* Quick Contact Links */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: Mail,
                          title: "Email Us",
                          description: "Get a response within 24h",
                          action: "support@cloudcode.dev",
                          href: "mailto:support@cloudcode.dev",
                        },
                        {
                          icon: MessageCircle,
                          title: "Live Chat",
                          description: "Available 24/7 for Pro users",
                          action: "Start a conversation",
                          href: "#",
                        },
                        {
                          icon: Github,
                          title: "GitHub",
                          description: "Follow our progress",
                          action: "View repository",
                          href: "https://github.com",
                        },
                      ].map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="group flex items-center p-4 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-surface-card hover:bg-gray-50 dark:hover:bg-surface-hover hover:border-gray-300 dark:hover:border-white/[0.15] transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-primary-purple-100 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-purple-600 dark:text-primary-purple-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-white/60">
                              {item.description}
                            </p>
                            <span className="text-sm text-purple-600 dark:text-primary-purple-400 mt-1 block group-hover:text-purple-700 dark:group-hover:text-primary-purple-300 transition-colors">
                              {item.action}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-surface-hover border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:border-purple-400 dark:focus:border-primary-purple-400/50 transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-surface-hover border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:border-purple-400 dark:focus:border-primary-purple-400/50 transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-surface-hover border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:border-purple-400 dark:focus:border-primary-purple-400/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-surface-hover border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:border-purple-400 dark:focus:border-primary-purple-400/50 transition-colors resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-purple-600 dark:bg-primary-purple-400 hover:bg-purple-700 dark:hover:bg-primary-purple-500 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Send Message
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="py-16 sm:py-20 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Product */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">
                  Product
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/login"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Partners
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                    <Terminal className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  </div>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    CloudCode
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  © 2025 CloudCode. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
