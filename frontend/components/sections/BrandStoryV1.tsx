import { CheckCircle, Award, Globe, Leaf } from "lucide-react";
import Container from "@/components/layout/Container";

const pillars = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Every product meets rigorous quality standards before reaching you.",
  },
  {
    icon: Leaf,
    title: "Eco Responsible",
    description: "Sustainable materials and packaging processes that protect the planet.",
  },
  {
    icon: Globe,
    title: "Global Delivery",
    description: "Fast, reliable shipping to over 50 countries worldwide.",
  },
];

const benefits = [
  "100% food-grade certified materials",
  "Custom branding & full-colour printing",
  "Low minimum order quantities",
  "Dedicated account manager",
  "30-day satisfaction guarantee",
];

export default function BrandStory() {
  return (
    <section className="py-16 bg-white" aria-labelledby="brand-heading">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-14">

          {/* Image / Visual side */}
          <div className="flex-1 w-full">
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 bg-linear-to-br from-(--color-primary-light) to-(--color-primary)/20 border border-(--color-primary)/10">
              {/* Decorative packaging mock */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 p-8 w-full max-w-sm">
                  {[
                    "bg-(--color-primary)",
                    "bg-(--color-accent)",
                    "bg-(--color-primary-dark)",
                    "bg-purple-400",
                    "bg-amber-400",
                    "bg-teal-400",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`${color} rounded-xl aspect-square opacity-80 shadow-md`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              {/* Stats overlay */}
              <div className="absolute bottom-5 left-5 right-5 flex gap-3">
                {[
                  { val: "10K+", lbl: "Brands" },
                  { val: "500+", lbl: "Products" },
                  { val: "50+", lbl: "Countries" },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center shadow-sm">
                    <p className="text-base font-extrabold text-(--color-primary)">{val}</p>
                    <p className="text-xs text-gray-500">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-semibold text-(--color-primary) uppercase tracking-wider mb-3">
              Our Story
            </p>
            <h2
              id="brand-heading"
              className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary) leading-tight"
            >
              Why Choose{" "}
              <span className="text-(--color-primary)">Pethiyan</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0">
              We believe great packaging tells a story. From small businesses to
              enterprise brands, Pethiyan provides premium solutions that protect
              your products and elevate your brand identity.
            </p>

            {/* Benefits list */}
            <ul className="mt-6 space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <CheckCircle className="h-4 w-4 text-(--color-accent) shrink-0" aria-hidden="true" />
                  <span className="text-sm text-gray-600">{b}</span>
                </li>
              ))}
            </ul>

            {/* Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pillars.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="p-4 rounded-2xl bg-(--color-muted) border border-(--color-border) text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-(--color-primary)/10 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-(--color-primary)" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-(--color-secondary)">{title}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
