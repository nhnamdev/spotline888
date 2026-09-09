import type { Metadata } from "next";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Spotline888 FastAdmin Control Panel",
  description: "Spotline888 FastAdmin Control Panel",
  icons: {
    icon: "/sites/spotline888-org/admin-dashboard/favicon.ico",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
