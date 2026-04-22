import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Package, Users, Award, Leaf, ShieldCheck, Truck, HeadphonesIcon, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";
import { fetchPageBySlug } from "@/lib/pages";

type AboutSection = {
  subheading?: string;
  heading?: string;
  body_html?: string;
  image_url?: string;
  image_alt?: string;
  image_position?: "left" | "right";
};

type CoreValueItem = {
  icon?: "leaf" | "award" | "users";
  title?: string;
  description?: string;
};

type CoreValuesSection = {
  eyebrow?: string;
  heading?: string;
  items: CoreValueItem[];
};

type WhyPethiyanItem = {
  icon?: "package" | "shieldcheck" | "truck" | "headphonesicon" | "refreshcw" | "leaf";
  title?: string;
  description?: string;
};

type WhyPethiyanSection = {
  eyebrow?: string;
  heading?: string;
  items: WhyPethiyanItem[];
};

const VALUES = [
  {
    icon: "leaf" as const,
    title: "Eco-First",
    description: "We source sustainable materials and design packaging that minimises environmental impact without compromising on quality.",
  },
  {
    icon: "award" as const,
    title: "Uncompromising Quality",
    description: "Every product leaves our facility after rigorous quality checks — because your brand deserves nothing less.",
  },
  {
    icon: "users" as const,
    title: "Customer-Centric",
    description: "From first inquiry to repeat orders, we are here at every step with fast support and flexible solutions.",
  },
];

const WHY_US = [
  { icon: "package" as const, title: "Wide Range", desc: "100+ packaging types from stand-up pouches to custom printed boxes." },
  { icon: "shieldcheck" as const, title: "BIS Certified", desc: "All materials meet Indian food-safety and packaging standards." },
  { icon: "truck" as const, title: "Pan-India Delivery", desc: "Reliable shipping to all 28 states with real-time tracking." },
  { icon: "headphonesicon" as const, title: "24/7 Support", desc: "Dedicated support team via chat, email, and phone." },
  { icon: "refreshcw" as const, title: "Easy Returns", desc: "7-day hassle-free returns on all standard products." },
  { icon: "leaf" as const, title: "Eco Options", desc: "Compostable, recycled, and kraft packaging options available." },
];

const FALLBACK_SECTIONS: AboutSection[] = [
  {
    subheading: "Our Story",
    heading: "Built for India's Growing Businesses",
    body_html: `
      <p>Pethiyan started as a simple idea: small and medium businesses in India deserved the same premium packaging options that large corporations had access to — without the high minimum order quantities or the wait.</p>
      <p>We work directly with certified manufacturers across India to bring you a curated range of pouches, bags, jars, and boxes — all available for order online, with GST invoices, and delivered to your doorstep.</p>
      <p>Today, over 50,000 food brands, nutraceutical companies, artisan makers, and D2C startups trust Pethiyan to pack their most important product.</p>
    `,
    image_position: "right",
  },
];

const ICON_MAP = {
  leaf: Leaf,
  award: Award,
  users: Users,
} as const;

const FEATURE_ICON_MAP = {
  package: Package,
  shieldcheck: ShieldCheck,
  truck: Truck,
  headphonesicon: HeadphonesIcon,
  refreshcw: RefreshCw,
  leaf: Leaf,
} as const;

