"use client";

import { usePathname } from "next/navigation";
import FooterSeoContent from "./FooterSeoContent";

interface FooterSeoWrapperProps {
  enabled: boolean;
  homepageOnly: boolean;
}

export default function FooterSeoWrapper({ enabled, homepageOnly }: FooterSeoWrapperProps) {
  const pathname = usePathname();

  if (!enabled) return null;
  if (homepageOnly && pathname !== "/") return null;

  return <FooterSeoContent />;
}
