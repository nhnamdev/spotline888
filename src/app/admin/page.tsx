import type { Metadata } from "next";
import AdminDashboardPage from "@/components/sites/spotline888-org/admin-dashboard/AdminDashboardPage";

export const metadata: Metadata = {
  title: "控制台 - 管理后台",
  description: "Spotline888 FastAdmin 管理后台",
  icons: {
    icon: "/sites/spotline888-org/admin-dashboard/favicon.ico",
  },
};

export default function AdminRootPage() {
  return <AdminDashboardPage />;
}
