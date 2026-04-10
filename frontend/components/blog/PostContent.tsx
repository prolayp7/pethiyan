import type { BlogPost } from "@/lib/blog-data";

interface PostContentProps {
  post: BlogPost;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <div className="blog-prose">
      {post.sections.map((section, index) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-28">
          <h2 id={`${section.id}-heading`}>{`${index + 1}. ${section.title}`}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
