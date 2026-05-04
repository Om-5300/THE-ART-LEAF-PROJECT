"use client";

import { GalleryItem } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GalleryManagerPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [galleryLoading, setGalleryLoading] = useState(false);

  const getToken = () => localStorage.getItem("artleaf_admin_token") || "";

  const loadGallery = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/gallery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      setError("Unable to load gallery images.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

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
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("upload_preset", "art_leaf");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/deilfs6vw/image/upload",
        { method: "POST", body: cloudData }
      );

      const cloudResult = await cloudRes.json();
      if (!cloudResult.secure_url) throw new Error("Cloudinary upload failed");

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

      if (!response.ok) throw new Error("Save failed");
      await loadGallery();
    } catch (err) {
      setError("Upload failed. Try again.");
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
      }
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="container page-pad page-shell">
      <div className="row-between">
        <h1 className="page-title">Gallery Manager</h1>
        <Link href="/admin/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '2rem', alignItems: 'start' }}>
        {/* UPLOAD FORM */}
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
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</h4>
                  <button
                    className="btn btn-secondary"
                    onClick={() => deleteImage(item._id!)}
                    style={{ width: '100%', fontSize: '0.75rem', minHeight: '30px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
