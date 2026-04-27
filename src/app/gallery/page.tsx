import type { Metadata } from "next";
import GalleryClient from "@/components/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the exquisite collection of handcrafted art by The Art Leaf. View our latest work in fabric painting, wedding artistry, and luxury home decor.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
