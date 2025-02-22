import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Workspaces | CloudCode",
  description: "Manage your CloudCode workspaces",
  robots: "noindex, nofollow",
};

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
