import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import OfferMarquee from "./OfferMarquee";
import FooterNavigationGrid from "./FooterNavigationGrid";
import FooterBottomLegalBar from "./FooterBottomLegalBar";
import FooterSeoWrapper from "./FooterSeoWrapper";

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
      { label: "Enquiry Form", href: "/enquiry-form" },
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


/* ─── Component ──────────────────────────────────────────────── */

interface FooterProps {
  footerSeoEnabled?: boolean;
  footerSeoHomepageOnly?: boolean;
}

export default function Footer({ footerSeoEnabled = true, footerSeoHomepageOnly = false }: FooterProps) {
  return (
    <footer
      className="bg-[#050810] text-white overflow-x-hidden pb-20 lg:pb-0"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          MARQUEE — SCROLLING OFFER STRIP
      ══════════════════════════════════════════════════════════ */}
      <OfferMarquee />

       {/* ══════════════════════════════════════════════════════════
          FOOTER SEO CONTENT — conditionally rendered per admin settings
      ══════════════════════════════════════════════════════════ */}
      <FooterSeoWrapper enabled={footerSeoEnabled} homepageOnly={footerSeoHomepageOnly} />

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — NAVIGATION GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <FooterNavigationGrid navColumns={navColumns} socialLinks={socialLinks} />

     

      <FooterBottomLegalBar />

    </footer>
  );
}






