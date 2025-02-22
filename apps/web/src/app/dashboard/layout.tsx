import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CloudCode",
  description: "Manage your projects and workspaces",
  robots: "noindex, nofollow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
