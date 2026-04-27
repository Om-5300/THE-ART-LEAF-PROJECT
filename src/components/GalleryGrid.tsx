"use client";

import { GalleryItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // ✅ Outside click fix (no mousedown bug)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }

    if (showFilters) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilters]);

  const normalized = useMemo(
    () => items.map((item) => ({
      ...item,
      category: item.category.toLowerCase(),
    })),
    [items]
  );

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  const categories = useMemo(
    () => ["All", "fabric", "wedding", "jewellery", "saree-resa", "kutchhi-bharat"],
    []
  );

  const filtered =
    category === "All"
      ? normalized
      : normalized.filter((i) => i.category === category);

  const getLabel = (c: string) =>
    c === "All" ? c : c.charAt(0).toUpperCase() + c.slice(1);

  // ✅ Safe toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFilters((prev) => !prev);
  };

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setShowFilters(false);
  };

  return (
    <>
      <div className="gallery-filter-bar" ref={filterRef}>
        {/* 🔥 Mobile button */}
        <button
          type="button"
          className="filter-menu-button"
          onClick={handleToggle}
        >
          Filter: {getLabel(category)}
          <span className="filter-icon">
            {showFilters ? "▲" : "▼"}
          </span>
        </button>

        {/* 🔥 Filter options */}
        <div className={`filter-row ${showFilters ? "open" : ""}`}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCategoryChange(c)}
              className={c === category ? "active" : ""}
            >
              {getLabel(c)}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className={`gallery-grid ${showFilters ? "blurred" : ""}`}
      >
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
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={480}
                height={380}
              />
              <span>{item.title}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 🔥 Lightbox */}
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
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setActive(null)}
              >
                ×
              </button>

              <div className="lightbox-image-wrap">
                <Image
                  src={active.imageUrl}
                  alt={active.title}
                  width={1200}
                  height={900}
                />
              </div>

              <div className="lightbox-details">
                <h3>{active.title}</h3>
                <p>{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}