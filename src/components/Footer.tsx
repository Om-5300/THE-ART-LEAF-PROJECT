import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        {/* BRAND SECTION */}
        <div className="footer-brand">
          <div className="brand-row">
            <img
              src="/theartleaflogo.png"
              alt="The Art Leaf Logo"
              className="footer-logo"
            />

            <div>
              <h2>The Art Leaf</h2>
              <p>Elevating Spaces Through Artistry</p>
              <span className="founder">Drashti Bavarva</span>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className="footer-links">
          <h4>Services</h4>
          <ul>
            <li><Link href="/services">Fabric Painting</Link></li>
            <li><Link href="/services">Wedding Rumals</Link></li>
            <li><Link href="/services">Jewellery Making</Link></li>
            <li><Link href="/services">Pooja Thalis</Link></li>
            <li><Link href="/services">Kutchhi Bharat</Link></li>
          </ul>
        </div>
        {/* CONTACT */}
        <div className="footer-contact">
          <h4>Contact</h4>

          <div className="contact-item">
            <span>📞</span>
            <p>+91 88667 35300</p>
          </div>

          <div className="contact-item">
            <span>📧</span>
            <p>drashtibavarava21@gmail.com</p>
          </div>

          <div className="contact-item">
            <span>📍</span>
            <p>B3, LOTUS-158, GHUNADA-ROAD, MORBI</p>
          </div>

          <div className="contact-item">
            <span>📍</span>
            <p>
              A - SPEEDWELL HEIGHTS, AMBIKA TOWNSHIP, <br /> RAJKOT
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} The Art Leaf. All rights reserved.</p>
      </div>
    </footer>
  );
}