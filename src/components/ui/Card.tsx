import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

type CardProps = {
  variant?: 'default' | 'elevated';
} & HTMLAttributes<HTMLDivElement>;

export function Card({ variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white p-6 transition-all duration-200',
        {
          'border border-gray-200 hover:border-gray-300': variant === 'default',
          'shadow-md hover:shadow-lg': variant === 'elevated',
        },
        className,
      )}
      {...props}
    />
  );
}
