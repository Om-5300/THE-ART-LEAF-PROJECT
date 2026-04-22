"use client";

import { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { ServiceItem } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Unable to load services right now.");
        }
        const data = (await res.json()) as ServiceItem[];
        if (mounted) setServices(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadServices();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Our Services</h1>
      {loading ? <p>Loading services...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && services.length === 0 ? <p>No services available yet.</p> : null}
      {!loading && !error ? (
        <div className="grid-3">
          {services.map((service) => <ServiceCard key={service._id || service.title} service={service} />)}
        </div>
      ) : null}
    </div>
  );
}

