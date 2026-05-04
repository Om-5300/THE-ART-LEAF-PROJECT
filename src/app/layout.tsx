import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: "The Art Leaf | Luxury Handmade Art & Custom Craftsmanship",
    template: "%s | The Art Leaf",
  },
  description: "Discover the world of The Art Leaf – where luxury meets tradition. We create exquisite handcrafted art, from bespoke fabric painting and royal wedding accessories to signature jewellery and fine canvas art by Drashti Barasara. Elevate your lifestyle with timeless craftsmanship based in Morbi & Rajkot.",
  keywords: [
    "The Art Leaf",
    "Handmade Art India",
    "Custom Fabric Painting",
    "Wedding Accessories Rajkot",
    "Luxury Art Studio Morbi",
    "Handmade Jewellery",
    "Pooja Thali Decoration",
    "Canvas Painting",
    "Drashti Barasara",
    "Bespoke Bridal Rumals",
    "Traditional Gujarati Art",
    "Hand-painted Sarees",
    "Artistic Home Decor"
  ],
  authors: [{ name: "Drashti Barasara" }],
  creator: "The Art Leaf",
  publisher: "The Art Leaf",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://theartleaf.in"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Art Leaf | Luxury Handmade Art & Custom Designs",
    description: "Premium handcrafted art and custom designs for weddings, home decor, and personal style by Drashti Barasara.",
    url: "https://theartleaf.in",
    siteName: "The Art Leaf",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The Art Leaf - Luxury Handmade Art Studio",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Art Leaf | Luxury Handmade Art",
    description: "Premium handcrafted art and custom designs for weddings, home decor, and personal style.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "The Art Leaf",
    "image": "https://theartleaf.in/logo.png",
    "@id": "https://theartleaf.in",
    "url": "https://theartleaf.in",
    "telephone": "+91-8866735300",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "B3, LOTUS-158, GHUNADA-ROAD",
      "addressLocality": "Morbi",
      "addressRegion": "Gujarat",
      "postalCode": "363641",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.8191,
      "longitude": 70.8212
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/the_art_leaf_"
    ]
  };

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

