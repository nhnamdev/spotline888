import React from "react";
import AdminAuthAdminLogPage from "@/components/sites/spotline888-org/admin-auth/AdminAuthAdminLogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin log - Abbott",
  description: "Admin Log Management - Abbott FastAdmin",
};

export default function AuthAdminLogPage() {
  return <AdminAuthAdminLogPage />;
}
