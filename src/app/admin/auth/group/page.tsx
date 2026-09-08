import React from "react";
import AdminAuthGroupPage from "@/components/sites/spotline888-org/admin-auth/AdminAuthGroupPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group - Abbott",
  description: "Role Group Management - Abbott FastAdmin",
};

export default function AdminAuthGroupRoutePage() {
  return <AdminAuthGroupPage />;
}
