'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export default function DashboardPage() {
  const t = useTranslations('MyDashboard');
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
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(t('delete_failed'));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentPreview = (content: string, maxLength = 200) => {
    // Giữ nguyên markdown, chỉ cắt ngắn content
    if (content.length <= maxLength) {
      return content;
    }

    // Cắt tại vị trí maxLength và tìm khoảng trắng gần nhất để không cắt giữa từ
    const trimmed = content.substring(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');

    if (lastSpace > 0) {
      return `${trimmed.substring(0, lastSpace)}...`;
    }

    return `${trimmed}...`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const tPosts = useTranslations('Posts');
    if (diffInSeconds < 60) return tPosts('just_now');
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${tPosts('minutes_ago')}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${tPosts('hours_ago')}`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}${tPosts('days_ago')}`;
    return formatDate(date);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">{t('loading')}</p>
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
                <Card className="py-12 text-center">
                  <p className="mb-4 text-gray-600">
                    {totalCount === 0
                      ? t('no_posts_yet')
                      : t('no_posts_page')}
                  </p>
                  {totalCount === 0 && (
                    <Link href="/dashboard/new">
                      <Button variant="primary">{t('create_first')}</Button>
                    </Link>
                  )}
                </Card>
              )
            : (
                <>
                  <div className="mb-8 grid gap-6 md:grid-cols-2">
                    {posts.map(post => (
                    <Card
                      key={post.id}
                      variant="elevated"
                      className="group relative flex flex-col transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Status Badge */}
                      <div className="absolute right-4 top-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                          post.published
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20'
                            : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
                        }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            post.published ? 'bg-green-600' : 'bg-yellow-600'
                          }`}
                          />
                          {post.published ? t('published') : t('draft')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Link href={`/posts/${post.id}`}>
                          <h2 className="text-heading hover:text-accent mb-3 pr-24 text-xl font-bold transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>

                        {post.content && (
                          <div className="relative mb-4 max-h-[4.5rem] overflow-hidden">
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  h1: ({ node, ...props }) => (
                                    <h1 className="text-heading mb-1 text-sm font-semibold" {...props} />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <h2 className="text-heading mb-1 text-sm font-semibold" {...props} />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <h3 className="text-heading mb-1 text-xs font-semibold" {...props} />
                                  ),
                                  p: ({ node, ...props }) => (
                                    <p className="mb-1 text-sm leading-relaxed text-gray-600" {...props} />
                                  ),
                                  ul: ({ node, ...props }) => (
                                    <ul className="mb-1 ml-4 list-disc text-sm text-gray-600" {...props} />
                                  ),
                                  ol: ({ node, ...props }) => (
                                    <ol className="mb-1 ml-4 list-decimal text-sm text-gray-600" {...props} />
                                  ),
                                  li: ({ node, ...props }) => (
                                    <li className="text-sm" {...props} />
                                  ),
                                  code: ({ node, ...props }) => (
                                    <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-800" {...props} />
                                  ),
                                  blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-accent mb-1 border-l-2 pl-2 text-sm text-gray-600 italic" {...props} />
                                  ),
                                  strong: ({ node, ...props }) => (
                                    <strong className="font-semibold text-gray-800" {...props} />
                                  ),
                                  em: ({ node, ...props }) => (
                                    <em className="italic" {...props} />
                                  ),
                                }}
                              >
                                {getContentPreview(post.content, 200)}
                              </ReactMarkdown>
                            </div>
                            {/* Gradient overlay for fade effect */}
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
                          </div>
                        )}

                        {/* Meta Information */}
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{getTimeAgo(post.created_at)}</span>
                          </div>
                          {post.updated_at !== post.created_at && (
                            <div className="flex items-center gap-1.5">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>{t('updated')} {getTimeAgo(post.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 border-t border-gray-100 pt-4">
                        <Link href={`/posts/${post.id}`} className="flex-1">
                          <button className="group/btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                            <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{t('view')}</span>
                          </button>
                        </Link>
                        <Link href={`/dashboard/${post.id}/edit`} className="flex-1">
                          <button className="group/btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700">
                            <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>{t('edit')}</span>
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="group/btn flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                          title={t('delete')}
                        >
                          <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(totalCount / postsPerPage) > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => updatePage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {t('previous')}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(totalCount / postsPerPage) }, (_, i) => i + 1).map((pageNum) => {
                        const totalPages = Math.ceil(totalCount / postsPerPage);
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1
                          || pageNum === totalPages
                          || (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => updatePage(pageNum)}
                              className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                                pageNum === page
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        // Show ellipsis
                        if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => updatePage(Math.min(Math.ceil(totalCount / postsPerPage), page + 1))}
                      disabled={page === Math.ceil(totalCount / postsPerPage)}
                      className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('next')}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                )}
              </>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
