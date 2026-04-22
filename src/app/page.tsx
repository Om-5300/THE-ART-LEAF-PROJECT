"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MotionReveal from "@/components/MotionReveal";
import ServiceCard from "@/components/ServiceCard";
import { ServiceItem } from "@/types";

const customerReviews = [
  {
    quote: "Every detail on my wedding rumal was elegant and meaningful.",
    name: "Priya Mistry",
    service: "Wedding Artistry",
    rating: 5,
  },
  {
    quote: "Their fabric painting transformed my plain saree into luxury art.",
    name: "Nisha Patel",
    service: "Fabric Painting",
    rating: 5,
  },
  {
    quote: "Professional, creative, and truly premium finish from start to end.",
    name: "Aarav Shah",
    service: "Custom Decor",
    rating: 5,
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedServices() {
      setServicesLoading(true);
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load services");
        const data = (await res.json()) as ServiceItem[];
        if (mounted) setFeaturedServices(data.slice(0, 3));
      } catch {
        if (mounted) setFeaturedServices([]);
      } finally {
        if (mounted) setServicesLoading(false);
      }
    }

    void loadFeaturedServices();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container page-pad">
      <motion.section
        className="hero glass-card hero-lux"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="eyebrow">Handcrafted Luxury Art Studio</p>
          <h1>Elevating Spaces Through Artistry</h1>
          <p>
            The Art Leaf creates soulful handmade pieces from custom fabrics to wedding artistry and signature decor.
          </p>
          <div className="cta-row">
            <Link href="/services" className="btn btn-primary">Explore Services</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ rotate: -2, scale: 1.02 }}
        >
          <div className="hero-artmark">

            <Image
              src="/theartleaflogo.png"
              alt="The Art Leaf logo"
              width={360}
              height={360}
              className="hero-mark-image"
              priority
            />

            <motion.p
              className="hero-signature"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Drashti Bavarva
            </motion.p>

          </div>
        </motion.div>
      </motion.section>

      <MotionReveal>
        <section>
          <h2>Featured Services</h2>
          {servicesLoading ? <p>Loading featured services...</p> : null}
          {!servicesLoading && featuredServices.length === 0 ? <p>Featured services will appear here soon.</p> : null}
          {!servicesLoading && featuredServices.length > 0 ? (
            <div className="grid-3">
              {featuredServices.map((service) => <ServiceCard key={service._id || service.title} service={service} />)}
            </div>
          ) : null}
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="glass-card">
          <h2>Gallery Preview</h2>
          <p>Explore vibrant custom work in fabric painting, wedding decor, and artisan accessories.</p>
          <Link href="/gallery" className="btn btn-primary">View Full Gallery</Link>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section>
          <h2>Customer Reviews</h2>
          <p>Words from clients who trusted The Art Leaf for meaningful handcrafted creations.</p>
          <div className="grid-3 review-grid">
            {customerReviews.map((review) => (
              <motion.article key={review.name} className="glass-card review-card" whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}
                </p>
                <p>“{review.quote}”</p>
                <div className="review-meta">
                  <strong>{review.name}</strong>
                  <span>{review.service}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="glass-card">
          <h2>Instagram Preview</h2>
          <p>Follow our latest handcrafted stories and behind-the-scenes artistry.</p>
          <a href="https://www.instagram.com/the_art_leaf_?igsh=bmJuMm1tc3BodmE0" target="_blank" rel="noreferrer" className="btn btn-secondary">Open Instagram</a>
        </section>
      </MotionReveal>
    </div>
  );
}

