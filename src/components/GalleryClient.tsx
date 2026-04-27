"use client";

import { useEffect, useState } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { GalleryItem } from "@/types";

export default function GalleryClient() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    let mounted = true;

    async function loadGallery() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Unable to load gallery right now.");
        }
        const data = (await res.json()) as GalleryItem[];
        if (mounted) setGallery(data);
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadGallery();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Gallery</h1>
      {loading ? <p>Loading gallery...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && gallery.length === 0 ? <p>No gallery images uploaded yet.</p> : null}
      {!loading && !error ? <GalleryGrid items={gallery} /> : null}
    </div>
  );
}
