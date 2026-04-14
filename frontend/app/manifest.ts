import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pethiyan — The Power of Perfect Packaging",
    short_name: "Pethiyan",
    description: "Premium packaging products delivered across India. Shop pouches, kraft bags, jars and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#1f4f8a",
    lang: "en-IN",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
