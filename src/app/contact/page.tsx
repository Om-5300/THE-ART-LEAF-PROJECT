"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

 async function handleSubmit(formData: FormData) {
  setStatus("Sending...");

  try {
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""), // 🔥 REQUIRED
      message: String(formData.get("message") || ""),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("API ERROR:", err);
      throw new Error("Failed");
    }

    setStatus("Message sent successfully ✅");

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    setStatus("Failed to send message ❌");
  }
} 

  return (
    <div className="container page-pad page-shell">
      <h1 className="page-title">Contact Us</h1>

      <div className="grid-2">
        {/* FORM */}
        <form className="glass-card form" action={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          {/* Optional phone (not sent to backend) */}
          <input
            name="phone"
            placeholder="Phone (optional)"
          />

          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            required
          />

          <button className="btn btn-primary" type="submit">
            Submit
          </button>

          {status && <p>{status}</p>}
        </form>

        {/* CONTACT INFO */}
        <div className="glass-card form-meta contact-meta">
          <a
            className="btn btn-secondary"
            href="https://wa.me/918866735300"
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>

          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3362.266956664423!2d70.8226022749042!3d22.788470979338594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39598de6ae94de5d%3A0x414f7f0cc1233c03!2sLOTUS%20158!5e1!3m2!1sen!2sin!4v1776842978254!5m2!1sen!2sin"
            loading="lazy"
            style={{ width: "100%", height: "300px", border: 0, borderRadius: "12px" }}
          />
        </div>
      </div>
    </div>
  );
} 