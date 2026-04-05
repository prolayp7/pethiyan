import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import OfferMarquee from "./OfferMarquee";
import FooterNavigationGrid from "./FooterNavigationGrid";
import FooterBottomLegalBar from "./FooterBottomLegalBar";

/* ─── Static data ────────────────────────────────────────────── */

const navColumns = [
  {
    title: "Products",
    links: [
      { label: "Standup Pouches", href: "/categories/standup-pouches" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
      { label: "Custom Packaging", href: "/categories/custom-packaging" },
      { label: "Eco Packaging", href: "/categories/eco-packaging" },
      { label: "Bulk Orders", href: "/bulk" },
      { label: "Wholesale", href: "/wholesale" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Our Process", href: "/process" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
      { label: "FAQs", href: "/faq" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
];

const paymentMethods = [
  "Visa",
  "Mastercard",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Amex",
  "Shop Pay",
  "UPI",
  "Net Banking",
  "Razorpay",
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer
      className="bg-[#050810] text-white overflow-hidden"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          MARQUEE — SCROLLING OFFER STRIP
      ══════════════════════════════════════════════════════════ */}
      <OfferMarquee />

      {/* ══════════════════════════════════════════════════════════
          SOCIALS — Horizontally scrolling image feed
      ══════════════════════════════════════════════════════════ */}

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — NAVIGATION GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <FooterNavigationGrid navColumns={navColumns} />

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — BOTTOM LEGAL BAR
          Row 1: Compliance badges · Registration text · Legal links
          Row 2: Payment method chips — centred
          Row 3: Social icons — centred
      ══════════════════════════════════════════════════════════ */}
      <FooterBottomLegalBar legalLinks={legalLinks} paymentMethods={paymentMethods} socialLinks={socialLinks} />

    </footer>
  );
}







