import type { Metadata } from "next";
import AdminLoginPage from "@/components/sites/spotline888-org/admin-login/AdminLoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Spotline888 Admin Login",
  icons: {
    icon: "/sites/spotline888-org/admin-login/favicon.ico",
  },
};

export default function AdminLoginRoute() {
  return <AdminLoginPage />;
}
