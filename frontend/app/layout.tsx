import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { preload } from "react-dom";
import { headers } from "next/headers";
import { getAnnouncementBar, getHeaderMenu, getHeroSection, getSystemSettings, getWebSettings } from "@/lib/api";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { GTMScript, GTMNoScript } from "@/components/analytics/GoogleTagManager";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import GoogleAds from "@/components/analytics/GoogleAds";
import CartPushLayout from "@/components/layout/CartPushLayout";
import TopAnnouncementBar from "@/components/headers/TopAnnouncementBar";
import OfferTickerClient from "@/components/headers/OfferTickerClient";
import MainHeader from "@/components/headers/MainHeader1";
import NavigationMenu from "@/components/headers/NavigationMenuServer";
import Footer from "@/components/layout/Footercopy7";
import GlobalClientMounts from "@/components/layout/GlobalClientMounts";
import { organizationSchema, websiteSchema, jsonLd } from "@/lib/structured-data";
import { API_BASE } from "@/lib/api";
import { Toaster } from "react-hot-toast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return null;
  }
})();

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
  weight: ["400", "500", "600", "700", "800"],
  // Minimise CLS from font swap — fallback metrics are tuned to match Inter
  adjustFontFallback: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: "#1f4f8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const FALLBACK_TITLE       = "Pethiyan — The Power of Perfect Packaging";
const FALLBACK_DESCRIPTION = "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands. Shop online with GST invoice, fast shipping across India.";
const FALLBACK_OG_IMAGE    = "/opengraph-image.png";

