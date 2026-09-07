import React from "react";
import AdminOrderPage from "@/components/sites/spotline888-org/admin-order/AdminOrderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "订单管理 - Abbott",
  description: "Order Management - Abbott FastAdmin",
};

export default function OrderPage() {
  return <AdminOrderPage />;
}
