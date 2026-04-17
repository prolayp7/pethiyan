"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import type { ApiSocialProofSection } from "@/lib/api";

interface TestimonialsProps {
  section?: ApiSocialProofSection | null;
}

const avatarColors = [
  "bg-(--color-primary)",
  "bg-(--color-accent)",
  "bg-[#7c3aed]",
  "bg-[#0f766e]",
  "bg-[#ea580c]",
  "bg-[#2563eb]",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function Testimonials({ section }: TestimonialsProps) {
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const testimonials = section?.testimonials ?? [];

  if (!section?.enabled || testimonials.length === 0) return null;

  function scrollMobileTestimonials(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-testimonial-slide]");
    const gap = 24;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.9;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const el = mobileSliderRef.current;
    if (!el) return;

    const timer = window.setInterval(() => {
      const firstCard = el.querySelector<HTMLElement>("[data-testimonial-slide]");
      const gap = 24;
      const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.9;
      const amount = cardWidth + gap;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + amount;

      el.scrollTo({
        left: nextLeft >= maxScrollLeft - 4 ? 0 : nextLeft,
        behavior: "smooth",
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-(--color-muted) py-10 md:py-16" aria-labelledby="testimonials-heading">
      <Container>
        <div className="mb-7 max-w-3xl text-left md:mb-12">
          <p className="text-sm font-semibold text-(--color-primary) uppercase tracking-wider mb-2">
            {section.eyebrow}
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)"
          >
            {section.heading}
          </h2>
          {section.subheading ? <p className="mt-3 text-gray-500">{section.subheading}</p> : null}
        </div>

        <div className="relative md:hidden">
          <div
            ref={mobileSliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Testimonials slider"
          >
            {testimonials.map((t, index) => {
              const avatarColor = avatarColors[index % avatarColors.length];

              return (
              <div
                key={t.id}
                data-testimonial-slide
                className="w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start rounded-2xl border border-(--color-border) bg-white p-6 shadow-sm transition-all duration-300"
              >
                <Quote className="mb-4 h-8 w-8 text-(--color-primary)/20" aria-hidden="true" />

                <div className="mb-4 flex gap-1" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="min-w-0 whitespace-normal wrap-break-word text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  {t.imageUrl ? (
                    <img
                      src={t.imageUrl}
                      alt={t.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${avatarColor} text-xs font-bold text-white`}
                      aria-hidden="true"
                    >
                      {getInitials(t.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="whitespace-normal wrap-break-word text-sm font-semibold text-(--color-secondary)">{t.name}</p>
                    {t.title ? <p className="whitespace-normal wrap-break-word text-xs text-gray-400">{t.title}</p> : null}
                  </div>
                </div>
              </div>
            );})}
          </div>

          {testimonials.length > 1 ? <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollMobileTestimonials("prev")}
              aria-label="Scroll testimonials left"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c8d7ea] bg-white text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollMobileTestimonials("next")}
              aria-label="Scroll testimonials right"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c8d7ea] bg-white text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div> : null}
        </div>

        <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-3">
          {testimonials.map((t, index) => {
            const avatarColor = avatarColors[index % avatarColors.length];

            return (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-(--color-border) shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-(--color-primary)/20 mb-4" aria-hidden="true" />

              {/* Stars */}
              <div className="flex gap-1 mb-4" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                {t.imageUrl ? (
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    aria-hidden="true"
                  >
                    {getInitials(t.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-(--color-secondary)">{t.name}</p>
                  {t.title ? <p className="text-xs text-gray-400">{t.title}</p> : null}
                </div>
              </div>
            </div>
          );})}
        </div>
      </Container>
    </section>
  );
}
