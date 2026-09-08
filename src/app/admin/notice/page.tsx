import React from "react";
import AdminNoticePage from "@/components/sites/spotline888-org/admin-notice/AdminNoticePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新闻公告 - Abbott",
  description: "新闻公告 - Abbott FastAdmin",
};

export default function AdminNoticeAliasPage() {
  return <AdminNoticePage />;
}
