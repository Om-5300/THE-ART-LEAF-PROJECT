import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "artleaf_secret";

export const ADMIN_COOKIE_NAME = "artleaf_admin_session";

export function signAdminToken(payload: { username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

// 🔥 FIXED: never throw error
export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}