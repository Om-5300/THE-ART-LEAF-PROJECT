"use client";

import { motion } from "framer-motion";
import { ServiceItem } from "@/types";

export default function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <motion.article
      className="glass-card service-card"
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <span className="service-icon">{service.icon}</span>
      <h3>{service.title}</h3>
      <p className="muted">{service.shortDescription}</p>
      <p>{service.description}</p>
    </motion.article>
  );
}
