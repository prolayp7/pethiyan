import { Star, Quote } from "lucide-react";
import Container from "@/components/layout/Container";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Founder, Bloom Organics",
    review:
      "Pethiyan transformed our brand packaging completely. The quality is outstanding and our customers constantly compliment how professional our products look on shelves.",
    rating: 5,
    initials: "SM",
    color: "bg-(--color-primary)",
  },
  {
    name: "James Thornton",
    role: "Head of Operations, NutriPure",
    review:
      "Fast delivery, amazing quality, and the custom printing exceeded our expectations. We've been ordering from Pethiyan for 2 years and they've never let us down.",
    rating: 5,
    initials: "JT",
    color: "bg-(--color-accent)",
  },
  {
    name: "Aisha Rahman",
    role: "E-commerce Director, SpiceRoute",
    review:
      "The eco-friendly packaging lineup is exactly what our sustainability-focused brand needed. Great price points and the low MOQ made it easy to start small and scale.",
    rating: 5,
    initials: "AR",
    color: "bg-purple-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-(--color-muted)" aria-labelledby="testimonials-heading">
      <Container>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-(--color-primary) uppercase tracking-wider mb-2">
            Social Proof
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)"
          >
            What Our Customers Say
          </h2>
          <p className="mt-3 text-gray-500">
            Trusted by over 10,000 brands worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-(--color-border) shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-(--color-primary)/20 mb-4" aria-hidden="true" />

              {/* Stars */}
              <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-(--color-secondary)">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
