interface FooterBottomLegalBarProps {
  copyrightText?: string;
}

export default function FooterBottomLegalBar({ copyrightText }: FooterBottomLegalBarProps) {
  const paymentMethods = ["Visa", "Rupay", "Paytm", "PhonePay", "GPay", "NetBanking"];
  const resolvedCopyrightText = copyrightText?.trim() ?? "";

  return (
    <div className="border-t border-white/5">
      <div
        className="h-px w-full -mt-px bg-[linear-gradient(to_right,transparent,rgba(76,175,80,0.1)_30%,rgba(76,175,80,0.1)_70%,transparent)]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* Single row: copyright left · payment chips right */}
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">

          {/* Copyright */}
          {resolvedCopyrightText ? (
            <p className="text-[12px] font-medium text-white/50">
              {resolvedCopyrightText}
            </p>
          ) : null}

          {/* Payment method chips */}
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center justify-center rounded px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-white bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]"
              >
                {method}
              </span>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
