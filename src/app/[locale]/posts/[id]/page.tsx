'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
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
  author_id: string;
  created_at: string;
  published: boolean;
};

export default function PostDetailPage({ params }: { params:Promise< { id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Check if post is published or user is the author
        if (!data.published && data.author_id !== user?.id) {
          setError('Post not found or you do not have permission to view it');
          return;
        }

        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, supabase]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-600">Loading post...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Card className="text-center">
            <p className="mb-4 text-red-600">{error || 'Post not found'}</p>
            <Link href="/posts">
              <Button variant="primary">Back to Posts</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-heading mb-4 text-4xl font-semibold md:text-5xl">
              {post.title}
            </h1>
            <div className="mb-6 flex items-center justify-between text-gray-600">
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
              {!post.published && isAuthor && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                  Draft
                </span>
              )}
            </div>
          </div>

          <Card className="prose prose-sm mb-8 max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-heading mt-6 mb-4 text-3xl font-semibold" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-heading mt-6 mb-3 text-2xl font-semibold" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-heading mt-4 mb-2 text-xl font-semibold" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-gray-700" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="mb-4 list-inside list-disc text-gray-700" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="mb-4 list-inside list-decimal text-gray-700" {...props} />
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

          {isAuthor && (
            <div className="flex gap-4">
              <Link href={`/dashboard/${post.id}/edit`}>
                <Button variant="primary">Edit Post</Button>
              </Link>
              <Button variant="outline" onClick={handleDelete} className="border-red-600 text-red-600 hover:bg-red-50">
                Delete Post
              </Button>
            </div>
          )}

          <div className="mt-8">
            <Link href="/posts">
              <Button variant="outline">Back to Posts</Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
