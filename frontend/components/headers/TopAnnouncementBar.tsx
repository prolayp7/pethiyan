export default function TopAnnouncementBar({ text }: { text: string }) {
  return (
    <div
      className="bg-(--color-secondary) text-white text-center py-1.5 px-4"
      role="banner"
      aria-label="Site announcement"
    >
      <p className="text-xs sm:text-sm font-medium tracking-wide">{text}</p>
    </div>
  );
}
