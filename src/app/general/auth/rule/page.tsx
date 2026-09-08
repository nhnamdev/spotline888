import React from "react";
import AdminAuthRulePage from "@/components/sites/spotline888-org/admin-auth/AdminAuthRulePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "菜单规则 - Abbott",
  description: "Menu Rule Management - Abbott FastAdmin",
};

export default function GeneralAuthRulePage() {
  return <AdminAuthRulePage />;
}
