import { Metadata } from "next";
import ServiceDetailClient from "@/components/ServiceDetailClient";
import { ServiceItem } from "@/types";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models/Service";
import mongoose from "mongoose";

async function getService(id: string): Promise<ServiceItem | null> {
  await dbConnect();

  let serviceData;
  if (mongoose.Types.ObjectId.isValid(id)) {
    serviceData = await Service.findById(id);
  } else {
    // Try finding by title if ID is not a valid ObjectId (for fallback services)
    const decodedTitle = decodeURIComponent(id);
    serviceData = await Service.findOne({ title: decodedTitle });
  }

  if (!serviceData) return null;

  // Convert Mongoose document to a plain object
  return {
    _id: serviceData._id.toString(),
    title: serviceData.title,
    icon: serviceData.icon,
    category: serviceData.category || "General",
    shortDescription: serviceData.shortDescription,
    description: serviceData.description,
  } as ServiceItem;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | The Art Leaf`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
