import Link from "next/link";

type SeoSection = {
  heading: string;
  body: React.ReactNode;
};

const sections: SeoSection[] = [
  {
    heading: "What Can You Buy from Pethiyan?",
    body: (
      <>
        Pethiyan's strength lies in its incredible diversity of packaging solutions. With offerings for every industry, product type, and budget, you can explore our meticulously curated categories designed for modern brands:
      </>
    ),
  },
  {
    heading: "Standup Pouches & Flexible Packaging",
    body: (
      <>
        Pethiyan offers a wide range of{" "}
        <Link href="/categories/standup-pouches" className="text-blue-600 hover:underline">standup pouches</Link>{" "}
        designed to keep your products fresh and your brand looking premium. From resealable zip-lock styles to heat-sealed barrier pouches, our flexible packaging solutions are trusted by food, beverage, nutraceutical, and cosmetic brands alike. Choose from custom print options, matte or gloss finishes, kraft paper, foil, and clear window styles to match your product's identity perfectly.
      </>
    ),
  },
  {
    heading: "Ziplock Bags & Resealable Packaging",
    body: (
      <>
        Our{" "}
        <Link href="/categories/ziplock-pouches" className="text-blue-600 hover:underline">ziplock bags</Link>{" "}
        provide the perfect balance of convenience and protection. Available in multiple sizes and thicknesses, these resealable bags are ideal for snacks, dried goods, pet treats, hardware components, and more. With high-barrier material options, your products stay protected from moisture, oxygen, and light — extending shelf life without compromising presentation.
      </>
    ),
  },
  {
    heading: "Custom Packaging Solutions",
    body: (
      <>
        Stand out on shelves with fully{" "}
        <Link href="/categories/custom-packaging" className="text-blue-600 hover:underline">custom packaging</Link>{" "}
        designed exclusively for your brand. From concept to production, Pethiyan offers end-to-end custom packaging services including structural design, digital proofing, and high-resolution print. Whether you need short-run digital printing for product launches or large-scale offset runs for retail, our team delivers quality and consistency at every step.
      </>
    ),
  },
  {
    heading: "Eco-Friendly & Sustainable Packaging",
    body: (
      <>
        Pethiyan is committed to a greener future. Our{" "}
        <Link href="/categories/eco-packaging" className="text-blue-600 hover:underline">eco packaging</Link>{" "}
        range includes compostable pouches, biodegradable mailers, recycled paper bags, and plant-based films. We help brands reduce their carbon footprint without sacrificing shelf appeal or product protection. Our sustainable packaging lines meet international compostability standards and are perfect for eco-conscious brands across food, beauty, and lifestyle categories.
      </>
    ),
  },
  {
    heading: "Bulk Orders & Wholesale Packaging",
    body: (
      <>
        For businesses that need volume, Pethiyan offers competitive pricing on{" "}
        <Link href="/bulk" className="text-blue-600 hover:underline">bulk orders</Link>{" "}
        and{" "}
        <Link href="/wholesale" className="text-blue-600 hover:underline">wholesale packaging</Link>.{" "}
        Our production capacity supports FMCG companies, co-packers, contract manufacturers, and retail chains. Dedicated account managers ensure your supply chain runs smoothly with on-time delivery, consistent quality, and flexible payment terms tailored to your business.
      </>
    ),
  },
];

export default function FooterSeoContent() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">

        {/* Main heading */}
        <h2 className="text-base font-semibold mb-3" style={{ color: "#111827" }}>
          Pethiyan: Premium Packaging Solutions for Modern Brands
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b7280" }}>
          Welcome to Pethiyan, India&apos;s trusted destination for high-quality flexible packaging. With thousands of products across dozens of packaging categories and a relentless focus on brand experience, Pethiyan isn&apos;t just a supplier — it&apos;s your packaging partner. Discover{" "}
          <Link href="/categories/standup-pouches" className="text-blue-600 hover:underline">standup pouches</Link>,{" "}
          <Link href="/categories/ziplock-pouches" className="text-blue-600 hover:underline">ziplock bags</Link>,{" "}
          <Link href="/categories/custom-packaging" className="text-blue-600 hover:underline">custom packaging</Link>,{" "}
          <Link href="/categories/eco-packaging" className="text-blue-600 hover:underline">eco-friendly packaging</Link>,{" "}
          and more — all built to make every shipment memorable.
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: "1.5rem" }} />

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                {section.heading}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
