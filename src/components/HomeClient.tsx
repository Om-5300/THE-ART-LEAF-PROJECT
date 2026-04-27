"use client";

import MotionReveal from "@/components/MotionReveal";
import ServiceCard from "@/components/ServiceCard";
import { ServiceItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const customerReviews = [
  {
    quote:
      "Every detail on my wedding rumal was crafted with such precision and elegance. It truly reflected our emotions and added a very personal touch to our special day.",
    name: "Nidhi Dava",
    service: "Wedding Artistry",
    rating: 5,
  },
  {
    quote:
      "Their fabric painting completely transformed my simple saree into a luxurious masterpiece. The colors, design, and finishing were beyond my expectations.",
    name: "Nisha Kavar",
    service: "Fabric Painting",
    rating: 5,
  },
  {
    quote:
      "From start to finish, the experience was professional and smooth. Their creativity and attention to detail made the final product look premium and unique.",
    name: "Pooja Barasara",
    service: "Custom Decor",
    rating: 5,
  },
  {
    quote:
      "The handmade jewellery I received was beautifully designed and had a very fine finish. It perfectly matched my outfit and received so many compliments.",
    name: "Riya Patel",
    service: "Jewellery Design",
    rating: 5,
  },
  {
    quote:
      "The customized pooja thali was absolutely stunning and thoughtfully designed. It added a special charm and spiritual vibe to our family function.",
    name: "Kajal Shah",
    service: "Pooja Thali",
    rating: 5,
  },
  {
    quote:
      "The embroidery work was extremely neat and detailed. You can clearly see the dedication and effort that goes into each handmade piece.",
    name: "Meera Joshi",
    service: "Embroidery",
    rating: 5,
  },
  {
    quote:
      "Their creativity is unmatched. They understood my requirements perfectly and delivered something even better than what I had imagined.",
    name: "Aarav Shah",
    service: "Custom Orders",
    rating: 5,
  },
  {
    quote:
      "My old saree was redesigned into something so beautiful and modern. It felt like wearing a completely new outfit with emotional value attached.",
    name: "Krupa Patel",
    service: "Saree Redesign",
    rating: 5,
  },
  {
    quote:
      "The handmade gifts were unique and thoughtfully designed. Perfect for special occasions when you want to give something meaningful and different.",
    name: "Dhruvi Mehta",
    service: "Handmade Gifts",
    rating: 5,
  },
  {
    quote:
      "Highly recommended for anyone looking for premium handmade art. Their work speaks for itself and truly stands out in quality and creativity.",
    name: "Yashvi Trivedi",
    service: "Home Decor",
    rating: 5,
  },
];

export default function HomeClient() {
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const reviewDirection = useRef(1);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const interval = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % customerReviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [hasMounted]);

  const handleSwipe = (diff: number) => {
    if (diff > 50) {
      // Swipe left -> Next
      setReviewIndex((prev) => (prev + 1) % customerReviews.length);
    } else if (diff < -50) {
      // Swipe right -> Previous
      setReviewIndex((prev) =>
        prev === 0 ? customerReviews.length - 1 : prev - 1,
      );
    }
  };

  useEffect(() => {
    if (!hasMounted) return;
    let mounted = true;

    async function loadFeaturedServices() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
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
  }, [hasMounted]);

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
            The Art Leaf creates soulful handmade pieces from custom fabrics to
            wedding artistry and signature decor.
          </p>
          <div className="cta-row">
            <Link href="/about" className="btn btn-primary">
              Know More About Us
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
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
          <div className="section-header">
            <h2>Featured Services</h2>
            <Link href="/services" className="btn btn-secondary service-btn">
              View All
            </Link>
          </div>
          {servicesLoading ? <p>Loading featured services...</p> : null}
          {!servicesLoading && featuredServices.length === 0 ? (
            <p>Featured services will appear here soon.</p>
          ) : null}
          {!servicesLoading && featuredServices.length > 0 ? (
            <div className="grid-3">
              {featuredServices.map((service) => (
                <ServiceCard
                  key={service._id || service.title}
                  service={service}
                />
              ))}
            </div>
          ) : null}
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="glass-card">
          <h2>Gallery Preview</h2>
          <p>
            Explore vibrant custom work in fabric painting, wedding decor, and
            artisan accessories.
          </p>
          <Link href="/gallery" className="btn btn-primary gallery">
            View Full Gallery
          </Link>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section>
          <div className="testimonials-wrapper">
            <div className="testimonials-left">
              <p className="eyebrow">TESTIMONIALS</p>
              <h2>What They Say About Us?</h2>
              <p>
                Here's what our clients are saying after availing our services.
              </p>
            </div>

            <div
              className="testimonials-right"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                touchEndX.current = e.changedTouches[0].clientX;
                handleSwipe(touchStartX.current - touchEndX.current);
              }}
            >
              {/* DESKTOP CARD */}
              {customerReviews.length > 0 && (
                <>
                  <motion.article
                    className="review-card-featured"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    key={customerReviews[reviewIndex]?.name}
                  >
                    <p className="review-quotemark">"</p>
                    <p className="review-quote-text">
                      {customerReviews[reviewIndex]?.quote}
                    </p>

                    <div className="review-meta-featured">
                      <div className="review-user">
                        <h4>{customerReviews[reviewIndex]?.name}</h4>
                        <p>{customerReviews[reviewIndex]?.service}</p>
                      </div>
                    </div>
                  </motion.article>

                  <div className="review-dots review-dots-desktop">
                    {customerReviews.map((_, index) => (
                      <button
                        key={index}
                        className={index === reviewIndex ? "active" : ""}
                        onClick={() => setReviewIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* MOBILE SLIDER */}
              <div className="review-slider-mobile">
                <div
                  className="review-slider-track"
                  style={{
                    transform: `translateX(-${reviewIndex * 100}%)`,
                    transition: "transform 0.4s ease-in-out",
                  }}
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    touchEndX.current = e.changedTouches[0].clientX;
                    handleSwipe(touchStartX.current - touchEndX.current);
                  }}
                >
                  {customerReviews.map((review) => (
                    <div key={review.name} className="review-slide">
                      <motion.article
                        className="glass-card review-card"
                        whileHover={{ y: -6 }}
                      >
                        <p className="review-stars">{"★".repeat(review.rating)}</p>
                        <p className="review-quote-text">"{review.quote}"</p>

                        <div className="review-meta">
                          <strong>{review.name}</strong>
                          <span>{review.service}</span>
                        </div>
                      </motion.article>
                    </div>
                  ))}
                </div>

                <div className="review-dots review-dots-mobile">
                  {customerReviews.map((_, index) => (
                    <button
                      key={index}
                      className={index === reviewIndex ? "active" : ""}
                      onClick={() => setReviewIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="glass-card">
          <h2>Instagram Preview</h2>
          <p>
            Follow our latest handcrafted stories and behind-the-scenes
            artistry.
          </p>
          <a
            href="https://www.instagram.com/the_art_leaf_?igsh=bmJuMm1tc3BodmE0"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary instagram"
          >
            Open Instagram
          </a>
        </section>
      </MotionReveal>
    </div>
  );
}
