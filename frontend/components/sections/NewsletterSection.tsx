import Container from "@/components/layout/Container";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { Mail, Bell } from "lucide-react";

const perks = [
  "Exclusive deals & early access",
  "New product announcements",
  "Packaging tips & brand guides",
];

export default function NewsletterSection() {
  return (
    <section
      className="py-16 bg-linear-to-br from-(--color-primary-dark) to-(--color-primary)"
      aria-labelledby="newsletter-heading"
    >
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left */}
          <div className="text-center lg:text-left text-white max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Newsletter
            </div>
            <h2
              id="newsletter-heading"
              className="text-3xl sm:text-4xl font-extrabold leading-tight"
            >
              Stay Updated with{" "}
              <span className="text-(--color-accent)">Packaging Trends</span>
            </h2>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Join 5,000+ brand owners who get our weekly packaging insights,
              exclusive deals, and new product alerts.
            </p>

            <ul className="mt-5 space-y-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm text-white/80 justify-center lg:justify-start">
                  <Mail className="h-3.5 w-3.5 text-(--color-accent) shrink-0" aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/15">
            <p className="text-white font-semibold mb-1">Get packaging insights</p>
            <p className="text-white/60 text-xs mb-5">
              No spam, unsubscribe any time.
            </p>
            <NewsletterForm />
          </div>

        </div>
      </Container>
    </section>
  );
}
