import { Fragment } from "react";
import type { Metadata } from "next";
import { getCategories, getFeaturedProductsSection, getHeroSection, getNewsletterSection, getPromoBannerSection, getSocialProofSection, getVideoStorySection, getWebSettings, getWhyChooseUsSection, type HomeSectionPlacement } from "@/lib/api";
import HeroSection10 from "@/components/hero/HeroSection10";
import CategoryGrid from "@/components/sections/CategoryGrid";
import VideoCarouselGrid from "@/components/sections/VideoCarouselGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";
import YourItems from "@/components/sections/YourItems";
import PromoBanner from "@/components/sections/PromoBanner";
import BrandStory from "@/components/sections/BrandStory";
import Testimonials from "@/components/sections/Testimonials";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RecentBlogsSection from "@/components/sections/RecentBlogsSection";

type MovableSectionId = "video_stories" | "why_choose_us" | "promo_banner" | "social_proof" | "newsletter";
type SectionAnchor = "hero" | "categories" | "featured_products" | "your_items" | "recently_viewed" | MovableSectionId;

const ANCHOR_TO_PLACEMENT: Record<SectionAnchor, HomeSectionPlacement> = {
  hero: "after_hero",
  categories: "after_categories",
  featured_products: "after_featured_products",
  your_items: "after_your_items",
  recently_viewed: "after_recently_viewed",
  video_stories: "after_video_stories",
  why_choose_us: "after_why_choose_us",
  promo_banner: "after_promo_banner",
  social_proof: "after_social_proof",
  newsletter: "after_newsletter",
};

const MOVABLE_SECTION_ORDER: MovableSectionId[] = [
  "video_stories",
  "why_choose_us",
  "promo_banner",
  "social_proof",
  "newsletter",
];

const DEFAULT_TITLE = "Pethiyan — The Power of Perfect Packaging";
const DEFAULT_DESCRIPTION =
  "Shop premium packaging products — pouches, jars, ziplock bags, and custom packaging for modern brands. GST invoice, fast shipping across India.";

export async function generateMetadata(): Promise<Metadata> {
  const web = await getWebSettings().catch(() => null);

  const title       = web?.metaTitle       || DEFAULT_TITLE;
  const description = web?.metaDescription || DEFAULT_DESCRIPTION;
  const keywords    = web?.metaKeywords    || undefined;
  const canonical   = web?.metaCanonicalUrl || "/";
  const ogTitle     = web?.ogTitle         || title;
  const ogDesc      = web?.ogDescription   || description;
  const ogImage     = web?.ogImage         || "/images/banners/1.jpg";
  const twTitle     = web?.twitterTitle    || ogTitle;
  const twDesc      = web?.twitterDescription || ogDesc;
  const twImage     = web?.twitterImage    || ogImage;
  const twCard      = (web?.twitterCard as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image";

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      images: [twImage],
    },
  };
}

/** Caps any server-side fetch at `ms` ms; returns `fallback` on timeout or error. */
function withTimeout<T>(p: Promise<T>, fallback: T, ms = 5000): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((res) => setTimeout(() => res(fallback), ms)),
  ]);
}

export default async function HomePage() {
  // Fetch data in parallel — both calls are independent
  // withTimeout ensures a slow/unreachable backend never hangs the page
  const [featuredProductsSection, categories, heroData, videoStorySection, whyChooseUsSection, promoBannerSection, socialProofSection, newsletterSection] = await Promise.all([
    withTimeout(getFeaturedProductsSection(), null),
    withTimeout(getCategories(), []),
    withTimeout(getHeroSection(), null),
    withTimeout(getVideoStorySection(), null),
    withTimeout(getWhyChooseUsSection(), null),
    withTimeout(getPromoBannerSection(), null),
    withTimeout(getSocialProofSection(), null),
    withTimeout(getNewsletterSection(), null),
  ]);

  const sectionPlacements: Record<MovableSectionId, HomeSectionPlacement> = {
    video_stories: videoStorySection?.settings?.placement ?? "after_recently_viewed",
    why_choose_us: whyChooseUsSection?.placement ?? "after_video_stories",
    promo_banner: promoBannerSection?.placement ?? "after_why_choose_us",
    social_proof: socialProofSection?.placement ?? "after_promo_banner",
    newsletter: newsletterSection?.placement ?? "after_social_proof",
  };

  const renderedSections = new Set<MovableSectionId>();

  const renderSectionsAfter = (anchor: SectionAnchor): React.ReactNode[] => {
    const placement = ANCHOR_TO_PLACEMENT[anchor];

    return MOVABLE_SECTION_ORDER.flatMap((sectionId) => {
      if (renderedSections.has(sectionId) || sectionPlacements[sectionId] !== placement) {
        return [];
      }

      renderedSections.add(sectionId);

      let sectionNode: React.ReactNode = null;

      switch (sectionId) {
        case "video_stories":
          sectionNode = <VideoCarouselGrid data={videoStorySection} />;
          break;
        case "why_choose_us":
          sectionNode = <BrandStory section={whyChooseUsSection} />;
          break;
        case "promo_banner":
          sectionNode = <PromoBanner section={promoBannerSection} />;
          break;
        case "social_proof":
          sectionNode = <Testimonials section={socialProofSection} />;
          break;
        case "newsletter":
          sectionNode = <NewsletterSection section={newsletterSection} />;
          break;
      }

      return [
        <Fragment key={sectionId}>
          {sectionNode}
          {renderSectionsAfter(sectionId)}
        </Fragment>,
      ];
    });
  };

  return (
    <>
      <HeroSection10
        slides={heroData?.slides}
        badges={heroData?.badges}
        settings={heroData?.settings}
      />
      {renderSectionsAfter("hero")}
      {/* <TrustBadges /> */}
      <CategoryGrid categories={categories} />
      {renderSectionsAfter("categories")}
      <FeaturedProducts section={featuredProductsSection} />
      {renderSectionsAfter("featured_products")}
      <YourItems />
      {renderSectionsAfter("your_items")}
      <RecentlyViewedProducts
        title="Pick Up Where You Left Off"
        eyebrow="Your recent views"
        description="The products you checked out most recently are waiting here for a faster return."
        viewAllLabel="Explore catalog"
      />
      {renderSectionsAfter("recently_viewed")}

      <RecentBlogsSection />

      {/* Extra padding for mobile bottom nav */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}
