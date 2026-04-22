import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // ✅ Allow login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // 🔒 Protect admin routes
  if (pathname.startsWith("/admin")) {
    // ❌ No token
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ❌ Invalid token
    const valid = verifyAdminToken(token);

    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};