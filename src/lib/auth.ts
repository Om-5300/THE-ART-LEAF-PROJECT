import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // Use env, fallback for dev

export const ADMIN_COOKIE_NAME = "artleaf_admin_session";

export function signAdminToken(payload: { username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function verifyAuth(request: NextRequest) {
  // Check Authorization header first (for API calls from client)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (verifyAdminToken(token)) {
      return true;
    }
  }

  // Fallback to cookie (for middleware or direct calls)
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token && verifyAdminToken(token)) {
    return true;
  }

  throw new Error("Unauthorized");
}