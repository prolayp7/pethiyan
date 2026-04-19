"use client";

import React from "react";

interface Props {
  attributes?: Record<string, any> | null;
  colors?: string[] | null;
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

export default function AttributePills({ attributes, colors, showColorSwatches = true, maxColors = 5, className = "" }: Props) {
  // If explicit color list provided, render swatches
  if (Array.isArray(colors) && colors.length > 0) {
    const visible = colors.slice(0, maxColors);
    return (
      <div className={`flex items-center gap-2 mt-1 flex-wrap ${className}`}>
        {visible.map((c) => (
          <span key={c} title={c} className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: COLOR_MAP[c] ?? c ?? "#aaa" }} />
        ))}
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

  return (
    <div className={`flex items-center gap-2 mt-1 flex-wrap ${className}`}>
      {entries.map(([k, v]) => {
        const key = String(k).toLowerCase();
        const value = String(v);
        if (showColorSwatches && key === "color") {
          const bg = COLOR_MAP[value] ?? value ?? "#aaa";
          return <span key={k} title={value} className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: bg }} />;
        }
        return (
          <span key={k} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            {value}
          </span>
        );
      })}
    </div>
  );
}
