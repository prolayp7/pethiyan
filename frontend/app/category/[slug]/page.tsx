import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import {
  getCategory,
  getCategories,
  getProductsByCategory,
  type RealApiProduct,
} from "@/lib/api";
import Container from "@/components/layout/Container";
import CategoryProducts from "./CategoryProducts";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

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
  const title = category.seo_title || `${rawTitle} Packaging Products`;
  const description =
    category.seo_description ||
    `Shop ${rawTitle} packaging products at Pethiyan — premium quality, GST invoice, fast delivery across India.`;
  const keywords = category.seo_keywords || undefined;
  const indexable = category.is_indexable !== false;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    robots: indexable
      ? { index: true,  follow: true,  googleBot: { index: true,  follow: true  } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${title} | Pethiyan`,
      description,
      url: `/category/${slug}`,
      ...(category.image ? { images: [{ url: category.image, alt: rawTitle }] } : {}),
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

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: category.name, href: `/category/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-(--background)">
      <script {...jsonLd(bcSchema)} key="breadcrumb-schema" />

      {/* Combined header: title left, breadcrumb right */}
      <div className="relative bg-white border-b border-(--color-border) overflow-hidden">
        {category.image && (
          <div className="absolute inset-0">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover opacity-10"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <Container>
          <div className="relative py-5 flex items-center justify-between gap-4">
            {/* Left: title + subtitle */}
            <div>
              <p className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest mb-1">
                Category
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">
                {category.name}
              </h1>
              <p className="mt-0.5 text-gray-500 text-sm">
                Premium {category.name.toLowerCase()} packaging solutions with GST invoice
              </p>
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

      {/* Products with client-side sort/filter */}
      <CategoryProducts initialProducts={products as RealApiProduct[]} />

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
