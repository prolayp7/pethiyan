interface FooterSeoContentProps {
  introHtml?: string;
}

export default function FooterSeoContent({ introHtml }: FooterSeoContentProps) {
  const resolvedIntroHtml = introHtml?.trim() ?? "";

  if (!resolvedIntroHtml) {
    return null;
  }

  return (
    <div className="bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="footer-seo-prose"
          dangerouslySetInnerHTML={{ __html: resolvedIntroHtml }}
        />
      </div>
    </div>
  );
}
