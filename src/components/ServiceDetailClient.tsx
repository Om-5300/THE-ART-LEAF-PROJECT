"use client";

import { ServiceItem } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceDetailClient({ service }: { service: ServiceItem }) {
  return (
    <div className="container page-pad">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/services" className="back-link">
          ← Back to Services
        </Link>

        <div className="service-details-grid glass-card">
          <div className="service-details-header">
            <span className="service-details-icon">{service.icon}</span>
            <div className="service-details-title-wrap">
              <p className="eyebrow">{service.category}</p>
              <h1 className="page-title">{service.title}</h1>
            </div>
          </div>

          <div className="service-details-content">
            <h3>{service.shortDescription}</h3>
            <div className="service-full-description">
              <p>{service.description}</p>
            </div>

            <div className="service-actions">
              <Link href="/contact" className="btn btn-primary">
                Enquire Now
              </Link>
              <Link href="/gallery" className="btn btn-secondary">
                View Related Gallery
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
