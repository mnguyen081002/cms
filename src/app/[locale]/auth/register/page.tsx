'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('error_password_mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('error_password_length'));
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Show success message
      setSuccess(true);
    } catch (err) {
      setError(t('error_unexpected'));
    } finally {
      setLoading(false);
    }
  };

  // Show success message after registration
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-8">
        <div className="w-full max-w-md">
          {/* Language Switcher & Back to Home */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">{t('back_to_home')}</span>
            </Link>
            <LocaleSwitcher />
          </div>

          <Card className="shadow-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-heading">{t('check_email_title')}</h1>
            <p className="mb-6 text-gray-600">
              {t('check_email_message')}
              {' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-3 flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="mb-1 font-semibold text-blue-900">{t('next_steps')}</h3>
                <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-800">
                  <li>{t('step_1')}</li>
                  <li>{t('step_2')}</li>
                  <li>{t('step_3')}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="primary" className="w-full">
                {t('go_to_signin')}
              </Button>
            </Link>

            <p className="text-center text-sm text-gray-600">
              {t('didnt_receive')}
              {' '}
              <button
                onClick={() => setSuccess(false)}
                className="font-semibold text-accent hover:underline"
              >
                {t('try_again')}
              </button>
            </p>
          </div>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-8">
      <div className="w-full max-w-md">
        {/* Language Switcher & Back to Home */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">{t('back_to_home')}</span>
          </Link>
          <LocaleSwitcher />
        </div>

        <Card className="shadow-md">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-heading">{t('signup_title')}</h1>
          <p className="text-gray-600">{t('signup_subtitle')}</p>
        </div>

        {/* Info banner about email confirmation */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              {t('email_confirm_notice')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label={t('email')}
            type="email"
            placeholder={t('email_placeholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label={t('password')}
            type="password"
            placeholder={t('password_placeholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label={t('confirm_password')}
            type="password"
            placeholder={t('password_placeholder')}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? t('creating_account') : t('sign_up')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('have_account')}
            {' '}
            <Link href="/auth/login" className="font-semibold text-accent hover:underline">
              {t('sign_in_link')}
            </Link>
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
}
