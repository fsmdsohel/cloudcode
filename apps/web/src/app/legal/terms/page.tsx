"use client";

import React from "react";
import SettingsHeader from "@/components/settings/SettingsHeader";

const TermsPage = () => {
  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[{ title: "Terms of Service" }]}
        showDashboard={false}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Terms of Service
            </h1>
            <p className="mt-1 text-base text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl prose prose-invert">
            <section className="mb-12">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using CloudCode, you agree to be bound by these
                Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-12">
              <h2>2. Use of Service</h2>
              <p>
                CloudCode provides cloud-based development environments and
                related services. You agree to use these services only for
                lawful purposes and in accordance with these Terms.
              </p>
              <ul>
                <li>Maintain account security</li>
                <li>Respect intellectual property rights</li>
                <li>Follow acceptable use guidelines</li>
                <li>Comply with all applicable laws</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities under your account.
              </p>
            </section>

            <section className="mb-12">
              <h2>4. Intellectual Property</h2>
              <p>
                The service and its original content, features, and
                functionality are owned by CloudCode and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
