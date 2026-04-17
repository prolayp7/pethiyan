"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { ApiWhyChooseUsSection } from "@/lib/api";
import styles from "./BrandStory.module.css";

interface BrandStoryProps {
  section?: ApiWhyChooseUsSection | null;
}

export default function BrandStory({ section }: BrandStoryProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const features = section?.features ?? [];

  if (!section?.enabled) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function scrollMobileCards(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-why-slide]");
    const gap = 16;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.88;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  function getDelayClass(index: number) {
    const delayClasses = [
      styles.delay1,
      styles.delay2,
      styles.delay3,
      styles.delay4,
      styles.delay5,
      styles.delay6,
      styles.delay7,
    ];

    return delayClasses[index] ?? styles.delay7;
  }

  return (
    <section
      ref={ref}
      className={`${styles.section} relative overflow-hidden pt-10 pb-8 sm:py-16 lg:py-20`}
      aria-labelledby="brand-heading"
    >
        {/* Grid overlay */}
        <div aria-hidden="true" className={`${styles.gridOverlay} pointer-events-none absolute inset-0`} />
        {/* Corner glows */}
        <div aria-hidden="true" className={`${styles.glowTop} pointer-events-none absolute inset-0`} />
        <div aria-hidden="true" className={`${styles.glowBottom} pointer-events-none absolute inset-0`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div
            className={`${styles.item} ${styles.delay0} ${visible ? styles.show : ""} mb-12 max-w-4xl text-left`}
          >
            <p className={`${styles.eyebrow} mb-2 text-xs font-bold uppercase tracking-[0.22em]`}>
              {section.eyebrow}
            </p>
            <h2
              id="brand-heading"
              className={`${styles.heading} text-3xl font-extrabold sm:text-4xl`}
            >
              {section.heading}
            </h2>
            <p className={`${styles.subheading} mt-3 text-sm`}>
              {section.subheading}
            </p>
          </div>

          {/* Mobile slider */}
          <div className="sm:hidden">
            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Why choose us slider"
            >
              {features.map((item, i) => (
                <div
                  key={i}
                  data-why-slide
                  className={`${styles.card} ${styles.item} ${getDelayClass(i)} ${visible ? styles.show : ""} w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start rounded-2xl p-5`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle2 className={`${styles.icon} mt-0.5 h-5 w-5 shrink-0`} />
                    <span
                      className={`${styles.cardText} min-w-0 whitespace-normal text-sm leading-relaxed wrap-break-word`}
                    >
                      {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {features.length > 1 ? (
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollMobileCards("prev")}
                  aria-label="Scroll why choose us cards left"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0f2444]/90 text-white shadow-sm transition-colors hover:bg-[#143154]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollMobileCards("next")}
                  aria-label="Scroll why choose us cards right"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0f2444]/90 text-white shadow-sm transition-colors hover:bg-[#143154]"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Why Us grid */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, i) => (
              <div
                key={i}
                className={`${styles.card} ${styles.item} ${getDelayClass(i)} ${visible ? styles.show : ""} flex min-h-16 items-center gap-3 rounded-2xl px-5 py-4`}
              >
                <CheckCircle2 className={`${styles.icon} h-5 w-5 shrink-0`} />
                <span
                  className={`${styles.cardText} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-relaxed`}
                  title={item}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
  );
}
