import type { Metadata } from "next";
import GalleryClient from "@/components/GalleryClient";

export const metadata: Metadata = {
  title: "Art Gallery | Explore Handcrafted Masterpieces",
  description: "Browse the exquisite collection of handcrafted art by The Art Leaf. Featuring premium fabric painting, wedding rumals, designer accessories, and bespoke home decor from Morbi and Rajkot.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
