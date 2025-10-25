'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  published: boolean;
};

export default function PostsPage() {
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

  const getContentPreview = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) {
      return content;
    }
    const trimmed = content.substring(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace > 0) {
      return `${trimmed.substring(0, lastSpace)}...`;
    }
    return `${trimmed}...`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
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
                  Discover Posts
                </h1>
                <p className="text-lg text-gray-600">
                  Explore articles and stories from our community
                </p>
              </div>
              {!loading && totalCount > 0 && (
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{totalCount}</span>
                  {' '}
                  {totalCount === 1 ? 'post' : 'posts'}
                  {search && ' found'}
                </div>
              )}
            </div>
            <div className="relative max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search posts by title..."
                value={search}
                onChange={e => updateParams(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          {loading
            ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-gray-600">Loading posts...</p>
                  </div>
                </div>
              ) : posts.length === 0
                ? (
                    <Card className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-heading mb-2 text-xl font-semibold">
                        {search ? 'No posts found' : 'No posts yet'}
                      </h3>
                      <p className="mb-6 text-gray-600">
                        {search
                          ? 'Try adjusting your search terms or browse all posts.'
                          : 'Be the first to share your thoughts and create a post!'}
                      </p>
                      {search && (
                        <Button variant="outline" onClick={() => updateParams('')}>
                          Clear Search
                        </Button>
                      )}
                    </Card>
                  ) : (
                    <>
                      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                          <Link key={post.id} href={`/posts/${post.id}`}>
                            <Card
                              variant="elevated"
                              className="group flex h-full cursor-pointer flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              {/* Title */}
                              <h2 className="text-heading hover:text-accent mb-3 text-xl font-bold transition-colors duration-200 line-clamp-2">
                                {post.title}
                              </h2>

                              {/* Content Preview with Markdown */}
                              {post.content && (
                                <div className="relative mb-4 flex-1 max-h-[4.5rem] overflow-hidden">
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
                                  {/* Gradient overlay */}
                                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
                                </div>
                              )}

                              {/* Meta Information */}
                              <div className="mt-auto border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{getTimeAgo(post.created_at)}</span>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="outline"
                            onClick={() => updateParams(undefined, Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </Button>

                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                              // Show first page, last page, current page, and pages around current
                              if (
                                pageNum === 1
                                || pageNum === totalPages
                                || (pageNum >= page - 1 && pageNum <= page + 1)
                              ) {
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => updateParams(undefined, pageNum)}
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
                            onClick={() => updateParams(undefined, Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Next
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
