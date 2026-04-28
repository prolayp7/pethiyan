"use client";

import { useRef, useId, useEffect, KeyboardEvent, ClipboardEvent } from "react";

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;           // e.g. "123456" (partial OK)
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: OtpInputProps) {
  const baseId = useId();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  const focusIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, i));
    inputRefs.current[clamped]?.focus();
  };

  // Focus last box when a wrong-OTP error appears so user can backspace immediately
  useEffect(() => {
    if (error) focusIndex(OTP_LENGTH - 1);
  }, [error]);

  const handleChange = (index: number, raw: string) => {
    // Take only the last digit typed (handles replace-while-focused)
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d)).join("").replace(/ /g, "");
    onChange(next);
    if (digit && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]?.trim()) {
        // Current box has a real digit — clear it, stay here
        const next = digits.map((d, i) => (i === index ? "" : d)).join("").replace(/ /g, "");
        onChange(next);
      } else if (index > 0) {
        // Current box is empty — clear the previous box and move focus there
        const next = digits.map((d, i) => (i === index - 1 ? "" : d)).join("").replace(/ /g, "");
        onChange(next);
        focusIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    // Focus the box after the last pasted digit
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between gap-2"
        role="group"
        aria-label="One-time password input"
      >
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            id={`${baseId}-${i}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[i]?.trim() || ""}
            autoFocus={autoFocus && i === 0}
            disabled={disabled}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`OTP digit ${i + 1}`}
            aria-invalid={!!error}
            className={`
              w-11 h-13 sm:w-12 sm:h-14 rounded-xl border-2 text-center text-lg font-bold
              outline-none transition-all duration-150 tabular-nums
              disabled:cursor-not-allowed disabled:opacity-50
              ${
                error
                  ? "border-red-400 bg-red-50 text-red-700"
                  : digits[i]?.trim()
                  ? "border-blue-700 bg-blue-50 text-blue-800"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-700 focus:bg-white focus:shadow-sm"
              }
            `}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
