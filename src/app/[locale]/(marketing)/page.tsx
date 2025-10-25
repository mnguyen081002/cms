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
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t('hero_badge')}
            </div>

            {/* Main Heading */}
            <h1 className="text-heading mb-6 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              {t('hero_title_1')}
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero_title_2')}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
              {t('hero_description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/posts">
                <Button variant="primary" className="group flex items-center gap-2 px-8 py-6 text-lg">
                  {t('hero_explore_posts')}
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  {t('hero_start_writing')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-12">
              <div>
                <div className="text-heading text-3xl font-bold md:text-4xl">{t('stats_fast')}</div>
                <div className="mt-2 text-sm text-gray-600">{t('stats_fast_desc')}</div>
              </div>
              <div>
                <div className="text-heading text-3xl font-bold md:text-4xl">{t('stats_secure')}</div>
                <div className="mt-2 text-sm text-gray-600">{t('stats_secure_desc')}</div>
              </div>
              <div>
                <div className="text-heading text-3xl font-bold md:text-4xl">{t('stats_simple')}</div>
                <div className="mt-2 text-sm text-gray-600">{t('stats_simple_desc')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-heading mb-4 text-4xl font-bold md:text-5xl">
              {t('features_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('features_subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_editor_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_editor_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_secure_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_secure_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-green-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_fast_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_fast_desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-orange-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_search_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_search_desc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-pink-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_media_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_media_desc')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-heading mb-3 text-xl font-bold">
                {t('feature_control_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature_control_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 text-center shadow-2xl md:px-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-white" />
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white" />
              <div className="absolute right-1/4 top-1/4 h-16 w-16 rounded-full bg-white" />
            </div>

            {/* Content */}
            <div className="relative">
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                {t('cta_title')}
              </h2>
              <p className="mb-8 text-lg text-blue-100 md:text-xl">
                {t('cta_subtitle')}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button
                    variant="secondary"
                    className="bg-white px-8 py-6 text-lg font-semibold text-blue-600 hover:bg-gray-100"
                  >
                    {t('cta_create_account')}
                  </Button>
                </Link>
                <Link href="/posts">
                  <Button
                    variant="outline"
                    className="border-2 border-white px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
                  >
                    {t('cta_browse_posts')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="border-t border-gray-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-blue-600">✍️</div>
              <h3 className="text-heading mb-2 font-semibold">{t('footer_write_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('footer_write_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-purple-600">🚀</div>
              <h3 className="text-heading mb-2 font-semibold">{t('footer_publish_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('footer_publish_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-green-600">📊</div>
              <h3 className="text-heading mb-2 font-semibold">{t('footer_track_title')}</h3>
              <p className="text-sm text-gray-600">
                {t('footer_track_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
