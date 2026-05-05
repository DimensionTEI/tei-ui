import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default:
          'border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] text-[var(--tei-text)]',
        muted:
          'border-transparent bg-[var(--tei-bg-secondary)] text-[var(--tei-muted)]',
        success:
          'border-transparent bg-[var(--tei-success)]/10 text-[var(--tei-success)]',
        warning:
          'border-transparent bg-[var(--tei-warning)]/10 text-[var(--tei-warning)]',
        danger:
          'border-transparent bg-[var(--tei-danger)]/10 text-[var(--tei-danger)]',
        outline: 'border-[var(--tei-border-strong)] text-[var(--tei-text)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
