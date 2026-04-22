import React from 'react';

type PMNode = {
  type: string;
  attrs?: any;
  content?: PMNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: any }>;
};

type Props = {
  doc: any; // ProseMirror/TipTap JSON (editor.getJSON())
};

function renderMarks(text: string, marks?: PMNode['marks']) {
  if (!marks || marks.length === 0) return text;
  return marks.reduce((acc, mark) => {
    if (mark.type === 'bold' || mark.type === 'strong') return <strong>{acc}</strong>;
    if (mark.type === 'italic' || mark.type === 'em') return <em>{acc}</em>;
    if (mark.type === 'strike' || mark.type === 'strike_through') return <del>{acc}</del>;
    if (mark.type === 'code') return <code className="bg-gray-100 px-1 rounded">{acc}</code>;
    if (mark.type === 'link' && mark.attrs?.href) return <a href={mark.attrs.href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{acc}</a>;
    return acc;
  }, text as any);
}

function renderInline(node: PMNode, key?: number): React.ReactNode {
  if (node.type === 'text') {
    return <React.Fragment key={key}>{renderMarks(node.text ?? '', node.marks)}</React.Fragment>;
  }

  if (node.type === 'image') {
    const src = node.attrs?.src || node.attrs?.srcset || '';
    const alt = node.attrs?.alt || '';
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
      const level = node.attrs?.level || 2;
      const tagName = `h${Math.min(4, Math.max(1, level))}`;
      const className = level <= 2 ? 'text-2xl font-semibold mb-4' : 'text-xl font-semibold mb-3';
      const Tag: any = tagName;
      return React.createElement(Tag, { key: idx, className: `${className} text-gray-900` }, node.content?.map((n, i) => renderInline(n, i)));
    }

    case 'image':
      return (
        <div key={idx} className="my-4">
          <img src={node.attrs?.src} alt={node.attrs?.alt || ''} className="w-full h-auto rounded" />
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
  const content = doc.type === 'doc' ? doc.content || [] : doc;
  return <div className="prose prose-slate max-w-none">{content.map((node: PMNode, i: number) => renderBlock(node, i))}</div>;
}
