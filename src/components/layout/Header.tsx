'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/context';
import { COLORS } from '@/styles/colors';

export function Header() {
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
            Home
          </Link>
          <Link href="/posts" className="transition-colors hover:opacity-80" style={{ color: 'inherit' }}>
            Posts
          </Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:opacity-80" style={{ color: 'inherit' }}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
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
                Logout
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
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
