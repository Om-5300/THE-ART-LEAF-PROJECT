import type { Metadata } from "next";
import ServicesClient from "@/components/ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our range of luxury handcrafted services including fabric painting, wedding rumals, bespoke jewellery, and traditional Kutchhi Bharat.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
