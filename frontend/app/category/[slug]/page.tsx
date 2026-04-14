import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Tag } from "lucide-react";
import {
  getCategory,
  getCategories,
  getProductsByCategory,
} from "@/lib/api";
import Container from "@/components/layout/Container";
import CategoryClientLayout from "./CategoryClientLayout";
import {
  breadcrumbSchema,
  collectionPageSchema,
  jsonLd,
} from "@/lib/structured-data";
import { getCustomJsonLdSchemas, resolveCategorySeo } from "@/lib/seo";

// ─── Static params (pre-render known categories at build time) ────────────────

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

// ─── Dynamic SEO metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  const rawTitle = category.name;
  const seo = resolveCategorySeo(category);

  return {
    title: seo.title,
    description: seo.description,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.indexable
      ? { index: true,  follow: true,  googleBot: { index: true,  follow: true  } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: {
      canonical: `/category/${slug}`,
      languages: { "en": `/category/${slug}`, "x-default": `/category/${slug}` },
    },
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      url: `/category/${slug}`,
      ...(seo.openGraphImage ? { images: [{ url: seo.openGraphImage, alt: rawTitle }] } : {}),
    },
    twitter: {
      card: seo.twitterCard,
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products, categories] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getCategories(),
  ]);

  if (!category) notFound();

  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: category.name, href: `/category/${slug}` },
  ]);
  const customSchemas = getCustomJsonLdSchemas(
    category.schema_mode,
    category.schema_json_ld,
  );
  const autoSchemas =
    customSchemas.length > 0
      ? []
      : [collectionPageSchema(category, products), bcSchema];

  return (
    <div className="min-h-screen bg-(--background)">
      {autoSchemas.map((schema, index) => (
        <script {...jsonLd(schema)} key={`category-schema-${index}`} />
      ))}
      {customSchemas.map((schema, index) => (
        <script {...jsonLd(schema as Record<string, unknown>)} key={`category-custom-schema-${index}`} />
      ))}

      {/* Page header with inline breadcrumb */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Left: icon + title + subtitle */}
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
              >
                <Tag className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">{category.name}</h1>
                <p className="mt-0.5 text-gray-500 text-sm">
                  Premium {category.name.toLowerCase()} packaging solutions with GST invoice
                </p>
              </div>
            </div>
            {/* Right: breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <Link href="/shop" className="hover:text-(--color-primary) transition-colors">Shop</Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">{category.name}</span>
            </nav>
          </div>
        </Container>
      </div>

      <CategoryClientLayout
        currentCategory={category}
        categories={categories}
        products={products}
      />

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
