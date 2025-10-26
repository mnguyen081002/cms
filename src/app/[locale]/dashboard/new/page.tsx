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
import { validateAll, validatePostContent, validatePostTitle } from '@/utils/validation';

export default function NewPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('NewPost');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
    }
    setAuthLoading(false);
  }, [user, router, locale]);

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

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title: title.trim(),
            content: content.trim(),
            published,
            author_id: user?.id,
          },
        ]);

      if (insertError) {
        throw insertError;
      }
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(t('error_create_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-8 text-4xl font-semibold text-heading">{t('page_title')}</h1>

          <Card>
            <ErrorAlert error={error} className="mb-4" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('title_label')}
                placeholder={t('title_placeholder')}
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <Textarea
                  placeholder={t('content_placeholder')}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={loading}
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
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-sm font-semibold text-body">
                  {t('publish_checkbox')}
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? t('button_creating') : t('button_create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
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
