import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

import { Header } from '@/components/layout/Header';
import { AppConfig } from '@/utils/AppConfig';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {props.children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900">{AppConfig.name}</span>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                A modern content management platform for creators.
                Write, publish, and share your stories with the world.
              </p>
              <p className="text-xs text-gray-500">
                {`© ${new Date().getFullYear()} ${AppConfig.name}. All rights reserved.`}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/posts" className="text-gray-600 transition-colors hover:text-gray-900">
                    Browse Posts
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-600 transition-colors hover:text-gray-900">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-600 transition-colors hover:text-gray-900">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
