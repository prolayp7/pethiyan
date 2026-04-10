import BlogCard from "@/components/blog/BlogCard";
import Container from "@/components/layout/Container";
import type { BlogPost } from "@/lib/blog-data";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/60 py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Recommended Reading</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Related posts</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
