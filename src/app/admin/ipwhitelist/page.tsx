import React from "react";
import AdminIpWhitelistPage from "@/components/sites/spotline888-org/admin-ipwhitelist/AdminIpWhitelistPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "后台IP白名单 - Abbott",
  description: "后台IP白名单 - Abbott FastAdmin",
};

export default function AdminIpWhitelistAliasPage() {
  return <AdminIpWhitelistPage />;
}
