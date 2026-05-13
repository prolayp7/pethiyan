"use client";

import { usePathname } from "next/navigation";
import FooterSeoContent from "./FooterSeoContent";

interface FooterSeoWrapperProps {
  enabled: boolean;
  homepageOnly: boolean;
  introHtml?: string;
}

export default function FooterSeoWrapper({ enabled, homepageOnly, introHtml }: FooterSeoWrapperProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const shouldRender = enabled && (!homepageOnly || isHomepage);

  if (!shouldRender) return null;

  return <FooterSeoContent introHtml={introHtml} />;
}
