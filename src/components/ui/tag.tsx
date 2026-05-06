'use client';
import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral:
          'border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] text-[var(--tei-text)]',
        brand:
          'border-transparent bg-[var(--tei-brand)]/10 text-[var(--tei-brand)]',
        success:
          'border-transparent bg-[var(--tei-success)]/10 text-[var(--tei-success)]',
        warning:
          'border-transparent bg-[var(--tei-warning)]/10 text-[var(--tei-warning)]',
        danger:
          'border-transparent bg-[var(--tei-danger)]/10 text-[var(--tei-danger)]',
        info: 'border-transparent bg-[var(--tei-info)]/10 text-[var(--tei-info)]',
      },
      size: {
        sm: 'text-[10px] px-2 py-0',
        md: 'text-xs px-2.5 py-0.5',
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
