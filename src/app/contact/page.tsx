import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Art Leaf for custom art commissions, wedding accessories, and business inquiries. Connect with Drashti Barasara today.",
};

export default function ContactPage() {
  return <ContactClient />;
}
