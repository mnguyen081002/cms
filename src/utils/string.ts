/**
 * String Utility Functions
 * 
 * Centralized string manipulation functions.
 */

/**
 * Truncate string to a maximum length
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string at word boundary
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string at word boundary
 */
export function truncateAtWord(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  
  const trimmed = str.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return trimmed.substring(0, lastSpace) + suffix;
  }
  
  return trimmed + suffix;
}

/**
 * Capitalize first letter of string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 * 
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Convert string to slug (URL-friendly)
 * 
 * @param str - String to convert
 * @returns Slug string
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
}

/**
 * Extract excerpt from markdown content
 * 
 * @param markdown - Markdown content
 * @param maxLength - Maximum length (default: 200)
 * @returns Plain text excerpt
 */
export function extractExcerpt(markdown: string, maxLength: number = 200): string {
  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  return truncateAtWord(plainText, maxLength);
}

/**
 * Count words in string
 * 
 * @param str - String to count words in
 * @returns Number of words
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Estimate reading time in minutes
 * 
 * @param text - Text to estimate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Remove extra whitespace from string
 * 
 * @param str - String to clean
 * @returns Cleaned string
 */
export function removeExtraWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Check if string is empty or only whitespace
 * 
 * @param str - String to check
 * @returns True if empty or whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Sanitize string for display (basic XSS prevention)
 * 
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function sanitize(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

