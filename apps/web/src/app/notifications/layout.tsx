import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CloudCode | Notifications",
  description: "CloudCode is a cloud-based code editor.",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>;
};

export default Layout;
