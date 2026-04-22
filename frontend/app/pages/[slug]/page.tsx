import React from 'react';
import type { Metadata } from 'next';
import PageRenderer from '../../../components/PageRenderer';
import { fetchPageBySlug } from '../../../lib/pages';

type Props = {
  params: { slug: string };
};

type CmsPage = {
  title?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  content?: unknown;
  content_blocks?: unknown;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const page = await fetchPageBySlug(params.slug);
    return {
      title: page?.meta_title ?? page?.title ?? 'Page',
      description: page?.meta_description ?? undefined,
    };
  } catch {
    return {
      title: 'Page',
    };
  }
}

export default async function Page({ params }: Props) {
  const slug = params.slug;
  let page: CmsPage | null = null;
  try {
    page = await fetchPageBySlug(slug) as CmsPage;
  } catch {
    // fallback: render not found
    return <div className="container mx-auto py-16">Page not found</div>;
  }

  const doc = page.content_blocks ?? page.content ?? null;

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <PageRenderer doc={doc} />
    </main>
  );
}
