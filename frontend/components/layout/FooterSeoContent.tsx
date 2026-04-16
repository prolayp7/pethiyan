type SeoSection = {
  title: string;
  content: string;
};

const FALLBACK_TITLE = "Pethiyan: Premium Packaging Solutions for Modern Brands";
const FALLBACK_INTRO = `Welcome to Pethiyan, India&apos;s trusted destination for high-quality flexible packaging. With thousands of products across dozens of packaging categories and a relentless focus on brand experience, Pethiyan isn&apos;t just a supplier — it&apos;s your packaging partner. Discover <a href="/categories/standup-pouches" class="text-blue-600 hover:underline">standup pouches</a>, <a href="/categories/ziplock-pouches" class="text-blue-600 hover:underline">ziplock bags</a>, <a href="/categories/custom-packaging" class="text-blue-600 hover:underline">custom packaging</a>, <a href="/categories/eco-packaging" class="text-blue-600 hover:underline">eco-friendly packaging</a>, and more — all built to make every shipment memorable.`;
const FALLBACK_SECTIONS: SeoSection[] = [
  {
    title: "What Can You Buy from Pethiyan?",
    content: "Pethiyan's strength lies in its incredible diversity of packaging solutions. With offerings for every industry, product type, and budget, you can explore our meticulously curated categories designed for modern brands:",
  },
  {
    title: "Standup Pouches & Flexible Packaging",
    content: `Pethiyan offers a wide range of <a href="/categories/standup-pouches" class="text-blue-600 hover:underline">standup pouches</a> designed to keep your products fresh and your brand looking premium. From resealable zip-lock styles to heat-sealed barrier pouches, our flexible packaging solutions are trusted by food, beverage, nutraceutical, and cosmetic brands alike. Choose from custom print options, matte or gloss finishes, kraft paper, foil, and clear window styles to match your product's identity perfectly.`,
  },
  {
    title: "Ziplock Bags & Resealable Packaging",
    content: `Our <a href="/categories/ziplock-pouches" class="text-blue-600 hover:underline">ziplock bags</a> provide the perfect balance of convenience and protection. Available in multiple sizes and thicknesses, these resealable bags are ideal for snacks, dried goods, pet treats, hardware components, and more. With high-barrier material options, your products stay protected from moisture, oxygen, and light — extending shelf life without compromising presentation.`,
  },
  {
    title: "Custom Packaging Solutions",
    content: `Stand out on shelves with fully <a href="/categories/custom-packaging" class="text-blue-600 hover:underline">custom packaging</a> designed exclusively for your brand. From concept to production, Pethiyan offers end-to-end custom packaging services including structural design, digital proofing, and high-resolution print. Whether you need short-run digital printing for product launches or large-scale offset runs for retail, our team delivers quality and consistency at every step.`,
  },
  {
    title: "Eco-Friendly & Sustainable Packaging",
    content: `Pethiyan is committed to a greener future. Our <a href="/categories/eco-packaging" class="text-blue-600 hover:underline">eco packaging</a> range includes compostable pouches, biodegradable mailers, recycled paper bags, and plant-based films. We help brands reduce their carbon footprint without sacrificing shelf appeal or product protection. Our sustainable packaging lines meet international compostability standards and are perfect for eco-conscious brands across food, beauty, and lifestyle categories.`,
  },
  {
    title: "Bulk Orders & Wholesale Packaging",
    content: `For businesses that need volume, Pethiyan offers competitive pricing on <a href="/bulk" class="text-blue-600 hover:underline">bulk orders</a> and <a href="/wholesale" class="text-blue-600 hover:underline">wholesale packaging</a>. Our production capacity supports FMCG companies, co-packers, contract manufacturers, and retail chains. Dedicated account managers ensure your supply chain runs smoothly with on-time delivery, consistent quality, and flexible payment terms tailored to your business.`,
  },
];

interface FooterSeoContentProps {
  title?: string;
  introHtml?: string;
  sections?: SeoSection[];
}

export default function FooterSeoContent({ title, introHtml, sections = [] }: FooterSeoContentProps) {
  const resolvedTitle = title?.trim() || FALLBACK_TITLE;
  const resolvedIntroHtml = introHtml?.trim() || FALLBACK_INTRO;
  const resolvedSections = sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <div className="bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Main heading */}
        <h2 className="text-base font-semibold mb-3 text-gray-900">
          {resolvedTitle}
        </h2>
        <div
          className="text-sm leading-relaxed mb-6 text-gray-500 [&_a]:text-blue-600 [&_a]:underline-offset-2 hover:[&_a]:underline"
          dangerouslySetInnerHTML={{ __html: resolvedIntroHtml }}
        />

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6" />

        {/* Sections */}
        <div className="space-y-5">
          {resolvedSections.map((section) => (
            <div key={section.title || section.content}>
              <h3 className="text-sm font-semibold mb-1 text-gray-900">
                {section.title}
              </h3>
              <div
                className="text-sm leading-relaxed text-gray-500 [&_a]:text-blue-600 [&_a]:underline-offset-2 hover:[&_a]:underline"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
