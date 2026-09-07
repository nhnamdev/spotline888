import type { Metadata } from "next";
import AdminDashboardPage from "@/components/sites/spotline888-org/admin-dashboard/AdminDashboardPage";

export const metadata: Metadata = {
  title: "Home - Dashboard",
  description: "Spotline888 FastAdmin Control Panel",
  icons: {
    icon: "/sites/spotline888-org/admin-dashboard/favicon.ico",
  },
};

export default function AdminDashboardRoute() {
  return <AdminDashboardPage />;
}
