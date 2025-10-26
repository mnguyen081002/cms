/**
 * Date Utility Functions
 * 
 * Centralized date formatting and time ago calculations.
 */

/**
 * Format date to readable string
 * 
 * @param date - ISO date string
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Format date to short format
 * 
 * @param date - ISO date string
 * @returns Short formatted date (e.g., "Jan 1, 2024")
 */
export function formatDateShort(date: string): string {
  return formatDate(date, 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get time ago string
 * 
 * @param date - ISO date string
 * @param translations - Translation functions for time units
 * @returns Time ago string (e.g., "2 hours ago", "3 days ago")
 */
export function getTimeAgo(
  date: string,
  translations: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  },
): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return translations.justNow;
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}${translations.minutesAgo}`;
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}${translations.hoursAgo}`;
  }
  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}${translations.daysAgo}`;
  }
  return formatDate(date);
}

