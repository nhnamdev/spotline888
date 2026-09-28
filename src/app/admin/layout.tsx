import type { Metadata } from "next";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Fortrade FastAdmin 管理后台",
  description: "Fortrade FastAdmin 管理后台",
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
