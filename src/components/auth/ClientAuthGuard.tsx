"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ClientAuthGuardProps {
  children: React.ReactNode;
}

// Các route công khai không bắt buộc đăng nhập
const PUBLIC_CLIENT_ROUTES = [
  "/login",
  "/register",
  "/pages/login/login",
  "/pages/login/register",
];

export default function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Nếu là phân hệ Admin, bỏ qua để AdminAuthGuard xử lý riêng
    if (pathname.startsWith("/admin")) {
      setIsAuthenticated(true);
      return;
    }

    const token =
      localStorage.getItem("user_token") || localStorage.getItem("token");

    const isPublic = PUBLIC_CLIENT_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(r + "/")
    );

    // 2. Nếu đang ở trang công khai (/login, /register)
    if (isPublic) {
      if (token) {
        // Đã đăng nhập rồi mà vào /login -> tự động đưa vào trang chủ
        router.replace("/");
        return;
      }
      setIsAuthenticated(true);
      return;
    }

    // 3. Nếu đang ở các trang client cần bảo vệ
    if (!token) {
      // Chưa đăng nhập -> đẩy ngay về trang /login
      document.cookie = "user_token=; path=/; max-age=0";
      document.cookie = "token=; path=/; max-age=0";
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    }

    // Đảm bảo cookie được đồng bộ cho Next.js Middleware & SSR
    document.cookie = `user_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;

    // 4. Xác thực tính hợp lệ của token qua API /api/user/profile
    let isMounted = true;
    async function verifyUserAuth() {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

        // Token không hợp lệ hoặc tài khoản bị khóa
        localStorage.removeItem("user_token");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("user_info");
        document.cookie = "user_token=; path=/; max-age=0";
        document.cookie = "token=; path=/; max-age=0";
        setIsAuthenticated(false);
        router.replace("/login");
      } catch {
        // Nếu mạng chập chờn nhưng có token local, tạm thời cho phép
        if (isMounted) {
          setIsAuthenticated(true);
        }
      }
    }

    verifyUserAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Đang kiểm tra đăng nhập trên trang Client -> Hiển thị loading mobile đẹp mắt
  const isPublic = PUBLIC_CLIENT_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  if (!pathname.startsWith("/admin") && !isPublic && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-3 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div className="text-[13px] text-gray-500 font-medium">
            正在安全加载 (Đang xác thực tài khoản)...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
