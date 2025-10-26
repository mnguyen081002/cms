import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateExcerpt, getPost, getPostIds } from '@/lib/posts/server';
import { getBaseUrl } from '@/utils/Helpers';
import { PostActions } from './PostActions';

type PostPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for published posts
export async function generateStaticParams() {
  const postIds = await getPostIds();
  
  // Generate params for both locales
  const params = [];
  for (const id of postIds) {
    params.push({ locale: 'en', id });
    params.push({ locale: 'vi', id });
  }
  
  return params;
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: PostPageProps): Promise<Metadata> {
  const { locale, id } = await props.params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const excerpt = generateExcerpt(post.content, 160);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${locale === 'en' ? '' : `${locale}/`}posts/${id}`;

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      url,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/posts/${id}`,
        vi: `${baseUrl}/vi/posts/${id}`,
      },
    },
  };
}

export default async function PostDetailPage(props: PostPageProps) {
  const { locale, id } = await props.params;
  setRequestLocale(locale);
  
  const post = await getPost(id);
  const t = await getTranslations({ locale, namespace: 'PostDetail' });

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    description: generateExcerpt(post.content, 160),
    author: {
      '@type': 'Person',
      name: 'Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CMS',
      logo: {
        '@type': 'ImageObject',
        url: `${getBaseUrl()}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col bg-white">
        <Header />

        <main className="flex-1">
          <article className="mx-auto max-w-3xl px-4 py-12">
            <header className="mb-8">
              <h1 className="text-heading mb-4 text-4xl font-semibold md:text-5xl">
                {post.title}
              </h1>
              <div className="mb-6 flex items-center justify-between text-gray-600">
                <time dateTime={post.created_at} className="text-sm">
                  {formatDate(post.created_at)}
                </time>
              </div>
            </header>

            <Card className="prose prose-sm mb-8 max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-heading mb-4 mt-6 text-3xl font-semibold" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-heading mb-3 mt-5 text-2xl font-semibold" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-heading mb-2 mt-4 text-xl font-semibold" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-body mb-4 leading-relaxed" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-accent hover:underline" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mb-4 ml-6 list-disc" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="mb-4 ml-6 list-decimal" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-2" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-accent my-4 border-l-4 pl-4 text-gray-600 italic" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </Card>

            <PostActions postId={post.id} authorId={post.author_id} />

            <div className="mt-8">
              <Link href="/posts">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('back_to_posts')}
                </Button>
              </Link>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
