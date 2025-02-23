import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "./providers/provider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudCode | Landing Page",
  description: "CloudCode is a cloud-based code editor.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "react-router-warning": "ignore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen bg-[#0F1117]`}
      >
        {/* Fixed Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-[#0F1117] to-blue-500/5" />

          {/* Line pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(
                  45deg,
                  rgba(139, 92, 246, 0.05) 25%,
                  transparent 25%,
                  transparent 75%,
                  rgba(59, 130, 246, 0.05) 75%,
                  rgba(59, 130, 246, 0.05)
                )
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <Provider>{children}</Provider>
        </div>
      </body>
    </html>
  );
}
