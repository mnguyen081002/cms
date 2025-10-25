/**
 * Centralized Color Configuration
 * Tất cả các mã màu được định nghĩa ở đây để tái sử dụng dễ dàng
 */

export const COLORS = {
  // Primary Colors - Màu chính
  primary: {
    dark: '#0F172A', // Dark slate - Xanh đen chính
    blue: '#2563EB', // Blue accent - Xanh dương nhấn
    lightBlue: '#3B82F6', // Light blue - Xanh dương nhạt
    darkBlue: '#1E40AF', // Dark blue - Xanh dương đậm
  },

  // Secondary Colors - Màu phụ
  secondary: {
    light: '#F1F5F9', // Muted background - Nền xám nhạt
    text: '#0B1220', // Text color - Màu chữ
    gray: '#6B7280', // Gray - Xám
    lightGray: '#E5E7EB', // Light gray - Xám nhạt
    darkGray: '#374151', // Dark gray - Xám đậm
  },

  // Neutral Colors - Màu trung tính
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
  },

  // Status Colors - Màu trạng thái
  status: {
    success: '#10B981', // Green - Xanh lá
    error: '#EF4444', // Red - Đỏ
    warning: '#F59E0B', // Amber - Vàng
    info: '#3B82F6', // Blue - Xanh dương
  },

  // Semantic Colors - Màu ngữ nghĩa
  semantic: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
  },

  // Component-specific Colors - Màu riêng cho component
  button: {
    primary: {
      bg: '#2563EB',
      text: '#FFFFFF',
      hover: '#1E40AF',
      focus: '#1E3A8A',
    },
    secondary: {
      bg: '#F1F5F9',
      text: '#0B1220',
      hover: '#E2E8F0',
      focus: '#CBD5E1',
    },
    outline: {
      border: '#2563EB',
      text: '#2563EB',
      hover: '#EFF6FF',
      focus: '#DBEAFE',
    },
  },

  // Input Colors - Màu input
  input: {
    bg: '#FFFFFF',
    text: '#0B1220',
    placeholder: '#9CA3AF',
    border: '#D1D5DB',
    borderFocus: '#2563EB',
    borderError: '#EF4444',
    borderErrorFocus: '#DC2626',
  },

  // Card Colors - Màu card
  card: {
    bg: '#FFFFFF',
    border: '#E5E7EB',
    borderHover: '#D1D5DB',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Header/Footer Colors - Màu header/footer
  header: {
    bg: '#0F172A',
    text: '#FFFFFF',
    hover: '#2563EB',
    border: '#1F2937',
  },

  // Alert/Message Colors - Màu cảnh báo
  alert: {
    success: {
      bg: '#ECFDF5',
      border: '#A7F3D0',
      text: '#065F46',
    },
    error: {
      bg: '#FEF2F2',
      border: '#FECACA',
      text: '#991B1B',
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FCD34D',
      text: '#92400E',
    },
    info: {
      bg: '#EFF6FF',
      border: '#BFDBFE',
      text: '#1E40AF',
    },
  },
} as const;

/**
 * Tailwind CSS Color Mapping
 * Ánh xạ các màu sang Tailwind CSS classes
 */
export const TAILWIND_COLORS = {
  primary: COLORS.primary.blue,
  secondary: COLORS.secondary.light,
  success: COLORS.status.success,
  error: COLORS.status.error,
  warning: COLORS.status.warning,
  info: COLORS.status.info,
} as const;

/**
 * Helper function để lấy màu
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = COLORS;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || '#000000';
}

/**
 * Type-safe color keys
 */
export type ColorKey = keyof typeof COLORS;
export type ColorValue = typeof COLORS[ColorKey];
