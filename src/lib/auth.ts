import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "artleaf_secret_123"; // 🔥 FIXED (no env confusion)

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
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token || !verifyAdminToken(token)) {
    throw new Error("Unauthorized");
  }

  return true;
}