"use client";

import { ServiceItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function ServicesManagerPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const getToken = () => localStorage.getItem("artleaf_admin_token") || "";

  const loadServices = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError("Unable to load services.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  async function handleServiceSubmit(formData: FormData) {
    const token = getToken();
    const payload = Object.fromEntries(formData.entries());

    const url = editingService
      ? `/api/services/${editingService._id}`
      : "/api/services";

    const method = editingService ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingService(null);
        loadServices();
      } else {
        alert("Operation failed");
      }
    } catch (err) {
      alert("Error saving service");
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const token = getToken();
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        if (editingService?._id === id) setEditingService(null);
      }
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="container page-pad page-shell">
      <div className="row-between">
        <h1 className="page-title">Services Manager</h1>
        <Link href="/admin/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '2rem', alignItems: 'start' }}>
        {/* FORM SECTION */}
        <section className="glass-card admin-card">
          <h2>{editingService ? "Modify Service" : "Add New Service"}</h2>
          <form className="form" action={handleServiceSubmit} key={editingService?._id || "new"}>
            <input
              name="title"
              placeholder="Title"
              defaultValue={editingService?.title || ""}
              required
            />
            <input
              name="icon"
              placeholder="Icon (emoji or icon name)"
              defaultValue={editingService?.icon || ""}
              required
            />
            <select
              name="category"
              defaultValue={editingService?.category || "Fabric"}
              required
            >
              <option value="Fabric">Fabric</option>
              <option value="Wedding">Wedding</option>
              <option value="Jewellery">Jewellery</option>
              <option value="Decor">Decor</option>
              <option value="Art">Art</option>
              <option value="Embroidery">Embroidery</option>
            </select>
            <input
              name="shortDescription"
              placeholder="Short description"
              defaultValue={editingService?.shortDescription || ""}
              required
            />
            <textarea
              name="description"
              placeholder="Full Description"
              defaultValue={editingService?.description || ""}
              required
              rows={4}
            />
            <div className="cta-row admin-row">
              <button className="btn btn-primary" type="submit">
                {editingService ? "Update Service" : "Add Service"}
              </button>
              {editingService && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST SECTION */}
        <section>
          <h2>Existing Services</h2>
          {loading && <p>Loading services...</p>}
          {error && <p className="form-error">{error}</p>}

          <div className="list-stack admin-list">
            {services.map((s) => (
              <div key={s._id} className="glass-card service-manager-card" style={{ marginBottom: '1rem', padding: '1.2rem' }}>
                <div className="row-between">
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{s.icon} {s.title}</strong>
                    <p className="eyebrow" style={{ fontSize: '0.65rem', margin: '2px 0' }}>{s.category}</p>
                  </div>
                  <div className="admin-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingService(s)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Modify
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteService(s._id!)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
