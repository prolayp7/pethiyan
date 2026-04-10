import type { Metadata } from "next";
import BlogHomeClient from "@/components/blog/BlogHomeClient";
import { blogPosts, getFeaturedPosts, getLatestPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore packaging strategy, shipping insights, sustainability notes, and ecommerce growth playbooks from the Pethiyan editorial journal.",
};

export default function BlogPage() {
  return (
    <BlogHomeClient
      featuredPosts={getFeaturedPosts()}
      latestPosts={getLatestPosts()}
      allPosts={blogPosts}
    />
  );
}
