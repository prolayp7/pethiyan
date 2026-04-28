import { getFooterData } from "@/lib/api";
import OfferMarquee from "./OfferMarquee";
import FooterNavigationGrid from "./FooterNavigationGrid";
import FooterBottomLegalBar from "./FooterBottomLegalBar";
import FooterSeoWrapper from "./FooterSeoWrapper";

/* ─── Static data ────────────────────────────────────────────── */

const userLinks = {
  title: "Users",
  links: [
    { label: "Login / Register", href: "/login" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Orders", href: "/account/orders" },
    { label: "My Account", href: "/account" },
  ],
};


/* ─── Component ──────────────────────────────────────────────── */

export default async function Footer() {
  const footerData = await getFooterData();

  const navColumns = [
    ...(footerData?.menus.navigation.map((menu) => ({
      title: menu.title,
      links: menu.links.map((link) => ({ label: link.label, href: link.href })),
    })) ?? []),
    userLinks,
  ];

  return (
    <footer
      className="bg-[#050810] text-white overflow-x-hidden pb-20 lg:pb-0"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          MARQUEE — SCROLLING OFFER STRIP
      ══════════════════════════════════════════════════════════ */}
      <OfferMarquee
        homepageOnly={footerData?.highlightTicker.homepageOnly ?? true}
        items={footerData?.highlightTicker.items ?? []}
      />

       {/* ══════════════════════════════════════════════════════════
          FOOTER SEO CONTENT — conditionally rendered per admin settings
      ══════════════════════════════════════════════════════════ */}
      <FooterSeoWrapper
        enabled={footerData?.footerSeo.enabled ?? true}
        homepageOnly={footerData?.footerSeo.homepageOnly ?? false}
        introHtml={footerData?.footerSeo.introHtml}
      />

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — NAVIGATION GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <FooterNavigationGrid
        brand={footerData?.brand}
        navColumns={navColumns}
        socialLinks={
          footerData?.brand.socialLinks?.map((link) => ({
            label: link.label,
            href: link.url,
            platform: link.platform,
          })) ?? []
        }
      />

     

      <FooterBottomLegalBar copyrightText={footerData?.brand.copyrightText} />

    </footer>
  );
}





