'use client';

import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-body mb-2 block text-sm font-semibold">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full rounded-lg border-2 px-4 py-2 transition-colors duration-200',
          'bg-input-bg text-input-text placeholder:text-gray-400',
          'focus:outline-none',
          error
            ? 'border-input-border-error focus:border-input-border-error-focus'
            : 'border-input-border focus:border-input-border-focus',
          className,
        )}
        {...props}
      />
      {error && <p className="text-error mt-1 text-sm">{error}</p>}
    </div>
  );
}
