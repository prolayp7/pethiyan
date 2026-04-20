"use client";

import React from "react";

interface VariantTag {
  value: string;
  variantId: number;
}

interface Props {
  attributes?: Record<string, any> | null;
  colors?: Array<string | { color: string; variantId: number }> | null;
  sizes?: VariantTag[] | null;
  weights?: VariantTag[] | null;
  hoveredVariantId?: number | null;
  onHoverVariant?: (variantId: number | null) => void;
  variantImageSet?: Set<number> | null;
  hoverEnabled?: boolean;
  showColorSwatches?: boolean;
  maxColors?: number;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  Transparent: "#c8e6f5",
  Brown: "#8B6347",
  Colorful: "linear-gradient(135deg,#f44,#4f4,#44f)",
  Black: "#111",
  White: "#f0f0f0",
  Red: "#e53",
  Blue: "#36f",
  Green: "#4b8",
  Yellow: "#fb0",
  Gray: "#9ca3af",
  Grey: "#9ca3af",
  "Light Gray": "#d1d5db",
  "Light Grey": "#d1d5db",
  "Dark Gray": "#374151",
  "Dark Grey": "#374151",
  Silver: "#c0c0c0",
  Orange: "#f97316",
  Purple: "#a855f7",
  Pink: "#ec4899",
  Beige: "#e8dcc8",
  Navy: "#1e3a5f",
  Maroon: "#800000",
};

// Helper: format weight values with unit parsing (module-level so all components can use it)
export function formatWeight(w: string) {
  const s = String(w).trim();
  if (!s) return s;
  // explicit unit provided
  const m = s.match(/^\s*(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gram|grams)\s*$/i);
  if (m) {
    const n = parseFloat(m[1]);
    const unit = m[2].toLowerCase();
    if (/^kg|kgs|kilogram/.test(unit)) return `${Number(n.toFixed(2))} kg`;
    // grams
    if (n >= 1000) return `${(n / 1000).toFixed(2)} kg`;
    return `${Number(n)} g`;
  }
  // plain numeric value
  if (/^\d+(?:\.\d+)?$/.test(s)) {
    const n = parseFloat(s);
    // treat decimals as kilograms (e.g. 0.2 -> 0.20 kg), integers < 1000 as grams
    if (s.includes('.') || n < 1) return `${Number(n.toFixed(2))} kg`;
    if (n >= 1000) return `${(n / 1000).toFixed(2)} kg`;
    return `${Number(n)} g`;
  }
  // fallback: return original
  return s;
}

export default function AttributePills({ attributes, colors, showColorSwatches = true, maxColors = 5, className = "" }: Props) {
  // If explicit color list provided, render swatches
  if (Array.isArray(colors) && colors.length > 0) {
    const visible = colors.slice(0, maxColors);
    return (
      <div className={`flex items-center gap-2 mt-1 flex-wrap ${className}`}>
        {visible.map((c: any, idx: number) => {
          // Support both string[] and { color, variantId }[] for backwards compatibility
          const colorValue = typeof c === "string" ? c : (c?.color ?? "#aaa");
          return (
            <span
              key={`${idx}-${colorValue}`}
              title={String(colorValue)}
              className="w-3 h-3 rounded-full border border-black/10 shrink-0"
              style={{ background: COLOR_MAP[String(colorValue)] ?? String(colorValue) ?? "#aaa" }}
            />
          );
        })}
        {colors.length > maxColors && (
          <span className="text-[10px] text-gray-400">+{colors.length - maxColors}</span>
        )}
      </div>
    );
  }

  if (!attributes || typeof attributes !== "object") return null;

  // Prefer showing color attribute first if present
  const entries = Object.entries(attributes).filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (entries.length === 0) return null;

  // Move color to front
  entries.sort(([kA], [kB]) => {
    if (String(kA).toLowerCase() === "color") return -1;
    if (String(kB).toLowerCase() === "color") return 1;
    return 0;
  });

  // If color swatches are shown separately, do not render color as a text pill to avoid duplication
  let filteredEntries = entries;
  if (showColorSwatches) {
    filteredEntries = entries.filter(([k]) => String(k).toLowerCase() !== "color");
  }

  

  return (
    <div className={`flex items-center gap-2 mt-1 flex-wrap ${className}`}>
      {filteredEntries.map(([k, v]) => {
        const key = String(k).toLowerCase();
        const value = String(v);
        // color is omitted when swatches are enabled; otherwise show as pill
        if (!showColorSwatches && key === "color") {
          const bg = COLOR_MAP[value] ?? value ?? "#aaa";
          return <span key={k} title={value} className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: bg }} />;
        }
        return (
          <span key={k} className="text-[12px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border">
            {value}
          </span>
        );
      })}

      {/* sizes in attributes should not be directly rendered here */}
    </div>
  );
}

