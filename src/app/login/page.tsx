"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const payload = {
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("artleaf_admin_token", token);
      router.push("/admin");
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page-pad page-shell login-page">
      <section className="glass-card auth-card login-card">
        <p className="eyebrow">Secure Access</p>
        <h1 className="page-title">Login</h1>
        <p className="login-subtitle">Admin access only.</p>

        <form className="form" action={handleSubmit}>
          <input name="username" placeholder="Username" autoComplete="username" required />
          <input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
