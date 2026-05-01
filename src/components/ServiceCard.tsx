"use client";

import { motion } from "framer-motion";
import { ServiceItem } from "@/types";
import Link from "next/link";

export default function ServiceCard({ service }: { service: ServiceItem }) {
  const serviceId = service._id || encodeURIComponent(service.title);

  return (
    <motion.article
      className="glass-card service-card"
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <span className="service-icon">{service.icon}</span>
      <h3>{service.title}</h3>
      <p className="service-desc-preview">{service.shortDescription}</p>
      <div className="card-cta">
        <Link href={`/services/${serviceId}`} className="explore-link">
          Explore Details →
        </Link>
      </div>
    </motion.article>
  );
}
