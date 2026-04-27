import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // If user is already logged in, don't show login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};