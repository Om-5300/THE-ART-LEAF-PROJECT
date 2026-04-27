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
  description: "Experience premium handmade artistry with The Art Leaf. Custom fabric painting, wedding accessories, designer rumals, and bespoke home decor by Drashti Bavarva.",
  keywords: ["Handmade Art", "Custom Fabric Painting", "Wedding Rumals", "Luxury Art Studio", "Handmade Jewellery", "Pooja Thali", "Kutchhi Bharat", "Drashti Bavarva", "The Art Leaf"],
  authors: [{ name: "Drashti Bavarva" }],
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
    title: "The Art Leaf | Luxury Handmade Art",
    description: "Premium handcrafted art and custom designs for weddings, home decor, and personal style.",
    url: "https://theartleaf.in",
    siteName: "The Art Leaf",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "The Art Leaf Logo",
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
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

