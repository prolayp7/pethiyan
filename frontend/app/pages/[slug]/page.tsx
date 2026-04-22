import React from 'react';
import PageRenderer from '../../../components/PageRenderer';
import { fetchPageBySlug } from '../../../lib/pages';

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const slug = params.slug;
  let page: any = null;
  try {
    page = await fetchPageBySlug(slug);
  } catch (e) {
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
