'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/posts/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Input } from '@/components/ui/Input';
import { TabSwitch } from '@/components/ui/TabSwitch';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import { validateAll, validatePostContent, validatePostTitle } from '@/utils/validation';

export default function EditPostPage({ params }: { params: Promise<{ id: string; locale: string }>  }) {
  const { id, locale } = use(params);
  const t = useTranslations('EditPost');
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
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

        if (data.author_id !== user?.id) {
          setError(t('error_no_permission'));
          return;
        }

        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setPublished(data.published);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(t('error_load_failed'));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user, supabase, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    const validationError = validateAll([
      validatePostTitle(title),
      validatePostContent(content),
    ]);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim(),
          published,
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(t('error_update_failed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

  if (error && !post) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Card className="text-center">
            <ErrorAlert error={error} className="mb-4" />
            <Button variant="primary" onClick={() => router.push(`/${locale}/dashboard`)}>
              {t('back_to_dashboard')}
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-heading mb-8 text-4xl font-semibold">{t('page_title')}</h1>

          <Card>
            <ErrorAlert error={error} className="mb-4" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('title_label')}
                placeholder={t('title_placeholder')}
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={saving}
                required
              />

              {/* Tab Switcher */}
              <div className="flex items-center justify-between">
                <label className="text-body block text-sm font-semibold">{t('content_label')}</label>
                <TabSwitch
                  tabs={[
                    { id: 'edit', label: t('tab_edit') },
                    { id: 'preview', label: t('tab_preview') },
                  ]}
                  activeTab={activeTab}
                  onChange={(tab) => setActiveTab(tab as 'edit' | 'preview')}
                  disabled={saving}
                />
              </div>

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <Textarea
                  placeholder={t('content_placeholder')}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={saving}
                  required
                  rows={12}
                />
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div>
                  <div className="prose prose-slate max-w-none rounded-lg border border-gray-200 bg-gray-50 p-6">
                    {content.trim() ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-heading mb-4 text-3xl font-bold" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-heading mb-3 mt-6 text-2xl font-semibold" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-heading mb-2 mt-4 text-xl font-semibold" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="text-body mb-4 leading-relaxed" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code className="rounded bg-gray-200 px-2 py-1 font-mono text-sm text-gray-800" {...props} />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4 text-gray-100" {...props} />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-accent mb-4 border-l-4 pl-4 italic text-gray-600" {...props} />
                          ),
                          a: ({ node, ...props }) => (
                            <a className="text-accent hover:underline" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-gray-900" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic" {...props} />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr className="my-6 border-gray-300" {...props} />
                          ),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">{t('preview_empty')}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  disabled={saving}
                  className="text-accent h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-body text-sm font-semibold">
                  {t('publish_checkbox')}
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? t('button_saving') : t('button_save')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  {t('button_cancel')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
