interface CategoryBannerProps {
  imageUrl: string;
  children: React.ReactNode;
}

export default function CategoryBanner({ imageUrl, children }: CategoryBannerProps) {
  return (
    <div className="relative border-b border-(--color-border) overflow-hidden">
      {/* Plain img avoids next/image proxy — decorative background only */}
      <img
        src={imageUrl}
        alt=""
        role="presentation"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {children}
    </div>
  );
}
