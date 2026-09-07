import React from "react";
import AdminDownmarkPage from "@/components/sites/spotline888-org/admin-downmark/AdminDownmarkPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "提现管理 - Abbott",
  description: "Withdrawal Management - Abbott FastAdmin",
};

export default function DownmarkRoute() {
  return <AdminDownmarkPage />;
}
