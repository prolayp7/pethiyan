export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
  accent: string;
}

export interface BlogSection {
  id: string;
  title: string;
  body: string[];
}

export interface BlogAuthor {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  featured?: boolean;
  sections: BlogSection[];
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "packaging-design",
    title: "Packaging Design",
    description: "Brand-first ideas for pouches, boxes, labels, and unboxing that feel premium without wasting budget.",
    accent: "from-sky-500/20 via-blue-500/10 to-cyan-400/20",
  },
  {
    slug: "shipping-logistics",
    title: "Shipping & Logistics",
    description: "Practical guidance for selecting mailers, reducing damage, and building smoother fulfillment workflows.",
    accent: "from-emerald-500/20 via-lime-500/10 to-teal-400/20",
  },
  {
    slug: "materials-sustainability",
    title: "Materials & Sustainability",
    description: "Thoughtful breakdowns of films, kraft, compostables, recyclability, and what claims actually mean.",
    accent: "from-amber-400/20 via-orange-500/10 to-yellow-300/20",
  },
  {
    slug: "growth-playbooks",
    title: "Growth Playbooks",
    description: "Operational and merchandising lessons for ecommerce brands scaling product launches and repeat orders.",
    accent: "from-fuchsia-500/20 via-pink-500/10 to-rose-400/20",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-standup-pouch-for-growing-brands",
    title: "How To Choose The Right Standup Pouch For A Growing Brand",
    excerpt:
      "A practical guide to balancing shelf presence, barrier protection, fill volume, and unit economics when your SKU line is expanding fast.",
    featuredImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "April 2, 2026",
    readingTime: "6 min read",
    category: "packaging-design",
    tags: ["standup pouches", "brand systems", "d2c"],
    featured: true,
    author: {
      name: "Naina Verma",
      role: "Editorial Lead, Packaging Strategy",
      bio:
        "Naina works with emerging consumer brands on packaging systems that scale from first launch to national fulfillment without losing clarity or polish.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "why-format-matters",
        title: "Start With The Real Use Case, Not The Trend",
        body: [
          "A standup pouch only performs well when the product, fill weight, channel, and shelf context are considered together. Teams often jump straight to matte finishes or windows because they look modern, but the right structure comes from how the pack will be touched, stored, shipped, and reopened.",
          "Before locking a format, document three things: how the customer first encounters the product, how long it stays open after purchase, and what the packaging must protect against. That short brief saves weeks of redesign later.",
        ],
      },
      {
        id: "barrier-cost",
        title: "Match Barrier Needs To Actual Product Risk",
        body: [
          "Coffee, spice blends, powders, and snack mixes all behave differently. A high-barrier laminate may be essential for one SKU and needless cost for another. If your pouch line is growing, organize products by barrier need instead of treating every item as a custom one-off.",
          "That gives you a cleaner purchasing strategy and a more consistent visual system across the shelf or category page.",
        ],
      },
      {
        id: "brand-system",
        title: "Create A Visual System That Survives Expansion",
        body: [
          "As you add flavors or sizes, packaging should still feel unmistakably yours. Use one repeatable structure for hierarchy: brand first, product descriptor second, variant cue third. Keep typography disciplined and let color or illustration do the expressive work.",
          "A brand system is what lets your next five SKUs launch quickly instead of restarting the design conversation every time.",
        ],
      },
    ],
  },
  {
    slug: "reducing-shipping-damage-with-better-mailers-and-inserts",
    title: "Reducing Shipping Damage With Better Mailers And Inserts",
    excerpt:
      "Why most shipping damage starts before the courier touches the parcel, and how to rethink pack fit, padding, and crush resistance.",
    featuredImage:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "March 26, 2026",
    readingTime: "5 min read",
    category: "shipping-logistics",
    tags: ["mailers", "returns", "fulfillment"],
    featured: true,
    author: {
      name: "Arjun Menon",
      role: "Operations Writer",
      bio:
        "Arjun writes about fulfillment systems, warehouse decisions, and how packaging can reduce damage, delay, and returns for ecommerce brands.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "damage-patterns",
        title: "Most Damage Is A Fit Problem",
        body: [
          "Loose void space causes products to shift, corners to split, and pressure points to form in transit. When teams review damage rates, the issue is often blamed on courier handling when the pack-out itself was under-controlled.",
          "The fastest win is tighter pack fit. Right-sized mailers and inserts reduce movement, create better stacking behavior, and help parcels absorb impact more evenly.",
        ],
      },
      {
        id: "pack-testing",
        title: "Build A Lightweight Testing Routine",
        body: [
          "You do not need a giant QA lab to improve. Run repeatable drop tests with the same pack configurations, note which edges fail first, and compare damaged units against your cost of replacement. That creates a clear case for better materials or inserts.",
        ],
      },
      {
        id: "experience",
        title: "Protection And Presentation Should Work Together",
        body: [
          "A protective shipper should still feel intentional when opened. Branded inserts, message cards, and neat pack orientation improve trust without compromising stability. The best shipping package looks calm, organized, and ready for repeat purchase.",
        ],
      },
    ],
  },
  {
    slug: "what-sustainable-packaging-claims-customers-actually-understand",
    title: "What Sustainable Packaging Claims Customers Actually Understand",
    excerpt:
      "Clearer sustainability messaging leads to more trust than broad eco claims. Here is how to say less, but mean more.",
    featuredImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "March 17, 2026",
    readingTime: "7 min read",
    category: "materials-sustainability",
    tags: ["sustainability", "materials", "customer trust"],
    author: {
      name: "Sana Kapoor",
      role: "Materials Research Editor",
      bio:
        "Sana translates technical packaging topics into customer-friendly language for brands making smarter material decisions.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "clarity",
        title: "Specific Beats Vague Every Time",
        body: [
          "Customers respond better to precise claims like recyclable where facilities exist or made with reduced virgin plastic than generic eco-friendly labels. Precision signals honesty and reduces confusion.",
        ],
      },
      {
        id: "context",
        title: "Give One Clear Action The Customer Can Take",
        body: [
          "If a pack is recyclable, say how. If a material must be disposed of in a special stream, make that visible. Sustainability messaging feels credible when it includes a practical next step instead of a marketing slogan.",
        ],
      },
    ],
  },
  {
    slug: "launching-a-seasonal-product-line-without-rebuilding-your-packaging-system",
    title: "Launching A Seasonal Product Line Without Rebuilding Your Packaging System",
    excerpt:
      "A smart packaging system lets your seasonal launches feel fresh while keeping vendors, print files, and production predictable.",
    featuredImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "March 12, 2026",
    readingTime: "4 min read",
    category: "growth-playbooks",
    tags: ["product launch", "seasonal campaigns", "creative ops"],
    author: {
      name: "Rhea D'Souza",
      role: "Brand Growth Editor",
      bio:
        "Rhea focuses on campaign systems, launch planning, and the intersection of packaging, merchandising, and repeat purchase.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "modular-branding",
        title: "Build Modular Design, Not One-Off Art",
        body: [
          "When a seasonal launch depends on entirely new dielines, print logic, and approvals, it slows everything down. Keep your base structure consistent and reserve a small layer for campaign expression: color, sticker zone, sleeve, or insert.",
        ],
      },
      {
        id: "ops-alignment",
        title: "Treat Packaging Like A Launch System",
        body: [
          "Creative teams move faster when operations constraints are visible early. Shared specifications for size, finish, print area, and vendor capabilities turn launch planning into a repeatable playbook instead of a scramble.",
        ],
      },
    ],
  },
  {
    slug: "five-ways-to-make-your-unboxing-feel-more-premium-without-raising-costs",
    title: "Five Ways To Make Your Unboxing Feel More Premium Without Raising Costs",
    excerpt:
      "Premium does not always mean expensive. Often it comes from pacing, hierarchy, and small details that make a package feel intentional.",
    featuredImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "March 4, 2026",
    readingTime: "5 min read",
    category: "packaging-design",
    tags: ["unboxing", "customer experience", "brand systems"],
    author: {
      name: "Naina Verma",
      role: "Editorial Lead, Packaging Strategy",
      bio:
        "Naina works with emerging consumer brands on packaging systems that scale from first launch to national fulfillment without losing clarity or polish.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "premium-cues",
        title: "Use Fewer, Sharper Signals",
        body: [
          "A cleaner reveal, a short welcome message, a controlled color palette, and better product orientation often do more than extra decoration. Premium experiences feel considered, not crowded.",
        ],
      },
      {
        id: "texture",
        title: "Texture And Contrast Matter",
        body: [
          "A matte label against a soft-touch pouch, a crisp insert on thicker stock, or a restrained foil accent can elevate the experience without a major materials shift across the entire system.",
        ],
      },
    ],
  },
  {
    slug: "when-to-switch-from-generic-boxes-to-custom-delivery-packaging",
    title: "When To Switch From Generic Boxes To Custom Delivery Packaging",
    excerpt:
      "Custom shipping packaging starts paying off when it solves both operational friction and brand inconsistency at the same time.",
    featuredImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "February 24, 2026",
    readingTime: "6 min read",
    category: "shipping-logistics",
    tags: ["boxes", "custom packaging", "ops"],
    author: {
      name: "Arjun Menon",
      role: "Operations Writer",
      bio:
        "Arjun writes about fulfillment systems, warehouse decisions, and how packaging can reduce damage, delay, and returns for ecommerce brands.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    sections: [
      {
        id: "timing",
        title: "Switch When Volume And Complexity Start To Hurt",
        body: [
          "If the warehouse is improvising with too many generic sizes, pack-out slows down and presentation gets inconsistent. That is usually the signal that a branded, better-fitted custom shipper will save more than it costs.",
        ],
      },
      {
        id: "decision-framework",
        title: "Evaluate Cost Per Shipment, Not Just Box Price",
        body: [
          "The right comparison includes labor time, void fill, damage rates, and how well the package reflects the product inside. Custom packaging is a systems decision, not only a print decision.",
        ],
      },
    ],
  },
];

export function getFeaturedPosts() {
  return blogPosts.filter((post) => post.featured);
}

export function getLatestPosts() {
  return [...blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return blogCategories.find((category) => category.slug === slug);
}

export function getTagBySlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPostsByCategory(slug: string) {
  return blogPosts.filter((post) => post.category === slug);
}

export function getPostsByTag(tagSlug: string) {
  const normalized = tagSlug.toLowerCase().replace(/-/g, " ");
  return blogPosts.filter((post) => post.tags.some((tag) => tag.toLowerCase() === normalized));
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const aScore = (a.category === post.category ? 2 : 0) + a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bScore = (b.category === post.category ? 2 : 0) + b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}
