"use client";

import React from "react";
import SettingsHeader from "@/components/settings/SettingsHeader";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[{ title: "Privacy Policy" }]}
        showDashboard={false}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Privacy Policy
            </h1>
            <p className="mt-1 text-base text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl prose prose-invert">
            <section className="mb-12">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when
                using CloudCode:
              </p>
              <ul>
                <li>Account information (email, name)</li>
                <li>Usage data and preferences</li>
                <li>Project and workspace data</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Improve user experience</li>
                <li>Send important notifications</li>
                <li>Provide customer support</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>3. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-12">
              <h2>4. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request data correction</li>
                <li>Request data deletion</li>
                <li>Object to data processing</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
