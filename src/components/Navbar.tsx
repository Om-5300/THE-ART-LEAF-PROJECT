"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className={`navbar-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="navbar container">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src="/theartleaflogo.png" alt="The Art Leaf" width={70} height={70} className="brand-logo" />
          <span className="brand-name">The Art Leaf</span>
        </Link>

        <button className="menu-btn" onClick={() => setOpen((s) => !s)} aria-label="Toggle menu" aria-expanded={open}>
          <span className={`menu-line ${open ? "open" : ""}`} />
          <span className={`menu-line ${open ? "open" : ""}`} />
        </button>

        <div className="nav-links desktop-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="nav-login-btn" onClick={() => setOpen(false)}>
            Login
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="nav-links mobile-links show"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link href={link.href} className={pathname === link.href ? "active" : ""} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.04 }}
            >
              <Link href="/login" className="nav-login-btn mobile-login-btn" onClick={() => setOpen(false)}>
                Login
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

