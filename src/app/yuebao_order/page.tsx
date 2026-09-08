import React from "react";
import AdminYuebaoOrderPage from "@/components/sites/spotline888-org/admin-yuebao/AdminYuebaoOrderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "余额宝订单 - Abbott",
  description: "余额宝订单 - Abbott FastAdmin",
};

export default function YuebaoOrderPage() {
  return <AdminYuebaoOrderPage />;
}
