import React from "react";
import AdminLoanConfigPage from "@/components/sites/spotline888-org/admin-loan/AdminLoanConfigPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "贷款配置管理 - Abbott",
  description: "Loan Config Management - Abbott FastAdmin",
};

export default function LoanConfigPage() {
  return <AdminLoanConfigPage />;
}
