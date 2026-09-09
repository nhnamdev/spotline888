import React from "react";
import AdminProductTypePage from "@/components/sites/spotline888-org/admin-product/AdminProductTypePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品分类 - Abbott",
  description: "Product Category - Abbott FastAdmin",
};

export default function AdminProductTypePageWrapper() {
  return <AdminProductTypePage />;
}
