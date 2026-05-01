"use client";

import { ContactMessage, GalleryItem, ServiceItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");
  const [galleryLoading, setGalleryLoading] = useState(false);

  // New state for modifying services
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

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
        const headers = { Authorization: `Bearer ${authToken}` };

        const [s, g, c] = await Promise.all([
          fetch("/api/services", { headers }),
          fetch("/api/gallery", { headers }),
          fetch("/api/contact", { headers }),
        ]);

        if (c.status === 401) {
          localStorage.removeItem("artleaf_admin_token");
          router.push("/login");
          return;
        }

        const [servicesData, galleryData, contactsData] = await Promise.all([
          parseJsonSafe<ServiceItem[]>(s),
          parseJsonSafe<GalleryItem[]>(g),
          parseJsonSafe<ContactMessage[]>(c),
        ]);

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setGallery(Array.isArray(galleryData) ? galleryData : []);
        setContacts(Array.isArray(contactsData) ? contactsData : []);
      } catch {
        setError("Unable to load dashboard data.");
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

  // ================= SERVICES =================

  async function addService(formData: FormData) {
    const token = getToken();
    const payload = Object.fromEntries(formData.entries());

    const url = editingService
      ? `/api/services/${editingService._id}`
      : "/api/services";

    const method = editingService ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setEditingService(null);
    loadData(token);
  }

  async function deleteService(id: string) {
    const token = getToken();
    await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(token);
  }

  function startEditing(service: ServiceItem) {
    setEditingService(service);
    // Optional: Scroll to top of the card
  }

  // ================= GALLERY =================

  async function addGallery(formData: FormData) {
    const token = getToken();
    setGalleryLoading(true);
    setError("");

    const file = formData.get("image");

    if (!(file instanceof File)) {
      setError("Please select an image.");
      setGalleryLoading(false);
      return;
    }

    try {
      // ✅ Upload directly to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("upload_preset", "art_leaf");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/deilfs6vw/image/upload",
        {
          method: "POST",
          body: cloudData,
        },
      );

      const cloudResult = await cloudRes.json();

      if (!cloudResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // ✅ Send only URL to backend
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.get("title"),
          category: formData.get("category"),
          description: formData.get("description"),
          image: cloudResult.secure_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      await loadData(token);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function deleteGallery(id: string) {
    const token = getToken();
    await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(token);
  }

  // ================= CONTACT =================

  async function deleteContact(id: string) {
    const token = getToken();
    await fetch(`/api/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(token);
  }

  // ================= LOGOUT =================

  async function handleLogout() {
    // 1. Clear local storage
    localStorage.removeItem("artleaf_admin_token");

    // 2. Clear cookie via API
    await fetch("/api/auth/logout", { method: "POST" });

    // 3. Redirect
    router.push("/login");
  }

  // ================= SECURITY (Auto Logout) =================

  useEffect(() => {
    // 1. Logout on Refresh (as requested)
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      void handleLogout();
      return;
    }

    // 2. Inactivity Logout (e.g., 5 minutes)
    const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        alert("Session expired due to inactivity.");
        void handleLogout();
      }, IDLE_TIMEOUT);
    };

    // Events to track activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(idleTimer);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [router]);

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
        {/* SERVICES */}
        <section className="glass-card admin-card">
          <h2>{editingService ? "Modify Service" : "Add Service"}</h2>
          <form className="form" action={addService} key={editingService?._id || "new"}>
            <input
              name="title"
              placeholder="Title"
              defaultValue={editingService?.title || ""}
              required
            />
            <input
              name="icon"
              placeholder="Icon"
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
              placeholder="Description"
              defaultValue={editingService?.description || ""}
              required
            />
            <div className="cta-row admin-row">
              <button className="btn btn-primary" type="submit">
                {editingService ? "Update Service" : "Save Service"}
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

          <div className="list-stack admin-list">
            {services.map((s) => (
              <div key={s._id} className="row-between admin-row glass-card">
                <span>{s.title}</span>
                <div className="admin-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => startEditing(s)}
                    style={{ marginRight: '8px' }}
                  >
                    Modify
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => deleteService(s._id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="glass-card admin-card">
          <h2>Upload Gallery Image</h2>

          <form className="form" action={addGallery}>
            <input name="title" placeholder="Title" required />
            <select name="category">
              <option value="fabric">Fabric</option>
              <option value="wedding">Wedding</option>
              <option value="jewellery">Jewellery</option>
              <option value="saree-resa">Saree-Resa</option>
              <option value="canvas-painting">Canvas Painting</option>
            </select>
            <input name="description" placeholder="Description" />
            <input type="file" name="image" required />
            <button className="btn btn-primary" disabled={galleryLoading}>
              {galleryLoading ? "Uploading..." : "Upload"}
            </button>
          </form>

          {gallery.map((g) => (
            <div key={g._id} className="row-between admin-row">
              {" "}
              <span>{g.title}</span>
              <button
                className="btn btn-secondary"
                onClick={() => deleteGallery(g._id!)}
              >
                Delete
              </button>{" "}
            </div>
          ))}
        </section>
      </div>

      {/* CONTACT */}
      <section className="glass-card admin-card">
        <h2>Contact Submissions</h2>

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
                  <td>
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
                  <td>{c.message}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteContact(c._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
