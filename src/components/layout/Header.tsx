'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/context';
import { COLORS } from '@/styles/colors';

export function Header() {
  const t = useTranslations('Header');
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header style={{ backgroundColor: COLORS.header.bg, color: COLORS.header.text }} className="shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold transition-opacity hover:opacity-80">
          CMS
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'inherit' }}>
            {t('home')}
          </Link>
          <Link href="/posts" className="transition-colors hover:opacity-80" style={{ color: 'inherit' }}>
            {t('posts')}
          </Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:opacity-80" style={{ color: 'inherit' }}>
              {t('dashboard')}
            </Link>
          )}
        </div>

        {/* Auth Buttons & Language Switcher */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher variant="header" />
          {user ? (
            <>
              <span className="text-sm text-gray-300">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                style={{
                  borderColor: 'white',
                  color: 'white',
                }}
                className="hover:bg-white"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = COLORS.primary.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: 'white',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = COLORS.primary.dark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  {t('login')}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">
                  {t('sign_up')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
