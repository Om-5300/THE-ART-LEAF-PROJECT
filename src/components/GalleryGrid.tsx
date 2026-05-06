"use client";

import Link from "next/link";
import { GalleryItem, ServiceItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function GalleryGrid({
  items,
  services,
}: {
  items: GalleryItem[];
  services: ServiceItem[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  // Slugify helper
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  // Normalize gallery item categories
  const normalized = items.map((item) => ({
    ...item,
    category: item.category.toLowerCase(),
  }));

  // Categories
  const categories = useMemo(() => {
    const serviceSlugs = services.map((s) => slugify(s.title));

    const itemCategories = Array.from(
      new Set(items.map((item) => item.category.toLowerCase()))
    );

    const combined = Array.from(
      new Set([...serviceSlugs, ...itemCategories])
    );

    return ["all", ...combined.filter((c) => c !== "all").sort()];
  }, [services, items]);

  // Filtered items
  const filtered =
    category.toLowerCase() === "all"
      ? normalized
      : normalized.filter(
          (i) => i.category === category.toLowerCase()
        );

  // Category label
  const getLabel = (c: string) => {
    if (c.toLowerCase() === "all") return "All";

    const matchingService = services.find(
      (s) => slugify(s.title) === c.toLowerCase()
    );

    if (matchingService) return matchingService.title;

    return c
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // Toggle mobile filters
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFilters((prev) => !prev);
  };

  // Change category
  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setShowFilters(false);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="gallery-filter-bar" ref={filterRef}>
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

      {/* Gallery Grid */}
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
                alt={`${item.title} - Luxury Handmade Art by The Art Leaf`}
                width={480}
                height={380}
              />

              <span className="gallery-title">
                {item.title}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
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
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
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
                <div className="lightbox-content-inner">
                  <div className="lightbox-text">
                    <h3>{active.title}</h3>
                    <p>{active.description}</p>
                  </div>

                  <div className="lightbox-actions">
                    <a
                      href={`https://wa.me/918866735300?text=${encodeURIComponent(
                        `Hi Drashti, I am interested in this product from your gallery: ${active.title}. Image: ${active.imageUrl}`
                      )}`}
                      target="_blank"
                      className="btn btn-primary gallery-enquiry-btn"
                    >
                      Enquire on WhatsApp
                    </a>

                    <Link
                      href={`/contact?subject=${encodeURIComponent(
                        `Inquiry about ${active.title}`
                      )}`}
                      className="btn btn-secondary gallery-enquiry-btn"
                    >
                      Fill Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}