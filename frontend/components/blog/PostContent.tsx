"use client";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
