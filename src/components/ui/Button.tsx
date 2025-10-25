'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'cursor-pointer rounded-lg font-semibold transition-colors duration-200 focus:outline-none',
        {
          // Primary variant
          'bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover':
            variant === 'primary',
          // Secondary variant
          'bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover':
            variant === 'secondary',
          // Outline variant
          'border-2 border-button-outline-border text-button-outline-text hover:bg-button-outline-hover':
            variant === 'outline',
          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  );
}
