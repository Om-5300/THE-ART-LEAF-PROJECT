"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactMessage, GalleryItem, ServiceItem } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");

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

  async function loadData(authToken: string) {
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

      if (!s.ok || !g.ok || !c.ok) {
        setError("Unable to load dashboard data right now.");
      }

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch {
      setError("Unable to load dashboard data right now.");
      setServices([]);
      setGallery([]);
      setContacts([]);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("artleaf_admin_token") || "";
    if (!stored) {
      router.push("/login");
      return;
    }

    void Promise.resolve().then(() => loadData(stored));
  }, [router]);

  async function addService(formData: FormData) {
    const token = getToken();
    const payload = Object.fromEntries(formData.entries());
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    loadData(token);
  }

  async function deleteService(id: string) {
    const token = getToken();
    await fetch(`/api/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadData(token);
  }

  async function editService(service: ServiceItem) {
    const token = getToken();
    if (!service._id) return;
    const title = window.prompt("Update service title", service.title);
    if (!title) return;
    await fetch(`/api/services/${service._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...service, title }),
    });
    loadData(token);
  }

  async function addGallery(formData: FormData) {
    const token = getToken();
    await fetch("/api/gallery", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
    loadData(token);
  }

  async function deleteGallery(id: string) {
    const token = getToken();
    await fetch(`/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadData(token);
  }

  async function deleteContact(id: string) {
    const token = getToken();
    await fetch(`/api/contact/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadData(token);
  }

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Admin Dashboard</h1>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="grid-2 admin-grid">
        <section className="glass-card admin-card">
          <h2>Add Service</h2>
          <form className="form" action={addService}>
            <input name="title" placeholder="Title" required />
            <input name="icon" placeholder="Icon" required />
            <input name="shortDescription" placeholder="Short description" required />
            <textarea name="description" placeholder="Description" required />
            <button className="btn btn-primary">Save</button>
          </form>
          <div className="list-stack admin-list">
            {services.map((service) => (
              <div key={service._id || service.title} className="row-between">
                <span>{service.title}</span>
                <div className="row-between admin-actions">
                  <button className="btn btn-secondary" onClick={() => editService(service)} disabled={!service._id}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => service._id && deleteService(service._id)} disabled={!service._id}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card admin-card">
          <h2>Upload Gallery Image</h2>
          <form className="form" action={addGallery}>
            <input name="title" placeholder="Title" required />
            <select name="category" defaultValue="fabric" required>
              <option value="fabric">Fabric</option>
              <option value="wedding">Wedding</option>
              <option value="jewellery">Jewellery</option>
            </select>
            <input name="description" placeholder="Description" />
            <input name="image" type="file" accept="image/*" required />
            <button className="btn btn-primary">Upload</button>
          </form>
          <div className="list-stack admin-list">
            {gallery.map((item) => (
              <div key={item._id || item.title} className="row-between">
                <span>{item.title}</span>
                <button className="btn btn-secondary" onClick={() => item._id && deleteGallery(item._id)} disabled={!item._id}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-card admin-card">
        <h2>Contact Submissions</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th /></tr>
            </thead>
            <tbody>
              {contacts.map((item) => (
                <tr key={item._id || item.email}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.message}</td>
                  <td><button className="btn btn-secondary" onClick={() => item._id && deleteContact(item._id)} disabled={!item._id}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

