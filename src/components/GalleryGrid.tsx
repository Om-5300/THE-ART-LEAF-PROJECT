"use client";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";

  const [category, setCategory] = useState(initialCategory);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Update category if URL param changes (e.g. navigating between details)
  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

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

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(items.map(item => item.category.toLowerCase())));
    // Ensure "all" is not in the list as it's added manually, then sort
    return ["all", ...dynamic.filter(c => c !== "all").sort()];
  }, [items]);

  const filtered =
    category.toLowerCase() === "all"
      ? normalized
      : normalized.filter((i) => i.category === category.toLowerCase());

  const getLabel = (c: string) =>
    c.toLowerCase() === "all"
      ? "All"
      : c
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

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
                alt={`${item.title} - Luxury Handmade Art by The Art Leaf`}
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
                <div className="lightbox-content-inner">
                  <div className="lightbox-text">
                    <h3>{active.title}</h3>
                    <p>{active.description}</p>
                  </div>
                  <div className="lightbox-actions">
                    <a
                      href={`https://wa.me/918866735300?text=${encodeURIComponent(`Hi Drashti, I am interested in this product from your gallery: ${active.title}. Image: ${active.imageUrl}`)}`}
                      target="_blank"
                      className="btn btn-primary gallery-enquiry-btn"
                    >
                      Enquire on WhatsApp
                    </a>
                    <Link
                      href={`/contact?subject=${encodeURIComponent(`Inquiry about ${active.title}`)}`}
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