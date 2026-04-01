"use client";

import { useId } from "react";
import { Phone } from "lucide-react";

interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

// Indian mobile: starts with 6–9, exactly 10 digits
export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

export default function MobileInput({
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: MobileInputProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, max 10
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(digits);
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">
        Mobile number
      </label>

      <div
        className={`flex items-center rounded-xl border-2 transition-colors bg-gray-50 overflow-hidden ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus-within:border-(--color-primary) focus-within:bg-white"
        }`}
      >
        {/* +91 prefix */}
        <div className="flex items-center gap-1.5 pl-4 pr-3 shrink-0 border-r border-gray-200">
          <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-gray-500 select-none">+91</span>
        </div>

        {/* Number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter 10-digit mobile number"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="tel-national"
          maxLength={10}
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none placeholder-gray-400 disabled:cursor-not-allowed tabular-nums tracking-wider"
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
