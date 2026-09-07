import React from "react";
import AdminUpmarkPage from "@/components/sites/spotline888-org/admin-upmark/AdminUpmarkPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "充值管理 - Abbott",
  description: "Recharge Management - Abbott FastAdmin",
};

export default function AdminUpmarkRoute() {
  return <AdminUpmarkPage />;
}
