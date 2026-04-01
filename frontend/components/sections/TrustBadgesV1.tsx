import { Truck, RefreshCcw, ShieldCheck, FileText, Headphones } from "lucide-react";
import Container from "@/components/layout/Container";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders above ₹999",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "7-day hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected checkout",
  },
  {
    icon: FileText,
    title: "GST Invoice",
    subtitle: "Valid tax invoice on every order",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated customer care",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-y border-(--color-border)" aria-label="Trust badges">
      <Container>
        <div className="py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-(--color-border)">
          {badges.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-4 py-3 first:pl-0 last:pr-0"
            >
              <div className="shrink-0 w-9 h-9 rounded-xl bg-(--color-primary)/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-(--color-primary)" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-(--color-secondary) truncate">{title}</p>
                <p className="text-[10px] text-gray-400 leading-snug truncate">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
