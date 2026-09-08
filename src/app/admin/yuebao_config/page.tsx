import React from "react";
import AdminYuebaoConfigPage from "@/components/sites/spotline888-org/admin-yuebao/AdminYuebaoConfigPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "余额宝配置 - Abbott",
  description: "余额宝配置 - Abbott FastAdmin",
};

export default function AdminYuebaoConfigAliasPage() {
  return <AdminYuebaoConfigPage />;
}
