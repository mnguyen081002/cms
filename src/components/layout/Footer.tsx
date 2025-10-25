'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { COLORS } from '@/styles/colors';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer style={{ backgroundColor: COLORS.header.bg, color: COLORS.header.text }} className="mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('about_title')}</h3>
            <p className="text-sm text-gray-400">
              {t('about_desc')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('links_title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:opacity-80">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-400 transition-colors hover:opacity-80">
                  {t('posts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('legal_title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:opacity-80">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:opacity-80">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy;
            {new Date().getFullYear()}
            {' '}
            CMS. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
