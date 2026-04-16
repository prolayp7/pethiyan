"use client";

import { usePathname } from "next/navigation";
import FooterSeoContent from "./FooterSeoContent";

type FooterSeoSection = {
  title: string;
  content: string;
};

interface FooterSeoWrapperProps {
  enabled: boolean;
  homepageOnly: boolean;
  title?: string;
  introHtml?: string;
  sections?: FooterSeoSection[];
}

export default function FooterSeoWrapper({ enabled, homepageOnly, title, introHtml, sections = [] }: FooterSeoWrapperProps) {
  const pathname = usePathname();

  if (!enabled) return null;
  if (homepageOnly && pathname !== "/") return null;

  return <FooterSeoContent title={title} introHtml={introHtml} sections={sections} />;
}
