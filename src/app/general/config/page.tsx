import React from "react";
import AdminGeneralConfigPage from "@/components/sites/spotline888-org/admin-general/AdminGeneralConfigPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "网站配置 - Abbott",
  description: "General Website Config - Abbott FastAdmin",
};

export default function GeneralConfigPage() {
  return <AdminGeneralConfigPage />;
}
