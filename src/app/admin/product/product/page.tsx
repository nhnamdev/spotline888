import React from "react";
import AdminProductListPage from "@/components/sites/spotline888-org/admin-product/AdminProductListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品列表 - Abbott",
  description: "Product List - Abbott FastAdmin",
};

export default function AdminProductProductPage() {
  return <AdminProductListPage />;
}
