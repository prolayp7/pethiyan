import Link from "next/link";

const posts = [
  {
    id: 1,
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    accent: "rgba(76,175,80,0.25)",
    tag: "New Drop",
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #2d1b00 0%, #4a2f00 50%, #3d2400 100%)",
    accent: "rgba(255,153,0,0.2)",
    tag: "Custom",
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #142840 100%)",
    accent: "rgba(31,79,138,0.35)",
    tag: "Eco Line",
  },
  {
    id: 4,
    bg: "linear-gradient(135deg, #1a0a1e 0%, #2d0f35 50%, #1f0a28 100%)",
    accent: "rgba(180,80,220,0.2)",
    tag: "Wholesale",
  },
  {
    id: 5,
    bg: "linear-gradient(135deg, #001a0a 0%, #00260f 50%, #001f0c 100%)",
    accent: "rgba(76,175,80,0.3)",
    tag: "Standup",
  },
  {
    id: 6,
    bg: "linear-gradient(135deg, #1e1000 0%, #302000 50%, #251800 100%)",
    accent: "rgba(220,160,40,0.2)",
    tag: "Ziplock",
  },
  {
    id: 7,
    bg: "linear-gradient(135deg, #0d1a0d 0%, #162416 50%, #101c10 100%)",
    accent: "rgba(100,200,100,0.2)",
    tag: "Bulk",
  },
  {
    id: 8,
    bg: "linear-gradient(135deg, #1a0a0a 0%, #2e1010 50%, #200c0c 100%)",
    accent: "rgba(220,60,60,0.18)",
    tag: "Limited",
  },
];

function PostCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
      style={{ width: 220, height: 220 }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ background: post.bg }}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${post.accent} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px)",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-20"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border"
          style={{
            color: "rgba(255,255,255,0.6)",
            borderColor: "rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          {post.tag}
        </span>

        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.08)" }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
          >
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="6"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-2xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderColor: "rgba(76,175,80,0.25)" }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function SocialsStrip() {
  return (
    <section
      className="relative bg-[#050810] overflow-hidden"
      aria-label="Social media feed"
    >
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.06) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
              style={{ letterSpacing: "-0.03em" }}
            >
              SOCIALS
            </h2>
            <p
              className="mt-2 text-xs tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              @pethiyanpackaging
            </p>
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white hover:text-[#050810]"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
            aria-label="Follow us on social media"
          >
            Follow Us
          </Link>
        </div>
      </div>

      <div className="relative pb-14">
        <div
          className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #050810 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #050810 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div
          className="flex items-center gap-4 hover:[animation-play-state:paused]"
          style={{
            animation: "ticker-scroll 35s linear infinite",
            width: "max-content",
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          <span aria-hidden="true" className="contents">
            {posts.map((post) => (
              <PostCard key={`dup-${post.id}`} post={post} />
            ))}
          </span>
        </div>
      </div>

      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 75%, transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
