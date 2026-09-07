import React from "react";
import AdminUserPage from "@/components/sites/spotline888-org/admin-user/AdminUserPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会员管理 - Abbott",
  description: "User Management - Abbott FastAdmin",
};

export default function AdminUserRoute() {
  return <AdminUserPage />;
}
