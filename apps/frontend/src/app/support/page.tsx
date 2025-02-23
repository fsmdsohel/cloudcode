"use client";

import React from "react";
import {
  MessageCircle,
  Mail,
  FileText,
  Book,
  ArrowRight,
  Github,
  Twitter,
  HelpCircle,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";

const SupportPage = () => {
  const supportOptions = [
    {
      title: "Documentation",
      description: "Browse our comprehensive documentation",
      icon: Book,
      href: "/docs",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      href: "#chat",
      color: "bg-purple-500/10 text-purple-500",
      badge: "Pro",
    },
    {
      title: "Email Support",
      description: "Get help via email",
      icon: Mail,
      href: "mailto:support@cloudcode.dev",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Guides & Tutorials",
      description: "Learn from our tutorials",
      icon: FileText,
      href: "/docs/tutorials",
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const faqs = [
    {
      question: "How do I get started with CloudCode?",
      answer:
        "Sign up for an account and follow our quick start guide in the documentation. You'll be coding in minutes!",
    },
    {
      question: "What are the system requirements?",
      answer:
        "CloudCode runs in your browser - all you need is a modern web browser and internet connection.",
    },
    {
      question: "How do I deploy my application?",
      answer:
        "We provide multiple deployment options. Check our deployment guide in the documentation for details.",
    },
    {
      question: "Is my code secure?",
      answer:
        "Yes, we use industry-standard encryption and security practices to protect your code and data.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SettingsHeader breadcrumbs={[{ title: "Support" }]} />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Support Center
            </h1>
            <p className="mt-1 text-base text-gray-400">
              Get help and learn more about CloudCode
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl">
            {/* Support Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {supportOptions.map((option) => (
                <a
                  key={option.title}
                  href={option.href}
                  className="group p-6 rounded-xl border border-white/[0.08] bg-surface-card hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">
                          {option.title}
                        </h3>
                        {option.badge && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-400">
                        {option.description}
                      </p>
                      <div className="mt-3 text-sm text-purple-400 group-hover:text-purple-500 flex items-center gap-1">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* FAQs Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-white/[0.08] bg-surface-card"
                  >
                    <div className="flex gap-4">
                      <div className="p-2 rounded-lg bg-purple-500/10 h-fit">
                        <HelpCircle className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-white mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-gray-400">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Links */}
            <div className="mt-12">
              <h2 className="text-lg font-medium text-white mb-4">
                Join Our Community
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "GitHub Discussions",
                    icon: Github,
                    href: "https://github.com",
                  },
                  {
                    title: "Twitter Community",
                    icon: Twitter,
                    href: "https://twitter.com",
                  },
                ].map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg bg-surface-card border border-white/[0.08] hover:bg-surface-hover transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-300">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