// Note: keep a separate exported component usage below for sizes/weights with hover support

export function AttributePillsWithVariants({
  colors,
  sizes,
  weights,
  hoveredVariantId,
  onHoverVariant,
  variantImageSet,
  hoverEnabled = false,
  showColorSwatches = true,
  maxColors = 5,
  maxSizes = 4,
  maxWeights = 4,
  className = "",
}: {
  colors?: Array<string | { color: string; variantId: number }> | null;
  sizes?: VariantTag[] | null;
  weights?: VariantTag[] | null;
  hoveredVariantId?: number | null;
  onHoverVariant?: (variantId: number | null) => void;
  variantImageSet?: Set<number> | null;
  hoverEnabled?: boolean;
  showColorSwatches?: boolean;
  maxColors?: number;
  maxSizes?: number;
  maxWeights?: number;
  className?: string;
}) {
  const renderHover = (variantId: number | null) => {
    if (!onHoverVariant) return;
    if (variantId == null) { onHoverVariant(null); return; }
    if (!hoverEnabled) return;
    if (variantImageSet && !variantImageSet.has(variantId)) return;
    onHoverVariant(variantId);
  };

  return (
    <div className={`flex items-center gap-2 mt-1 flex-wrap ${className}`}>
      {/* colors */}
      {Array.isArray(colors) && colors.length > 0 && (() => {
        const visible = colors.slice(0, maxColors);
        return (
          <div className="flex items-center gap-2">
            {visible.map((c: any, idx: number) => {
              // support legacy string color or object { color, variantId }
              const colorValue = typeof c === "string" ? c : (c?.color ?? "");
              const variantId = typeof c === "string" ? (sizes?.[idx]?.variantId ?? null) : (c?.variantId ?? null);
              return (
                <button
                  key={`c-${idx}-${String(colorValue)}`}
                  onMouseEnter={() => renderHover(variantId)}
                  onFocus={() => renderHover(variantId)}
                  onMouseLeave={() => renderHover(null)}
                  title={String(colorValue)}
                  aria-label={String(colorValue)}
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ background: COLOR_MAP[String(colorValue)] ?? String(colorValue) ?? "#aaa" }}
                />
              );
            })}
          </div>
        );
      })()}

      {/* sizes */}
      {Array.isArray(sizes) && sizes.length > 0 && (() => {
        const visibleSizes = sizes.slice(0, maxSizes);
        const hiddenCount = sizes.length - visibleSizes.length;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {visibleSizes.map((s) => (
              <button
                type="button"
                key={`s-${s.variantId}`}
                onMouseEnter={() => renderHover(s.variantId)}
                onFocus={() => renderHover(s.variantId)}
                onMouseLeave={() => renderHover(null)}
                className={`text-[12px] px-2.5 py-1 rounded-full border bg-white ${hoveredVariantId === s.variantId ? 'ring-2 ring-offset-1 ring-[#17396f]' : ''}`}
                title={s.value}
                aria-label={`Size ${s.value}`}
              >
                {s.value}
              </button>
            ))}
            {hiddenCount > 0 && (
              <span className="text-[10px] text-gray-400">+{hiddenCount} more</span>
            )}
          </div>
        );
      })()}

      {/* weights */}
      {Array.isArray(weights) && weights.length > 0 && (() => {
        const visibleWeights = weights.slice(0, maxWeights);
        const hiddenCount = weights.length - visibleWeights.length;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {visibleWeights.map((w) => (
              <button
                type="button"
                key={`w-${w.variantId}`}
                onMouseEnter={() => renderHover(w.variantId)}
                onFocus={() => renderHover(w.variantId)}
                onMouseLeave={() => renderHover(null)}
                className={`text-[12px] px-2.5 py-1 rounded-full border bg-white ${hoveredVariantId === w.variantId ? 'ring-2 ring-offset-1 ring-[#17396f]' : ''}`}
                title={w.value}
                aria-label={`Weight ${w.value}`}
              >
                {formatWeight(String(w.value))}
              </button>
            ))}
            {hiddenCount > 0 && (
              <span className="text-[10px] text-gray-400">+{hiddenCount} more</span>
            )}
          </div>
        );
      })()}
    </div>
  );
}
