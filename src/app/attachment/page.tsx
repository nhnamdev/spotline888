import React from "react";
import AdminAttachmentPage from "@/components/sites/spotline888-org/admin-attachment/AdminAttachmentPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attachment - Abbott",
  description: "Attachment Management - Abbott FastAdmin",
};

export default function AttachmentPage() {
  return <AdminAttachmentPage />;
}
