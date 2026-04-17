import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Container from "@/components/layout/Container";
import type { ApiPromoBannerSection } from "@/lib/api";

interface PromoBannerProps {
  section?: ApiPromoBannerSection | null;
}

export default function PromoBanner({ section }: PromoBannerProps) {
  if (!section?.enabled) return null;

  const hasBadge = section.badgeText.length > 0;
  const hasOffer = section.offerPrimary.length > 0 || section.offerSecondary.length > 0;
  const hasButton = section.buttonLabel.length > 0;

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
              {hasBadge ? (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                  <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                  {section.badgeText}
                </div>
              ) : null}
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                {section.heading}
              </h2>
              {section.subheading ? (
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70 sm:mx-0">
                  {section.subheading}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0">
              {hasOffer ? (
                <div className="rounded-2xl bg-white/15 px-8 py-4 text-center">
                  {section.offerPrimary ? <p className="text-4xl font-extrabold">{section.offerPrimary}</p> : null}
                  {section.offerSecondary ? <p className="text-sm font-medium text-white/80">{section.offerSecondary}</p> : null}
                </div>
              ) : null}
              {hasButton ? (
                <Link
                  href={section.buttonLink || "/shop"}
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-(--color-primary) transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  {section.buttonLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
