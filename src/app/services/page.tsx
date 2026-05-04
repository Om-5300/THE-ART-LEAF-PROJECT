import type { Metadata } from "next";
import ServicesClient from "@/components/ServicesClient";

export const metadata: Metadata = {
  title: "Premium Services | Custom Fabric Painting & Wedding Accessories",
  description: "Explore our range of luxury handcrafted services including bespoke fabric painting, designer wedding accessories, bridal rumals, and traditional Indian craftsmanship in Morbi & Rajkot.",
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Custom Fabric Painting",
        "description": "Premium hand-painted textiles for sarees, kurtis, and designer wear, featuring gold accents and bespoke motifs."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Wedding Accessories",
        "description": "Bespoke ceremonial essentials including intricate Antarpats and signature bridal rumals for a royal wedding experience."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Handmade Jewellery",
        "description": "Signature handcrafted statement pieces blending traditional artisan techniques with contemporary luxury design."
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Canvas Painting",
        "description": "Bespoke fine art commissions, from soulful portraits to modern abstracts, designed to transform your living spaces."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesClient />
    </>
  );
}
