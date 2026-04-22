import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Get env variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check env exists
    if (!adminUsername || !adminPassword) {
      console.error("ENV missing:", {
        ADMIN_USERNAME: adminUsername,
        ADMIN_PASSWORD: adminPassword,
      });

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Validate credentials
    const isUsernameValid = username.trim() === adminUsername;
    const isPasswordValid = password === adminPassword;

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = signAdminToken({ username: adminUsername });

    // Send response with cookie
    const response = NextResponse.json({
      message: "Login successful",
      token,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}