import { getHeaderMenu } from "@/lib/api";
import NavigationMenu6, {
  type NavItem,
  type ShopDropdownItem,
  type SidebarCategory,
  type MegaProduct,
} from "./NavigationMenu6";

/* ── Price formatter ─────────────────────────────────────────── */
function formatPrice(price: number, symbol: string): string {
  return `${symbol}${price.toFixed(2)}`;
}

export default async function NavigationMenuServer() {
  const menu = await getHeaderMenu();

  if (!menu) {
    return <NavigationMenu6 />;
  }

  /* ── Map nav items ──────────────────────────────────────────── */
  const navItems: NavItem[] = menu.nav_items.map((item) => ({
    label: item.label,
    href: item.href,
    type: item.type,
    badge: item.badge,
    target: item.target,
  }));

  /* ── Map shop dropdown items ────────────────────────────────── */
  const shopItem = menu.nav_items.find((i) => i.type === "shop_dropdown");
  const shopDropdownItems: ShopDropdownItem[] =
    shopItem?.shop_dropdown_items?.map((si) => ({
      label: si.label,
      href: si.href,
      description: si.description ?? "",
      iconName: si.icon ?? "Package",
      accent: si.accent_color ?? "#1f4f8a",
    })) ?? [];

  /* ── Map mega menu panels → sidebar categories ──────────────── */
  const megaItem = menu.nav_items.find((i) => i.type === "mega_menu");

  const sidebarCategories: SidebarCategory[] =
    megaItem?.mega_menu_panels?.map((panel) => ({
      label: panel.label,
      href: panel.href,
      accent: panel.accent_color ?? "#1f4f8a",
      image: panel.image_path
        ? panel.image_path.startsWith("http")
          ? panel.image_path
          : `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}${panel.image_path}`
        : "/images/banners/1.jpg",
      tagline: panel.tagline ?? "",
      columns: panel.columns.map((col) => ({
        heading: col.heading,
        links: col.links.map((l) => ({ label: l.label, href: l.href })),
      })),
      topProducts: panel.top_products.map((p) => ({
        image: p.image,
        name: p.name,
        price: formatPrice(p.price, p.currency_symbol),
        href: `/shop`,
      })),
    })) ?? [];

  /* ── Map mega menu featured products ────────────────────────── */
  const megaFeaturedProducts: MegaProduct[] =
    megaItem?.featured_products?.map((p) => ({
      image: p.image,
      name: p.name,
      price: formatPrice(p.price, p.currency_symbol),
      href: `/shop`,
    })) ?? [];

  return (
    <NavigationMenu6
      navItems={navItems}
      shopDropdownItems={shopDropdownItems}
      sidebarCategories={sidebarCategories}
      megaFeaturedProducts={megaFeaturedProducts}
    />
  );
}