async function getAboutPageData(): Promise<{ title: string; metaTitle: string; metaDescription: string; sections: AboutSection[]; coreValues: CoreValuesSection; whyPethiyan: WhyPethiyanSection }> {
  try {
    const page = await fetchPageBySlug("about-us");
    const blocks = page?.content_blocks && typeof page.content_blocks === "object" ? page.content_blocks : {};
    const sections = Array.isArray(blocks.story_sections) && blocks.story_sections.length > 0
      ? blocks.story_sections
      : FALLBACK_SECTIONS;
    const coreValues = blocks.core_values && typeof blocks.core_values === "object"
      ? {
          eyebrow: blocks.core_values.eyebrow ?? "What Drives Us",
          heading: blocks.core_values.heading ?? "Our Core Values",
          items: Array.isArray(blocks.core_values.items) && blocks.core_values.items.length > 0
            ? blocks.core_values.items
            : VALUES,
        }
      : {
          eyebrow: "What Drives Us",
          heading: "Our Core Values",
          items: VALUES,
        };
    const whyPethiyan = blocks.why_pethiyan && typeof blocks.why_pethiyan === "object"
      ? {
          eyebrow: blocks.why_pethiyan.eyebrow ?? "Why Pethiyan",
          heading: blocks.why_pethiyan.heading ?? "Everything Your Business Needs",
          items: Array.isArray(blocks.why_pethiyan.items) && blocks.why_pethiyan.items.length > 0
            ? blocks.why_pethiyan.items
            : WHY_US.map(({ icon, title, desc }) => ({ icon, title, description: desc })),
        }
      : {
          eyebrow: "Why Pethiyan",
          heading: "Everything Your Business Needs",
          items: WHY_US.map(({ icon, title, desc }) => ({ icon, title, description: desc })),
        };

    return {
      title: page?.title ?? "About Us",
      metaTitle: page?.meta_title ?? "About Us",
      metaDescription: page?.meta_description ?? "Learn about Pethiyan — India's trusted packaging brand for custom pouches, kraft bags, and eco-friendly packaging solutions for 50,000+ businesses.",
      sections,
      coreValues,
      whyPethiyan,
    };
  } catch {
    return {
      title: "About Us",
      metaTitle: "About Us",
      metaDescription: "Learn about Pethiyan — India's trusted packaging brand for custom pouches, kraft bags, and eco-friendly packaging solutions for 50,000+ businesses.",
      sections: FALLBACK_SECTIONS,
      coreValues: {
        eyebrow: "What Drives Us",
        heading: "Our Core Values",
        items: VALUES,
      },
      whyPethiyan: {
        eyebrow: "Why Pethiyan",
        heading: "Everything Your Business Needs",
        items: WHY_US.map(({ icon, title, desc }) => ({ icon, title, description: desc })),
      },
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPageData();
  return {
    title: about.metaTitle,
    description: about.metaDescription,
  };
}

function AboutStorySection({ section, index }: { section: AboutSection; index: number }) {
  const imageOnLeft = section.image_position === "left";
  const wrapperClass = imageOnLeft ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]";
  const textOrder = imageOnLeft ? "lg:order-2" : "lg:order-1";
  const imageOrder = imageOnLeft ? "lg:order-1" : "lg:order-2";

  return (
    <Container className={index === 0 ? "py-16 lg:py-20" : "pb-16 lg:pb-20"}>
      <div className={`grid grid-cols-1 ${wrapperClass} gap-12 items-center`}>
        <div className={textOrder}>
          {section.subheading ? (
            <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">
              {section.subheading}
            </p>
          ) : null}
          {section.heading ? (
            <h2 className="text-3xl font-extrabold text-(--color-secondary) leading-tight mb-5">
              {section.heading}
            </h2>
          ) : null}
          <div
            className="about-story-richtext space-y-4 text-gray-600 text-sm leading-relaxed [&_a]:text-(--color-primary) [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: section.body_html ?? "" }}
          />
        </div>

        <div className={imageOrder}>
          {section.image_url ? (
            <Image
              src={section.image_url}
              alt={section.image_alt || section.heading || "About section image"}
              width={1200}
              height={900}
              unoptimized
              className="h-80 w-full rounded-3xl object-cover lg:h-96"
            />
          ) : (
            <div
              className="relative h-80 lg:h-96 rounded-3xl overflow-hidden"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-24 w-24 text-white opacity-20" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <p className="text-2xl font-extrabold">{section.image_alt || "Made in India"}</p>
                <p className="text-white/70 text-sm mt-2">Quality packaging for Indian businesses</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default async function AboutPage() {
  const about = await getAboutPageData();

  return (
    <div style={{ background: "var(--background)" }}>
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
                style={{ background: "var(--brand-gradient)" }}
              >
                <Package className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">{about.title}</h1>
                <p className="mt-0.5 text-gray-500 text-sm">Learn how Pethiyan helps Indian businesses package better, faster, and smarter.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">About Us</span>
            </nav>
          </div>
        </Container>
      </div>

      {about.sections.map((section, index) => (
        <AboutStorySection key={`${section.heading ?? "section"}-${index}`} section={section} index={index} />
      ))}

      {/* ── Values ── */}
      <div className="bg-white py-16 lg:py-20 border-y border-gray-100">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">
              {about.coreValues.eyebrow || "What Drives Us"}
            </p>
            <h2 className="text-3xl font-extrabold text-(--color-secondary)">
              {about.coreValues.heading || "Our Core Values"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {about.coreValues.items.map(({ icon, title, description }, index) => {
              const Icon = ICON_MAP[icon ?? "leaf"] ?? Leaf;
              return (
                <div key={`${title ?? "value"}-${index}`} className="text-center px-4">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-extrabold text-(--color-secondary) mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── Why Choose Us ── */}
      <Container className="py-16 lg:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">
            {about.whyPethiyan.eyebrow || "Why Pethiyan"}
          </p>
          <h2 className="text-3xl font-extrabold text-(--color-secondary)">
            {about.whyPethiyan.heading || "Everything Your Business Needs"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {about.whyPethiyan.items.map(({ icon, title, description }, index) => {
            const Icon = FEATURE_ICON_MAP[icon ?? "package"] ?? Package;
            return (
              <div
                key={`${title ?? "feature"}-${index}`}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary) text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* ── CTA Banner ── */}
      <div
        className="py-16"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Container className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready to Upgrade Your Packaging?
          </h2>
          <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
            Browse our full catalogue and place your order in minutes — no minimum quantity, GST invoice included.
          </p>
          <Link
            href="/shop"
            className="btn-brand inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            Shop Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Container>
      </div>
    </div>
  );
}
