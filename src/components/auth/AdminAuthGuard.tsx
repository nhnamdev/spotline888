"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Trang đăng nhập admin không cần bảo vệ
    if (pathname === "/admin/login") {
      const existingToken = localStorage.getItem("admin_token");
      if (existingToken) {
        // Đã có token -> chuyển thẳng vào dashboard
        router.replace("/admin/dashboard");
        return;
      }
      setIsAuthenticated(true);
      return;
    }

    // 2. Các trang Admin khác: Kiểm tra admin_token
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      // Xóa cookie nếu có để đồng bộ
      document.cookie = "admin_token=; path=/; max-age=0";
      setIsAuthenticated(false);
      router.replace("/admin/login");
      return;
    }

    // Đồng bộ vào cookie cho SSR / Middleware
    document.cookie = `admin_token=${adminToken}; path=/; max-age=604800; SameSite=Lax`;

    // 3. Xác thực tính hợp lệ của token với API backend
    let isMounted = true;
    async function verifyAdminAuth() {
      try {
        const res = await fetch("/api/admin/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.code === 1) {
            setIsAuthenticated(true);
            return;
          }
        }

        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_keep_login");
        document.cookie = "admin_token=; path=/; max-age=0";
        setIsAuthenticated(false);
        router.replace("/admin/login");
      } catch {
        // Nếu không kết nối được server nhưng có token local, tạm thời cho phép
        if (isMounted) {
          setIsAuthenticated(true);
        }
      }
    }

    verifyAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Đang kiểm tra quyền Admin -> Hiển thị loading nhẹ chuẩn giao diện FastAdmin
  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f4f6",
          fontFamily:
            '"Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", sans-serif',
        }}
      >
        <div style={{ textAlign: "center", color: "#666" }}>
          <i
            className="fa fa-spinner fa-spin fa-2x"
            style={{ color: "#18bc9c", marginBottom: 12 }}
          ></i>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>
            正在验证管理员权限 (Đang xác thực quyền Admin)...
          </div>
        </div>
      </div>
    );
  }

  // Đã xác thực hoặc đang ở trang /admin/login
  return <>{children}</>;
}
