'use client';
import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 border',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]',
        cyan:
          'bg-[var(--color-cyan-50)] text-[var(--color-cyan-700)] border-[var(--color-cyan-200)] dark:bg-[rgb(26_163_224/0.18)] dark:text-[var(--color-cyan-300)] dark:border-[rgb(26_163_224/0.45)]',
        blue:
          'bg-[var(--color-blue-50)] text-[var(--color-blue-700)] border-[var(--color-blue-200)] dark:bg-[rgb(30_150_212/0.18)] dark:text-[var(--color-blue-300)] dark:border-[rgb(30_150_212/0.45)]',
        yellow:
          'bg-[var(--color-yellow-50)] text-[var(--color-yellow-700)] border-[var(--color-yellow-200)] dark:bg-[rgb(245_195_51/0.20)] dark:text-[var(--color-yellow-300)] dark:border-[rgb(245_195_51/0.45)]',
        coral:
          'bg-[var(--color-coral-50)] text-[var(--color-coral-700)] border-[var(--color-coral-200)] dark:bg-[rgb(232_90_61/0.18)] dark:text-[var(--color-coral-300)] dark:border-[rgb(232_90_61/0.45)]',
        brand:
          'bg-[var(--color-brand-bg-soft)] text-[var(--color-cyan-700)] border-[var(--color-cyan-200)] dark:text-[var(--color-cyan-300)] dark:border-[rgb(26_163_224/0.45)]',
        success:
          'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-300)]',
        danger:
          'bg-[var(--color-coral-50)] text-[var(--color-coral-700)] border-[var(--color-coral-300)]',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onSelect'>,
    VariantProps<typeof tagVariants> {
  dismissible?: boolean;
  value?: string;
  onDismiss?: (value?: string) => void;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ tone, size, dismissible, value, onDismiss, className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-value={value}
      className={cn(tagVariants({ tone, size }), dismissible && 'pr-1', className)}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          aria-label="Quitar"
          onClick={() => onDismiss?.(value)}
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  ),
);
Tag.displayName = 'Tag';

export { tagVariants };
