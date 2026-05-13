"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = dynamic(() => import("./SearchBar"), { ssr: false });

export default function DeferredSearchBar() {
  const [active, setActive] = useState(false);

  if (active) {
    return <SearchBar />;
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      onFocus={() => setActive(true)}
      aria-label="Open search"
      className="relative flex w-full items-center rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-left transition-all duration-200 hover:border-gray-300"
    >
      <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
      <span className="ml-3 text-sm text-gray-600">
        Search for products, packaging, pouches...
      </span>
    </button>
  );
}
