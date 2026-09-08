import React from "react";
import AdminVerifyPage from "@/components/sites/spotline888-org/admin-verify/AdminVerifyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "实名认证 - Abbott",
  description: "实名认证 - Abbott FastAdmin",
};

export default function VerifyPage() {
  return <AdminVerifyPage />;
}
