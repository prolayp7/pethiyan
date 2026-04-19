import { getAnnouncementBar } from "@/lib/api";
import OfferTickerClient from "./OfferTickerClient";

const DEFAULT_ITEMS = [
  "🚚 Free Shipping on Orders Above $50",
  "⚡ Fast Global Delivery Available",
  "📦 Premium Packaging for Modern Brands",
  "🎁 Bundle & Save — Buy 3 Get 1 Free",
  "🌿 100% Eco-Friendly Material Options",
];

export default async function OfferTicker() {
  const data = await getAnnouncementBar();

  if (data && !data.ticker.active) return null;

  const items = data?.ticker.items?.length ? data.ticker.items : DEFAULT_ITEMS;

  return <OfferTickerClient items={items} />;
}
