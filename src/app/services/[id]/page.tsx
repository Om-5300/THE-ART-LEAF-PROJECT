import { Metadata } from "next";
import ServiceDetailClient from "@/components/ServiceDetailClient";
import { ServiceItem } from "@/types";
import { notFound } from "next/navigation";

// Since this is a server component in Next.js App Router
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/services/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Service Not Found" };
    const service = (await res.json()) as ServiceItem;

    return {
      title: `${service.title} | The Art Leaf`,
      description: service.shortDescription,
    };
  } catch {
    return { title: "Service Details" };
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let service: ServiceItem | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/services/${id}`, { cache: "no-store" });
    if (res.ok) {
      service = await res.json();
    }
  } catch (error) {
    console.error("Error fetching service:", error);
  }

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
