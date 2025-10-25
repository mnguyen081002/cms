import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  // const t = await getTranslations({
  //   locale,
  //   namespace: 'Index',
  // });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-heading mb-6 text-5xl font-bold">
            Welcome to CMS
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            A minimalist, secure content management system for user-generated posts.
            Create, manage, and share your content with ease.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/posts">
              <Button variant="primary">
                View All Posts
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading mb-12 text-center text-3xl font-bold">
            Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-heading mb-3 text-xl font-semibold">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                Simple and intuitive interface for creating and managing posts.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-heading mb-3 text-xl font-semibold">
                Secure
              </h3>
              <p className="text-gray-600">
                Built with security in mind using Supabase authentication and Row Level Security.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-heading mb-3 text-xl font-semibold">
                Markdown Support
              </h3>
              <p className="text-gray-600">
                Write your posts in Markdown and see them rendered beautifully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-heading mb-6 text-3xl font-bold">
            Ready to Start?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Create an account and start sharing your content today.
          </p>
          <Link href="/auth/register">
            <Button variant="primary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
