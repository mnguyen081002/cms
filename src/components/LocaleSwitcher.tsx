'use client';

import type { ChangeEventHandler } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/lib/I18nNavigation';
import { routing } from '@/lib/I18nRouting';

const localeNames: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};

type LocaleSwitcherProps = {
  variant?: 'header' | 'default';
};

export const LocaleSwitcher = ({ variant = 'default' }: LocaleSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh(); // Ensure the page takes the new locale into account related to the issue #395
  };

  // Different styles for header vs other pages
  const className = variant === 'header'
    ? 'cursor-pointer rounded-lg border-2 border-white bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-md transition-all hover:bg-blue-50 focus:outline-none'
    : 'cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 focus:outline-none';

  return (
    <select
      defaultValue={locale}
      onChange={handleChange}
      className={className}
      aria-label="lang-switcher"
    >
      {routing.locales.map(elt => (
        <option key={elt} value={elt} className="bg-white text-gray-900">
          {localeNames[elt] || elt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
