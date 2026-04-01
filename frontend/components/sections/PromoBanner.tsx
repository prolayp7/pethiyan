import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Container from "@/components/layout/Container";

export default function PromoBanner() {
  return (
    <section className="py-10 bg-white" aria-label="Promotional banner">
      <Container>
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-(--color-primary-dark) via-(--color-primary) to-(--color-accent) p-10 sm:p-14 text-white">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" aria-hidden="true" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" aria-hidden="true" />
          <div className="absolute right-24 bottom-0 w-32 h-32 bg-white/5 rounded-full" aria-hidden="true" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left max-w-lg">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Limited Time Offer
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Custom Packaging Solutions
                <span className="block text-white/80 text-2xl sm:text-3xl font-bold mt-1">
                  for Your Brand
                </span>
              </h2>
              <p className="mt-3 text-white/70 text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
                Get premium branded packaging with your logo and design.
                Minimum order from just 100 units.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="text-center bg-white/15 rounded-2xl px-8 py-4">
                <p className="text-4xl font-extrabold">20%</p>
                <p className="text-sm text-white/80 font-medium">OFF First Order</p>
              </div>
              <Link
                href="/categories/custom-packaging"
                className="flex items-center gap-2 px-8 py-3 bg-white text-(--color-primary) font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
              >
                Explore Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
