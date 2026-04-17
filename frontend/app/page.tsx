import type { Metadata } from "next";
import { getCategories, getFeaturedProductsSection, getHeroSection, getVideoStorySection } from "@/lib/api";
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

export const metadata: Metadata = {
  title: "Pethiyan — The Power of Perfect Packaging",
  description:
    "Shop premium packaging products — pouches, jars, ziplock bags, and custom packaging for modern brands. GST invoice, fast shipping across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pethiyan — The Power of Perfect Packaging",
    description:
      "Premium packaging products for modern brands. Custom pouches, eco-friendly bags, standup pouches and more.",
    url: "/",
    images: [{ url: "/images/banners/1.jpg", width: 1200, height: 630, alt: "Pethiyan Packaging" }],
  },
};

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
  const [featuredProductsSection, categories, heroData, videoStorySection] = await Promise.all([
    withTimeout(getFeaturedProductsSection(), null),
    withTimeout(getCategories(), []),
    withTimeout(getHeroSection(), null),
    withTimeout(getVideoStorySection(), null),
  ]);

  return (
    <>
      <HeroSection10
        slides={heroData?.slides}
        badges={heroData?.badges}
        settings={heroData?.settings}
      />
      {/* <TrustBadges /> */}
      <CategoryGrid categories={categories} />
      <FeaturedProducts section={featuredProductsSection} />
      <YourItems />
      <RecentlyViewedProducts
        title="Pick Up Where You Left Off"
        eyebrow="Your recent views"
        description="The products you checked out most recently are waiting here for a faster return."
        viewAllLabel="Explore catalog"
      />
      <VideoCarouselGrid data={videoStorySection} />
      
      <BrandStory />
      <PromoBanner />
      <Testimonials />
      <NewsletterSection />

      <RecentBlogsSection />

      {/* Extra padding for mobile bottom nav */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}
