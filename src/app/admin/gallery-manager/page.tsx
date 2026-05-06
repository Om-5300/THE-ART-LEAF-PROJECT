"use client";

import { GalleryItem, ServiceItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GalleryManagerPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [galleryLoading, setGalleryLoading] = useState(false);

  // State for modifying an item
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const getToken = () => localStorage.getItem("artleaf_admin_token") || "";

  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const [galleryRes, servicesRes] = await Promise.all([
        fetch("/api/gallery", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!galleryRes.ok || !servicesRes.ok) throw new Error("Failed to load data");

      const [galleryData, servicesData] = await Promise.all([
        galleryRes.json(),
        servicesRes.json()
      ]);

      setGallery(galleryData);
      setServices(servicesData);
    } catch (err) {
      setError("Unable to load manager data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleGallerySubmit(formData: FormData) {
    const token = getToken();
    setGalleryLoading(true);
    setError("");

    const file = formData.get("image") as File;
    let imageUrl = editingItem?.imageUrl || "";

    try {
      // 1. If a new file is selected, upload it to Cloudinary
      if (file && file.size > 0) {
        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("upload_preset", "art_leaf");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/deilfs6vw/image/upload",
          { method: "POST", body: cloudData }
        );

        const cloudResult = await cloudRes.json();
        if (!cloudResult.secure_url) throw new Error("Cloudinary upload failed");
        imageUrl = cloudResult.secure_url;
      } else if (!editingItem) {
        // If adding new but no image selected
        setError("Please select an image.");
        setGalleryLoading(false);
        return;
      }

      // 2. Save to our database
      const url = editingItem ? `/api/gallery/${editingItem._id}` : "/api/gallery";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.get("title"),
          category: formData.get("category"),
          description: formData.get("description"),
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Save failed");

      setEditingItem(null);
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Operation failed. Try again.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const token = getToken();
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setGallery((prev) => prev.filter((item) => item._id !== id));
        if (editingItem?._id === id) setEditingItem(null);
      }
    } catch (err) {
      alert("Delete failed");
    }
  }

  // Slugify for consistency with gallery filters
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="container page-pad page-shell">
      <div className="row-between">
        <h1 className="page-title">Gallery Manager</h1>
        <Link href="/admin/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '2rem', alignItems: 'start' }}>
        {/* UPLOAD / MODIFY FORM */}
        <section className="glass-card admin-card">
          <h2>{editingItem ? "Modify Photo Details" : "Upload Gallery Image"}</h2>
          <form className="form" action={handleGallerySubmit} key={editingItem?._id || "new"}>
            <input
              name="title"
              placeholder="Title"
              defaultValue={editingItem?.title || ""}
              required
            />
            <select name="category" defaultValue={editingItem?.category || ""} required>
              <option value="">Select Service Category</option>
              {services.map(s => (
                <option key={s._id} value={slugify(s.title)}>
                  {s.title}
                </option>
              ))}
            </select>
            <input
              name="description"
              placeholder="Description"
              defaultValue={editingItem?.description || ""}
            />

            <div style={{ margin: '5px 0' }}>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                {editingItem ? "Replace image (optional):" : "Select Image:"}
              </label>
              <input type="file" name="image" required={!editingItem} />
            </div>

            <div className="cta-row admin-row">
              <button className="btn btn-primary" disabled={galleryLoading}>
                {galleryLoading ? "Processing..." : (editingItem ? "Update Details" : "Upload")}
              </button>
              {editingItem && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {editingItem && (
             <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem' }}>Current Image Preview:</p>
                <div style={{ position: 'relative', height: '100px', width: '100px', margin: '8px auto', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image src={editingItem.imageUrl} alt="preview" fill style={{ objectFit: 'cover' }} />
                </div>
             </div>
          )}
        </section>

        {/* IMAGE GRID */}
        <section>
          <h2>All Photos</h2>
          {loading && <p>Loading images...</p>}
          {error && <p className="form-error">{error}</p>}
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {gallery.map((item) => (
              <div key={item._id} className="glass-card" style={{ padding: '8px' }}>
                <div style={{ position: 'relative', height: '160px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                   <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{item.title}</h4>
                  <p className="eyebrow" style={{ fontSize: '0.65rem', marginBottom: '8px' }}>{item.category}</p>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingItem(item)}
                      style={{ flex: 1, fontSize: '0.75rem', minHeight: '30px', padding: '4px' }}
                    >
                      Modify
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteImage(item._id!)}
                      style={{ flex: 1, fontSize: '0.75rem', minHeight: '30px', padding: '4px' }}
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
