import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustBadges = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "Free", label: "Shipping $50+" },
];

const features = [
  "Premium food-grade materials",
  "Custom print & branding",
  "Fast worldwide delivery",
];

export default function HeroSection() {
  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-155 lg:min-h-175 gap-12 py-16 lg:py-0">

          {/* ── Left: Text Content ── */}
          <div className="flex-1 text-center lg:text-left z-10 max-w-xl mx-auto lg:mx-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-(--color-primary)/10 text-(--color-primary) text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-(--color-primary)/20">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) animate-pulse" aria-hidden="true" />
              New Collection 2025
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-(--color-secondary) leading-tight tracking-tight">
              Premium{" "}
              <span className="text-(--color-primary)">Packaging</span>
              <br className="hidden sm:block" />
              {" "}Solutions
            </h1>

            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0">
              High-quality packaging designed for modern brands. Elevate your
              product presentation with our premium, eco-friendly solutions.
            </p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2 flex flex-col items-center lg:items-start">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-(--color-accent) shrink-0" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                className="rounded-full px-8 gap-2 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-semibold"
                asChild
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary)/5 font-semibold"
                asChild
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex flex-wrap items-center gap-8 justify-center lg:justify-start">
              {trustBadges.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-extrabold text-(--color-primary)">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Hero Visual ── */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            {/* Decorative blobs */}
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-(--color-primary)/8 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-(--color-accent)/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative rounded-3xl overflow-hidden aspect-4/3 lg:aspect-5/4 shadow-2xl border border-gray-100">
              {/* Gradient placeholder — replace with next/image product photography */}
              <div className="absolute inset-0 bg-linear-to-br from-(--color-primary)/10 via-(--color-primary-light) to-(--color-accent)/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {/* Mock packaging visual */}
                <div className="grid grid-cols-2 gap-3 p-8 w-full max-w-xs mx-auto">
                  {[
                    { bg: "bg-(--color-primary)", label: "Standup Pouch" },
                    { bg: "bg-(--color-accent)", label: "Ziplock Bag" },
                    { bg: "bg-(--color-primary-dark)", label: "Custom Print" },
                    { bg: "bg-(--color-secondary)/70", label: "Eco Pack" },
                  ].map(({ bg, label }) => (
                    <div
                      key={label}
                      className={`${bg} rounded-2xl aspect-square flex flex-col items-center justify-center gap-1 shadow-md`}
                    >
                      <div className="w-8 h-10 bg-white/30 rounded-md" />
                      <span className="text-white text-[10px] font-medium text-center px-1">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-(--color-secondary)/20 to-transparent" aria-hidden="true" />
            </div>

            {/* Floating badge — free shipping */}
            <div className="absolute bottom-6 left-6 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium">Free Shipping</p>
              <p className="text-sm font-bold text-(--color-secondary)">On orders $50+</p>
            </div>

            {/* Floating badge — eco */}
            <div className="absolute top-6 right-6 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium">Certified</p>
              <p className="text-sm font-bold text-(--color-accent)">Eco Friendly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
