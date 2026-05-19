import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "The Art Leaf | Luxury Handmade Art & Custom Craftsmanship",
  description: "Experience premium handmade artistry with The Art Leaf. Custom fabric painting, wedding accessories, designer rumals, and bespoke home decor by Drashti Bavarva.",
  openGraph: {
    title: "The Art Leaf | Luxury Handmade Art",
    description: "Premium handcrafted art and custom designs for weddings, home decor, and personal style.",
    images: ["/logo.png"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
