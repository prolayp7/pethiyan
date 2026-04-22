import React from 'react';

type PMNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

type Props = {
  doc: unknown; // ProseMirror/TipTap JSON (editor.getJSON())
};

type CustomPageBlock = {
  key?: string;
  block_type?: "text" | "image" | "video";
  eyebrow?: string;
  heading?: string;
  body_html?: string;
  media_position?: "left" | "right" | "top";
  image_url?: string;
  video_url?: string;
};

function renderMarks(text: string, marks?: PMNode['marks']) {
  if (!marks || marks.length === 0) return text;
  return marks.reduce((acc, mark) => {
    if (mark.type === 'bold' || mark.type === 'strong') return <strong>{acc}</strong>;
    if (mark.type === 'italic' || mark.type === 'em') return <em>{acc}</em>;
    if (mark.type === 'strike' || mark.type === 'strike_through') return <del>{acc}</del>;
    if (mark.type === 'code') return <code className="bg-gray-100 px-1 rounded">{acc}</code>;
    const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : null;
    if (mark.type === 'link' && href) return <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{acc}</a>;
    return acc;
  }, text as React.ReactNode);
}

function renderInline(node: PMNode, key?: number): React.ReactNode {
  if (node.type === 'text') {
    return <React.Fragment key={key}>{renderMarks(node.text ?? '', node.marks)}</React.Fragment>;
  }

  if (node.type === 'image') {
    const src = typeof node.attrs?.src === 'string' ? node.attrs.src : (typeof node.attrs?.srcset === 'string' ? node.attrs.srcset : '');
    const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : '';
    return (
      <img key={key} src={src} alt={alt} className="max-w-full h-auto rounded mb-4" />
    );
  }

  // fallback for inline nodes with children
  if (node.content) {
    return node.content.map((n, i) => renderInline(n, i));
  }

  return null;
}

function renderBlock(node: PMNode, idx: number): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={idx} className="text-base leading-7 mb-4 text-gray-800">
          {node.content?.map((n, i) => renderInline(n, i))}
        </p>
      );

    case 'heading': {
      const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 2;
      const tagName = `h${Math.min(4, Math.max(1, level))}`;
      const className = level <= 2 ? 'text-2xl font-semibold mb-4' : 'text-xl font-semibold mb-3';
      const Tag = tagName as any;
      return React.createElement(Tag, { key: idx, className: `${className} text-gray-900` }, node.content?.map((n, i) => renderInline(n, i)));
    }

    case 'image':
      return (
        <div key={idx} className="my-4">
          <img src={typeof node.attrs?.src === 'string' ? node.attrs.src : ''} alt={typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''} className="w-full h-auto rounded" />
        </div>
      );

    case 'bulletList':
      return (
        <ul key={idx} className="list-disc pl-6 mb-4 text-gray-800">
          {node.content?.map((li, i) => (
            <li key={i} className="mb-1">{li.content?.map((n, j) => renderInline(n, j))}</li>
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={idx} className="list-decimal pl-6 mb-4 text-gray-800">
          {node.content?.map((li, i) => (
            <li key={i} className="mb-1">{li.content?.map((n, j) => renderInline(n, j))}</li>
          ))}
        </ol>
      );

    case 'blockquote':
      return (
        <blockquote key={idx} className="border-l-4 pl-4 italic text-gray-600 mb-4">
          {node.content?.map((n, i) => renderInline(n, i))}
        </blockquote>
      );

    case 'codeBlock':
      return (
        <pre key={idx} className="bg-gray-100 p-4 rounded mb-4 overflow-auto text-sm">
          <code>{node.content?.map(n => n.text ?? '').join('\n')}</code>
        </pre>
      );

    case 'horizontalRule':
      return <hr key={idx} className="my-6 border-gray-200" />;

    case 'hardBreak':
      return <br key={idx} />;

    default:
      // render children if unknown block
      if (node.content) {
        return <React.Fragment key={idx}>{node.content.map((n, i) => renderBlock(n, i))}</React.Fragment>;
      }
      return null;
  }
}

export default function PageRenderer({ doc }: Props) {
  if (!doc) return null;

  if (Array.isArray(doc) && doc.some((item) => item && typeof item === "object" && "block_type" in (item as Record<string, unknown>))) {
    return (
      <div className="space-y-10">
        {(doc as CustomPageBlock[]).map((block, index: number) => {
          const type = block.block_type ?? "text";
          const mediaPosition = block.media_position ?? "right";
          const hasImage = type === "image" && !!block.image_url;
          const hasVideo = type === "video" && !!block.video_url;
          const hasMedia = hasImage || hasVideo;
          const mediaNode = hasImage ? (
            <img
              src={block.image_url}
              alt={block.heading || "Page media"}
              className="w-full rounded-2xl object-cover shadow-sm"
            />
          ) : hasVideo ? (
            <video
              src={block.video_url}
              className="w-full rounded-2xl shadow-sm"
              controls
              playsInline
              preload="metadata"
            />
          ) : null;

          const textNode = (
            <div>
              {block.eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-primary)">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.heading ? (
                <h2 className="mb-4 text-3xl font-extrabold text-(--color-secondary)">{block.heading}</h2>
              ) : null}
              {block.body_html ? (
                <div
                  className="text-base leading-7 text-gray-700 [&_a]:text-(--color-primary) [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-(--color-primary)/20 [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: block.body_html }}
                />
              ) : null}
            </div>
          );

          if (!hasMedia) {
            return (
              <section key={block.key ?? index} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                {textNode}
              </section>
            );
          }

          if (mediaPosition === "top") {
            return (
              <section key={block.key ?? index} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-6 overflow-hidden rounded-2xl">{mediaNode}</div>
                {textNode}
              </section>
            );
          }

          const mediaFirst = mediaPosition === "left";

          return (
            <section key={block.key ?? index} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                <div className={mediaFirst ? "lg:order-1" : "lg:order-2"}>{mediaNode}</div>
                <div className={mediaFirst ? "lg:order-2" : "lg:order-1"}>{textNode}</div>
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  const pmDoc = doc as PMNode | PMNode[];
  const content = Array.isArray(pmDoc)
    ? pmDoc
    : pmDoc.type === 'doc'
      ? pmDoc.content || []
      : [pmDoc];
  return <div className="prose prose-slate max-w-none">{content.map((node: PMNode, i: number) => renderBlock(node, i))}</div>;
}
