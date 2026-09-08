import React from "react";
import AdminProfilePage from "@/components/sites/spotline888-org/admin-profile/AdminProfilePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Abbott",
  description: "Profile Management - Abbott FastAdmin",
};

export default function GeneralProfilePage() {
  return <AdminProfilePage />;
}
