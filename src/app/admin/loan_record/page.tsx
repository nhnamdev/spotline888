import React from "react";
import AdminLoanRecordPage from "@/components/sites/spotline888-org/admin-loan/AdminLoanRecordPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "贷款记录管理 - Abbott",
  description: "Loan Record Management - Abbott FastAdmin",
};

export default function AdminLoanRecordPageWrapper() {
  return <AdminLoanRecordPage />;
}
