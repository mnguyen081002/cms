'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/posts/EmptyState';
import { LoadingSpinner } from '@/components/posts/LoadingSpinner';
import { Pagination } from '@/components/posts/Pagination';
import { PostCard } from '@/components/posts/PostCard';
import { SearchBar } from '@/components/posts/SearchBar';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import { getTimeAgo } from '@/utils/date';

function PostsPageContent() {
  const t = useTranslations('Posts');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const postsPerPage = 9; // Changed to 9 for better grid layout (3x3)

  // Get params from URL
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const supabase = createClient();

  // Update URL params
  const updateParams = (newSearch?: string, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch !== undefined) {
      if (newSearch) {
        params.set('search', newSearch);
      } else {
        params.delete('search');
      }
      params.set('page', '1'); // Reset to page 1 when search changes
    }

    if (newPage !== undefined) {
      params.set('page', String(newPage));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Calculate range for pagination
        const from = (page - 1) * postsPerPage;
        const to = from + postsPerPage - 1;

        // Build query with count
        // Must explicitly filter published = true
        // (RLS allows users to see their own drafts, but blog listing should only show published)
        let query = supabase
          .from('posts')
          .select('*', { count: 'exact' })
          .eq('published', true)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (search) {
          query = query.ilike('title', `%${search}%`);
        }

        const { data, error, count } = await query;

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
  }, [search, page, supabase, postsPerPage]);

  const totalPages = Math.ceil(totalCount / postsPerPage);

  const formatDateWithTimeAgo = (date: string) => {
    return getTimeAgo(date, {
      justNow: t('just_now'),
      minutesAgo: t('minutes_ago'),
      hoursAgo: t('hours_ago'),
      daysAgo: t('days_ago'),
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          {/* Header Section */}
          <div className="mb-10">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-heading mb-3 text-4xl font-bold md:text-5xl">
                  {t('title')}
                </h1>
                <p className="text-lg text-gray-600">
                  {t('subtitle')}
                </p>
              </div>
              {!loading && totalCount > 0 && (
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{totalCount}</span>
                  {' '}
                  {totalCount === 1 ? t('post') : t('posts')}
                  {search && ` ${t('found')}`}
                </div>
              )}
            </div>
            <SearchBar
              value={search}
              onChange={value => updateParams(value)}
              placeholder={t('search_placeholder')}
              className="max-w-xl"
            />
          </div>

          {loading
            ? (
                <LoadingSpinner message={t('loading')} />
              ) : posts.length === 0
                ? (
                    <EmptyState
                      title={search ? t('no_posts_found') : t('no_posts_yet')}
                      description={search ? t('no_posts_search') : t('no_posts_create')}
                      actionLabel={search ? t('clear_search') : undefined}
                      onAction={search ? () => updateParams('') : undefined}
                      icon={search ? 'search' : 'document'}
                    />
                  ) : (
                    <>
                      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                          <PostCard
                            key={post.id}
                            post={post}
                            formatDate={formatDateWithTimeAgo}
                            variant="public"
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={pageNum => updateParams(undefined, pageNum)}
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

export default function PostsPage() {
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
      <PostsPageContent />
    </Suspense>
  );
}
