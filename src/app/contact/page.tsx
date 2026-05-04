import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Enquire for Custom Art Commissions",
  description: "Get in touch with The Art Leaf for custom art commissions, personalized wedding accessories, and business inquiries. Connect with Drashti Barasara for premium handcrafted designs.",
};

export default function ContactPage() {
  return <ContactClient />;
}
