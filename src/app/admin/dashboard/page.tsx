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
    async (authToken: string, mounted: { current: boolean }) => {
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

        if (mounted.current) {
          setServices(Array.isArray(servicesData) ? servicesData : []);
          setGallery(Array.isArray(galleryData) ? galleryData : []);
          setContacts(Array.isArray(contactsData) ? contactsData : []);
        }
      } catch {
        if (mounted.current) setError("Unable to load dashboard data.");
      }
    },
    [router]
  );

  useEffect(() => {
    const isMounted = { current: true };
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      loadData(token, isMounted);
    }
    return () => {
      isMounted.current = false;
    };
  }, [router, loadData]);

  // ================= SERVICES =================

  async function addService(formData: FormData) {
    const token = getToken();
    const payload = Object.fromEntries(formData.entries());

    await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

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

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Admin Dashboard</h1>
      {error && <p className="form-error">{error}</p>}

      <div className="grid-2 admin-grid">
        {/* SERVICES */}
        <section className="glass-card admin-card">
          <h2>Add Service</h2>
          <form className="form" action={addService}>
            <input name="title" placeholder="Title" required />
            <input name="icon" placeholder="Icon" required />
            <input
              name="shortDescription"
              placeholder="Short description"
              required
            />
            <textarea name="description" placeholder="Description" required />
            <button className="btn btn-primary">Save</button>
          </form>

          {services.map((s) => (
            <div key={s._id} className="row-between admin-row">
              {" "}
              <span>{s.title}</span>
              <button
                className="btn btn-secondary"
                onClick={() => deleteService(s._id!)}
              >
                Delete
              </button>{" "}
            </div>
          ))}
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
              <option value="kuttchi-bharat">Kuttchi-Bharat</option>
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
