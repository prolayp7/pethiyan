import { headers } from "next/headers";
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
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";
  const isHomepage = pathname === "/";
  const footerData = await getFooterData();

  const seoEnabled      = footerData?.footerSeo?.enabled      ?? true;
  const seoHomepageOnly = footerData?.footerSeo?.homepageOnly ?? false;

  const navColumns = [
    ...(footerData?.menus.navigation.map((menu) => ({
      title: menu.title,
      links: menu.links.map((link) => ({ label: link.label, href: link.href })),
    })) ?? []),
    userLinks,
  ];

  return (
    <footer
      className="bg-[#050810] text-white pb-20 lg:pb-0"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          MARQUEE — SCROLLING OFFER STRIP
      ══════════════════════════════════════════════════════════ */}
      <OfferMarquee
        items={footerData?.highlightTicker.items ?? []}
        shouldRender={!((footerData?.highlightTicker.homepageOnly ?? true) && !isHomepage)}
      />

       {/* ══════════════════════════════════════════════════════════
          FOOTER SEO CONTENT — conditionally rendered per admin settings
      ══════════════════════════════════════════════════════════ */}
      <FooterSeoWrapper
        enabled={seoEnabled}
        homepageOnly={seoHomepageOnly}
        introHtml={footerData?.footerSeo?.introHtml}
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




