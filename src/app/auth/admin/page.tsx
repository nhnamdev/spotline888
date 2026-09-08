import React from "react";
import AdminAuthAdminPage from "@/components/sites/spotline888-org/admin-auth/AdminAuthAdminPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Abbott",
  description: "Admin User Management - Abbott FastAdmin",
};

export default function AuthAdminPage() {
  return <AdminAuthAdminPage />;
}
