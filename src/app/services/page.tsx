import type { Metadata } from "next";
import ServicesClient from "@/components/ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our range of luxury handcrafted services including fabric painting, wedding accessories, bespoke jewellery, and traditional canvas painting.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
