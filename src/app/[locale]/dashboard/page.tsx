'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/posts/LoadingSpinner';
import { Pagination } from '@/components/posts/Pagination';
import { PostCard } from '@/components/posts/PostCard';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import { getTimeAgo } from '@/utils/date';

function DashboardPageContent() {
  const t = useTranslations('MyDashboard');
  const tPosts = useTranslations('Posts');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const postsPerPage = 6; // 2x3 grid
  const page = Number(searchParams.get('page')) || 1;

  // Update URL params
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Calculate range for pagination
        const from = (page - 1) * postsPerPage;
        const to = from + postsPerPage - 1;

        const { data, error, count } = await supabase
          .from('posts')
          .select('*', { count: 'exact' })
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) {
          throw error;
        }
        setPosts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, authLoading, router, supabase, page, postsPerPage]);

  const handleDelete = async (postId: string) => {
    if (!confirm(t('delete_confirm'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }
      setPosts(posts.filter(p => p.id !== postId));
      setTotalCount(totalCount - 1);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(t('delete_failed'));
    }
  };

  const formatDateWithTimeAgo = (date: string) => {
    return getTimeAgo(date, {
      justNow: tPosts('just_now'),
      minutesAgo: tPosts('minutes_ago'),
      hoursAgo: tPosts('hours_ago'),
      daysAgo: tPosts('days_ago'),
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 bg-gray-50">
          <LoadingSpinner message={t('loading')} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-heading mb-2 text-4xl font-semibold">{t('title')}</h1>
              <p className="text-gray-600">
                {t('subtitle')}
                {!loading && totalCount > 0 && (
                  <span className="ml-2 font-semibold text-gray-700">
                    ({totalCount} {totalCount === 1 ? t('post') : t('posts')})
                  </span>
                )}
              </p>
            </div>
            <Link href="/dashboard/new">
              <Button variant="primary" size="lg" className='flex items-center justify-center gap-2'>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('new_post')}
              </Button>
            </Link>
          </div>

          {posts.length === 0
            ? (
                totalCount === 0
                  ? (
                      <Card className="py-12 text-center">
                        <p className="mb-4 text-gray-600">{t('no_posts_yet')}</p>
                        <Link href="/dashboard/new">
                          <Button variant="primary">{t('create_first')}</Button>
                        </Link>
                      </Card>
                    )
                  : (
                      <Card className="py-12 text-center">
                        <p className="mb-4 text-gray-600">{t('no_posts_page')}</p>
                      </Card>
                    )
              )
            : (
                <>
                  <div className="mb-8 grid gap-6 md:grid-cols-2">
                    {posts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        formatDate={formatDateWithTimeAgo}
                        variant="dashboard"
                        onDelete={handleDelete}
                        viewLabel={t('view')}
                        editLabel={t('edit')}
                        deleteLabel={t('delete')}
                        publishedLabel={t('published')}
                        draftLabel={t('draft')}
                        updatedLabel={t('updated')}
                      />
                    ))}
                  </div>

                {/* Pagination */}
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalCount / postsPerPage)}
                  onPageChange={updatePage}
                  previousLabel={t('previous')}
                  nextLabel={t('next')}
                />
              </>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
        <Footer />
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
