import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'Content Platform',
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix,
};
