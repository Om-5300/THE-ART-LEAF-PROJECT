"use client";

import { ContactMessage } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("artleaf_admin_token") || "";

  async function parseJsonSafe<T>(res: Response): Promise<T | null> {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  const loadData = useCallback(
    async (authToken: string) => {
      try {
        setError("");
        setLoading(true);
        const headers = { Authorization: `Bearer ${authToken}` };

        const res = await fetch("/api/contact", { headers });

        if (res.status === 401) {
          localStorage.removeItem("artleaf_admin_token");
          router.push("/login");
          return;
        }

        const data = await parseJsonSafe<ContactMessage[]>(res);
        setContacts(Array.isArray(data) ? data : []);
      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    loadData(token);
  }, [router, loadData]);

  async function deleteContact(id: string) {
    if (!confirm("Delete this message?")) return;
    const token = getToken();
    await fetch(`/api/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(token);
  }

  async function handleLogout() {
    localStorage.removeItem("artleaf_admin_token");
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="container page-pad page-shell">
      <div className="row-between">
        <h1 className="page-title">Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="grid-2 admin-grid">
        {/* SERVICES HUB */}
        <section className="glass-card admin-card">
          <h2>Services Management</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Add, update, or remove your website services.
          </p>
          <Link href="/admin/services-manager" className="btn btn-primary" style={{ width: '100%' }}>
            Manage Services →
          </Link>
        </section>

        {/* GALLERY HUB */}
        <section className="glass-card admin-card">
          <h2>Gallery Management</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Upload new photos or manage your existing gallery grid.
          </p>
          <Link href="/admin/gallery-manager" className="btn btn-primary" style={{ width: '100%' }}>
            Manage Gallery →
          </Link>
        </section>
      </div>

      {/* CONTACT */}
      <section className="glass-card admin-card" style={{ marginTop: '2rem' }}>
        <h2>Recent Contact Submissions</h2>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })
                        : 'N/A'}
                    </td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ maxWidth: '300px' }}>{c.message}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => deleteContact(c._id!)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
