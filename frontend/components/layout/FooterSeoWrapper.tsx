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

  if (!enabled) return null;
  if (homepageOnly && pathname !== "/") return null;

  return <FooterSeoContent introHtml={introHtml} />;
}