export async function generateMetadata(): Promise<Metadata> {
  const [webSettings, siteSettings] = await Promise.all([
    getWebSettings(),
    getSystemSettings(),
  ]);
  const faviconVersion = siteSettings?.favicon ? encodeURIComponent(siteSettings.favicon) : "default";
  const faviconUrl = `/api/site-icon?v=${faviconVersion}`;

  const defaultTitle = webSettings?.metaTitle       || FALLBACK_TITLE;
  const description  = webSettings?.metaDescription || FALLBACK_DESCRIPTION;
  const keywords     = webSettings?.metaKeywords    || undefined;
  const author       = webSettings?.metaAuthor      || "Pethiyan";
  const publisher    = webSettings?.metaPublisher   || "Pethiyan";
  const ogTitle      = webSettings?.ogTitle         || defaultTitle;
  const ogDesc       = webSettings?.ogDescription   || description;
  const ogImage      = webSettings?.ogImage         || FALLBACK_OG_IMAGE;
  const twCard       = (webSettings?.twitterCard as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image";
  const twTitle      = webSettings?.twitterTitle    || ogTitle;
  const twDesc       = webSettings?.twitterDescription || ogDesc;
  const twImage      = webSettings?.twitterImage    || ogImage;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: "%s | Pethiyan",
    },
    description,
    ...(keywords ? { keywords } : {}),
    authors: [{ name: author }],
    creator: author,
    publisher,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_URL,
      siteName: "Pethiyan",
      title: ogTitle,
      description: ogDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      images: [twImage],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "en":        "/",
        "x-default": "/",
      },
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    verification: {
      ...(webSettings?.googleSiteVerification
        ? { google: webSettings.googleSiteVerification }
        : {}),
      ...(webSettings?.bingSiteVerification
        ? { other: { "msvalidate.01": webSettings.bingSiteVerification } }
        : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();

  // Check if this is the homepage so we can preload the LCP hero image.
  // getHeroSection uses next: { revalidate: 300 }, so within the same request
  // this call is memoized — the page component's call costs zero extra I/O.
  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-pathname") ?? "/";
  const isHomepage = pathname === "/";

  const [siteSettings, webSettings, headerMenu, announcementBar, heroSection] = await Promise.all([
    getSystemSettings().then(s => s ?? {
      appName: "Pethiyan", logo: null, favicon: null,
      smsOtpEnabled: false, emailOtpEnabled: false,
      showVariantColorsInGrid: false, showGstInGrid: false,
      showCategoryNameInGrid: false, showMinQtyInGrid: false,
      sellerSupportNumber: "",
    }),
    getWebSettings(),
    getHeaderMenu(),
    getAnnouncementBar(),
    // Only fetch hero data on the homepage — this resolves in parallel with
    // the other fetches above and adds no serial latency.
    isHomepage ? getHeroSection() : Promise.resolve(null),
  ]);

  // Inject <link rel="preload"> for the LCP hero image directly into <head>.
  // The layout renders the <head> before any page body is streamed, so the
  // browser discovers the image URL at ~0 ms instead of after body parsing.
  if (isHomepage) {
    const heroFirstImage = heroSection?.slides?.filter((s) => s.image)?.[0]?.image;
    if (heroFirstImage) {
      const enc = encodeURIComponent(heroFirstImage);
      // Use the same widths Next.js <Image fill> uses in its auto-generated
      // srcset so the browser's preload and the actual <img> request hit the
      // same /_next/image cache entry — no double-fetch.
      // 384 is critical: on a 375px mobile viewport (Lighthouse) the browser
      // picks 384w (first breakpoint ≥ 375px). Without it the preload would
      // fetch 640w and the <img> would fetch 384w — two separate requests.
      preload(`/_next/image?url=${enc}&w=384&q=75`, {
        as: "image",
        fetchPriority: "high",
        imageSrcSet: [384, 640, 750, 828, 1080, 1200, 1920]
          .map((w) => `/_next/image?url=${enc}&w=${w}&q=75 ${w}w`)
          .join(", "),
        imageSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 55vw",
      });
    }
  }

  const DEFAULT_TICKER = [
    "🚚 Free Shipping on Orders Above $50",
    "⚡ Fast Global Delivery Available",
    "📦 Premium Packaging for Modern Brands",
    "🎁 Bundle & Save — Buy 3 Get 1 Free",
    "🌿 100% Eco-Friendly Material Options",
  ];
  const topBarText   = announcementBar?.topBar.text ?? "The Power of Perfect Packaging — Trusted by 10,000+ Brands Worldwide";
  const topBarActive = announcementBar?.topBar.active ?? true;
  const tickerActive = announcementBar?.ticker.active ?? true;
  const tickerItems  = announcementBar?.ticker.items?.length ? announcementBar.ticker.items : DEFAULT_TICKER;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {API_ORIGIN ? <link rel="dns-prefetch" href={API_ORIGIN} /> : null}
        {API_ORIGIN ? <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" /> : null}
        <script {...jsonLd(orgSchema)} key="org-schema" />
        <script {...jsonLd(siteSchema)} key="site-schema" />
        {webSettings?.googleAnalyticsId  && <GoogleAnalytics id={webSettings.googleAnalyticsId} />}
        {webSettings?.googleTagManagerId && <GTMScript      id={webSettings.googleTagManagerId} />}
        {webSettings?.googleAdsId && (
          <GoogleAds id={webSettings.googleAdsId} beginCheckoutEvent={webSettings.googleAdsBeginCheckoutLabel} />
        )}
      </head>
      <body className="antialiased bg-background text-foreground font-sans">
        {webSettings?.googleTagManagerId && <GTMNoScript   id={webSettings.googleTagManagerId} />}
        {webSettings?.facebookPixelId    && <FacebookPixel id={webSettings.facebookPixelId} />}
        {/* Portal root — sits above app-root in z-order, outside its stacking context */}
        <div id="portal-root" />

        {/* App root — explicit z:0 stacking context so portal-root always wins */}
        <div id="app-root" style={{ isolation: "isolate", position: "relative", zIndex: 0 }}>
        <SiteSettingsProvider settings={siteSettings}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <CartPushLayout>
                {/* Non-sticky top bars */}
                {topBarActive && <TopAnnouncementBar text={topBarText} />}
                {tickerActive && <OfferTickerClient items={tickerItems} />}

                {/* Sticky header: MainHeader + CategoryNav */}
                <div className="sticky top-0 z-40">
                  <div className="relative z-20">
                    <MainHeader mobileNavItems={headerMenu?.nav_items} />
                  </div>
                  <div className="relative z-10">
                    <NavigationMenu />
                  </div>
                </div>

                {/* Page Content */}
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>

                {/* Footer */}
                <Footer />
              </CartPushLayout>

              <GlobalClientMounts />

            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        </SiteSettingsProvider>
        </div>{/* /app-root */}

        {/* Toast notifications — outside app-root so they sit above the cart drawer portal (z-[10001]) */}
        <Toaster
          position="top-right"
          containerStyle={{ zIndex: 10002 }}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
