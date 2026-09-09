import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route công khai của client (không yêu cầu đăng nhập)
const PUBLIC_CLIENT_ROUTES = [
  "/login",
  "/register",
  "/pages/login/login",
  "/pages/login/register",
];

// Các route admin cũ ở root -> tự động chuyển hướng vào /admin/...
const LEGACY_ADMIN_REDIRECTS: Record<string, string> = {
  "/user": "/admin/user",
  "/upmark": "/admin/upmark",
  "/downmark": "/admin/downmark",
  "/attachment": "/admin/attachment",
  "/ipwhitelist": "/admin/ipwhitelist",
  "/loan_config": "/admin/loan_config",
  "/loan_record": "/admin/loan_record",
  "/yuebao_config": "/admin/yuebao_config",
  "/yuebao_order": "/admin/yuebao_order",
  "/category": "/admin/category",
  "/notice": "/admin/notice",
  "/general": "/admin/general",
  "/product/product": "/admin/product",
  "/product/type": "/admin/product-type",
};


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bỏ qua tài nguyên tĩnh và API backend
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/sites") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot|ico|json)$/i)
  ) {
    return NextResponse.next();
  }

  // 2. Chuyển hướng các route admin cũ về tiền tố /admin
  for (const [legacyPath, targetPath] of Object.entries(LEGACY_ADMIN_REDIRECTS)) {
    if (pathname === legacyPath || pathname.startsWith(legacyPath + "/")) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
  }

  // 3. Phân hệ Admin: BẮT BUỘC ĐĂNG NHẬP
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;

    // Trang đăng nhập admin
    if (pathname === "/admin/login") {
      if (adminToken) {
        // Đã có token -> chuyển vào trang chủ quản trị
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Các trang admin còn lại: Chưa có token -> Chặn và đẩy về /admin/login
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 4. Phân hệ Client: BẮT BUỘC ĐĂNG NHẬP
  const userToken =
    request.cookies.get("user_token")?.value ||
    request.cookies.get("token")?.value;

  const isPublicClient = PUBLIC_CLIENT_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  // 4.1. Trang công khai (/login, /register)
  if (isPublicClient) {
    if (userToken) {
      // Đã đăng nhập -> chuyển về trang chủ client
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4.2. Tất cả trang client còn lại: BẮT BUỘC PHẢI CÓ TOKEN
  if (!userToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
