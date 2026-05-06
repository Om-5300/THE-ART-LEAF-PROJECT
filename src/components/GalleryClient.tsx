"use client";

import { Suspense, useEffect, useState } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { GalleryItem, ServiceItem } from "@/types";

export default function GalleryClient() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    let mounted = true;

    async function loadData() {
      try {
        const [gRes, sRes] = await Promise.all([
          fetch("/api/gallery", { cache: "no-store" }),
          fetch("/api/services", { cache: "no-store" })
        ]);

        if (!gRes.ok || !sRes.ok) {
          throw new Error("Unable to load data right now.");
        }

        const [gData, sData] = await Promise.all([
          gRes.json(),
          sRes.json()
        ]);

        if (mounted) {
          setGallery(gData);
          setServices(sData);
        }
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadData();
    return () => {
      mounted = false;
    };
  }, [hasMounted]);

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Gallery</h1>
      {loading ? <p>Loading gallery...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && gallery.length === 0 ? <p>No gallery images uploaded yet.</p> : null}
      {!loading && !error ? (
        <Suspense fallback={<p>Loading grid...</p>}>
          <GalleryGrid items={gallery} services={services} />
        </Suspense>
      ) : null}
    </div>
  );
}
