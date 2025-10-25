/**
 * Color Utility Functions
 * Các hàm tiện ích để làm việc với màu sắc
 */

import { COLORS } from '@/styles/colors';

/**
 * Lấy các class Tailwind cho button variant
 * Note: Sử dụng Tailwind classes thay vì arbitrary values
 */
export function getButtonClasses(variant: 'primary' | 'secondary' | 'outline' = 'primary') {
  const baseClasses = 'cursor-pointer rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary-blue text-white hover:bg-primary-dark-blue focus:ring-primary-blue',
    secondary: 'bg-secondary-light text-body hover:bg-gray-200 focus:ring-gray-300',
    outline: 'border-2 border-accent text-accent hover:bg-blue-50 focus:ring-accent',
  };

  return `${baseClasses} ${variants[variant]}`;
}

/**
 * Lấy các class Tailwind cho input
 * Note: Sử dụng inline styles thay vì arbitrary values vì Tailwind không parse được template literals
 */
export function getInputClasses(error?: string) {
  const baseClasses = 'w-full rounded-lg border-2 px-4 py-2 transition-colors duration-200 bg-white text-body placeholder-gray-400 focus:outline-none';

  if (error) {
    return `${baseClasses} border-red-500 focus:border-red-600`;
  }

  return `${baseClasses} border-gray-300 focus:border-accent`;
}

/**
 * Lấy các class Tailwind cho alert/message
 * Note: Sử dụng Tailwind classes thay vì arbitrary values
 */
export function getAlertClasses(type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  const alerts = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
  };

  return `p-4 rounded-lg ${alerts[type]}`;
}

/**
 * Lấy các class Tailwind cho card
 * Note: Sử dụng Tailwind classes thay vì arbitrary values
 */
export function getCardClasses(variant: 'default' | 'elevated' = 'default') {
  const baseClasses = 'bg-white rounded-lg p-6 transition-all duration-200';

  const variants = {
    default: 'border border-gray-200 hover:border-gray-300',
    elevated: 'shadow-md hover:shadow-lg',
  };

  return `${baseClasses} ${variants[variant]}`;
}

/**
 * Lấy các class Tailwind cho header
 * Note: Sử dụng Tailwind classes thay vì arbitrary values
 */
export function getHeaderClasses() {
  return 'bg-primary-dark text-white shadow-md';
}

/**
 * Lấy các class Tailwind cho footer
 * Note: Sử dụng Tailwind classes thay vì arbitrary values
 */
export function getFooterClasses() {
  return 'bg-primary-dark text-white mt-16';
}

/**
 * Chuyển đổi hex color sang RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: Number.parseInt(result[1]!, 16),
      g: Number.parseInt(result[2]!, 16),
      b: Number.parseInt(result[3]!, 16),
    };
  }
  return null;
}

/**
 * Chuyển đổi RGB sang hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join('')}`;
}

/**
 * Kiểm tra xem màu có sáng hay tối
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return false;
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Lấy màu text phù hợp (trắng hoặc đen) dựa trên background
 */
export function getContrastColor(bgHex: string): string {
  return isLightColor(bgHex) ? COLORS.primary.dark : COLORS.neutral.white;
}
