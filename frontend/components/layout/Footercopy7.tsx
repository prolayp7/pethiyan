import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import OfferMarquee from "./OfferMarquee";
import FooterNavigationGrid from "./FooterNavigationGrid";
import FooterBottomLegalBar from "./FooterBottomLegalBar";
import FooterSeoContent from "./FooterSeoContent";

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
  {
    title: "Users",
    links: [
      { label: "Login / Register", href: "/login" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Orders", href: "/orders" },
      { label: "My Account", href: "/account" },
      { label: "Payments", href: "/account/payments" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
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
          SECTION 4 — BOTTOM LEGAL BAR
          Row 1: Compliance badges · Registration text · Legal links
          Row 2: Payment method chips — centred
          Row 3: Social icons — centred
      ══════════════════════════════════════════════════════════ */}
      <FooterSeoContent />

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — NAVIGATION GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <FooterNavigationGrid navColumns={navColumns} socialLinks={socialLinks} />

     

      <FooterBottomLegalBar legalLinks={legalLinks} socialLinks={socialLinks} />

    </footer>
  );
}






