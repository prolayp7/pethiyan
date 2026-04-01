import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  getCategory,
  getCategories,
  getProductsByCategory,
} from "@/lib/api";
import Breadcrumb from "@/components/common/Breadcrumb";
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
  return {
    title: `${category.name} Packaging Products`,
    description: `Shop ${category.name} packaging products at Pethiyan — premium quality, GST invoice, fast delivery across India.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${category.name} Packaging | Pethiyan`,
      description: `Browse our range of ${category.name} packaging solutions.`,
      url: `/category/${slug}`,
      ...(category.image ? { images: [{ url: category.image, alt: category.name }] } : {}),
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

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      {/* Category hero */}
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
          <div className="relative py-10 sm:py-14">
            <p className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest mb-2">
              Category
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)">
              {category.name}
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Premium {category.name.toLowerCase()} packaging solutions with GST invoice
            </p>
          </div>
        </Container>
      </div>

      {/* Products with client-side sort/filter */}
      <CategoryProducts initialProducts={products} />

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
