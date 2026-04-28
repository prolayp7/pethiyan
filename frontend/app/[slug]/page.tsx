import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import { fetchPageBySlug } from '@/lib/pages';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);
  if (!page) return { title: 'Page Not Found' };
  return {
    title: page.meta_title ?? page.title ?? 'Page',
    description: page.meta_description ?? undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);

  if (!page) notFound();

  const doc = page.content_blocks ?? page.content ?? null;

  return (
    <div className="container mx-auto py-8 px-4 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <PageRenderer doc={doc} />
    </div>
  );
}
