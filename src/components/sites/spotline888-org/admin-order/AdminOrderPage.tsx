"use client";

import React, { useState } from "react";
import AdminHeader from "../admin-dashboard/AdminHeader";
import AdminSidebar from "../admin-dashboard/AdminSidebar";
import AdminOrderContent from "./AdminOrderContent";

export default function AdminOrderPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="admin-wrapper skin-green">
      {/* Main Top Header with Order active tab */}
      <AdminHeader
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        activeTab="order"
      />

      {/* Left Sidebar with activePath set to /order */}
      <AdminSidebar isCollapsed={isSidebarCollapsed} activePath="/order" />

      {/* Content Area */}
      <div
        className={`content-wrapper ${
          isSidebarCollapsed ? "sidebar-collapse-margin" : ""
        }`}
      >
        <AdminOrderContent />
      </div>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          background-color: #f1f4f6;
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .admin-wrapper {
          min-height: 100vh;
          position: relative;
          background-color: #f1f4f6;
        }

        .content-wrapper {
          margin-left: 230px;
          margin-top: 50px;
          min-height: calc(100vh - 50px);
          background-color: #f1f4f6;
          transition: margin-left 0.3s ease-in-out;
          box-sizing: border-box;
        }

        .content-wrapper.sidebar-collapse-margin {
          margin-left: 50px;
        }

        @media (max-width: 767px) {
          .content-wrapper {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
