"use client";

import { createContext, useContext } from "react";
import type { ApiSystemSettings } from "@/lib/api";

const DEFAULTS: ApiSystemSettings = {
  appName: "Pethiyan",
  logo: null,
  favicon: null,
  smsOtpEnabled:   false,
  emailOtpEnabled: false,
  showVariantColorsInGrid: true,
  showGstInGrid:           false,
  showCategoryNameInGrid:  true,
  showMinQtyInGrid:        false,
};

const SiteSettingsContext = createContext<ApiSystemSettings>(DEFAULTS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: ApiSystemSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): ApiSystemSettings {
  return useContext(SiteSettingsContext);
}
