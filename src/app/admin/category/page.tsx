import React from "react";
import AdminCategoryPage from "@/components/sites/spotline888-org/admin-category/AdminCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "图文管理 - Abbott",
  description: "Category Management - Abbott FastAdmin",
};

export default function AdminCategoryRoutePage() {
  return <AdminCategoryPage />;
}
