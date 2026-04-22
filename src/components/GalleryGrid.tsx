"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const normalized = useMemo(
    () => items.map((item) => ({ ...item, category: item.category.toLowerCase() })),
    [items]
  );
  const categories = useMemo(() => ["All", "fabric", "wedding", "jewellery", "saree-resa", "kutchhi-bharat"], []);
  const filtered = category === "All" ? normalized : normalized.filter((i) => i.category === category);

  return (
    <>
      <div className="filter-row">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={c === category ? "active" : ""}>
            {c === "All" ? c : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <motion.div layout className="gallery-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.button
              layout
              key={item._id || item.title}
              className="gallery-item"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -6 }}
            >
              <Image src={item.imageUrl} alt={item.title} width={480} height={380} />
              <span>{item.title}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="lightbox"
            onClick={() => setActive(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lightbox-inner glass-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <Image src={active.imageUrl} alt={active.title} width={900} height={700} />
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
