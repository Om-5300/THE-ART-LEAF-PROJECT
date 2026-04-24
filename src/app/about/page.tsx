import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="container page-pad page-shell about-page">
      <section className="glass-card about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Luxury Craftsmanship</p>
          <h1 className="page-title">About The Art Leaf</h1>
          <p className="about-subtitle">
            Handmade elegance rooted in tradition, designed for modern celebrations and timeless keepsakes.
          </p>
        </div>
        <div className="about-hero-media">
          <div className="about-hero-image-wrap">
            <Image
              src="/theartleaflogo.png"
              alt="The Art Leaf brand mark"
              width={420}
              height={420}
              className="about-hero-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="glass-card about-story">
        <p className="eyebrow">Legacy In Every Detail</p>
        <h2>Our Story</h2>
        <div className="about-story-grid">
          <p>
            The Art Leaf began with a simple idea: every handcrafted piece should carry emotion, heritage, and
            unmistakable beauty. What started as a passion for artisanal design has grown into a boutique brand known
            for thoughtful, custom creations.
          </p>
          <p>
            We blend traditional techniques with refined modern styling to create pieces that feel both personal and
            luxurious. From bridal accents to decor statements, each design is developed with care, precision, and a
            deep respect for craftsmanship.
          </p>
          <p>
            Our process is intentionally detail-driven. Materials are selected for quality, finishes are perfected by
            hand, and every final piece is made to leave a lasting impression for your most meaningful moments.
          </p>
        </div>
      </section>

      <section className="glass-card about-founder">
        <p className="eyebrow">Meet The Founder</p>
        <div className="about-founder-grid">
          <div className="about-founder-avatar">
            <Image
              src="/founder-photo.png"
              alt="Drashti Bavarva, Founder of The Art Leaf"
              width={340}
              height={340}
              className="founder-photo"
            />
          </div>
          <div className="about-founder-content">
            <h2>Founder</h2>
            <p className="about-founder-name">Drashti Bavarva</p>
            <p>
              Drashti leads The Art Leaf with a vision to preserve traditional artistry while elevating it through
              premium, contemporary expression. Her design philosophy centers on meaningful storytelling, handcrafted
              excellence, and timeless visual elegance.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <p className="eyebrow">Why Choose Us</p>
        <div className="grid-2 about-value-grid">
          <article className="glass-card about-value-card">
            <h3>Handmade Quality</h3>
            <p>Every piece is handcrafted with close attention to balance, texture, and finishing details.</p>
          </article>
          <article className="glass-card about-value-card">
            <h3>Custom Designs</h3>
            <p>Your style and story guide each creation, making every design uniquely personal and memorable.</p>
          </article>
          <article className="glass-card about-value-card">
            <h3>Traditional Art</h3>
            <p>We honor classic craft heritage and reinterpret it beautifully for today&apos;s premium aesthetic.</p>
          </article>
          <article className="glass-card about-value-card">
            <h3>Premium Finish</h3>
            <p>From material selection to final polish, we maintain a luxury-level standard in every detail.</p>
          </article>
        </div>
      </section>

      <section className="glass-card about-cta">
        <h2>Let&apos;s create something beautiful together</h2>
        <p>Share your vision with us and we will craft a design that feels personal, refined, and unforgettable.</p>
        <Link href="/contact" className="btn btn-primary">
          Contact Us
        </Link>
      </section>
    </main>
  );
}

