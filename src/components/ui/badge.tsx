import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded font-bold whitespace-nowrap text-[10px] px-1.5 py-0.5 [letter-spacing:0.05em]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]',
        neutral:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]',
        cyan:
          'bg-[var(--color-cyan-50)] text-[var(--color-cyan-700)] border border-[var(--color-cyan-200)] dark:bg-[rgb(26_163_224/0.18)] dark:text-[var(--color-cyan-300)] dark:border-[rgb(26_163_224/0.45)]',
        blue:
          'bg-[var(--color-blue-50)] text-[var(--color-blue-700)] border border-[var(--color-blue-200)] dark:bg-[rgb(30_150_212/0.18)] dark:text-[var(--color-blue-300)] dark:border-[rgb(30_150_212/0.45)]',
        yellow:
          'bg-[var(--color-yellow-50)] text-[var(--color-yellow-700)] border border-[var(--color-yellow-200)] dark:bg-[rgb(245_195_51/0.20)] dark:text-[var(--color-yellow-300)] dark:border-[rgb(245_195_51/0.45)]',
        coral:
          'bg-[var(--color-coral-50)] text-[var(--color-coral-700)] border border-[var(--color-coral-200)] dark:bg-[rgb(232_90_61/0.18)] dark:text-[var(--color-coral-300)] dark:border-[rgb(232_90_61/0.45)]',
        success:
          'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-300)]',
        warning:
          'bg-[var(--color-yellow-50)] text-[var(--color-yellow-700)] border border-[var(--color-yellow-200)]',
        danger:
          'bg-[var(--color-coral-50)] text-[var(--color-coral-700)] border border-[var(--color-coral-300)]',
        outline:
          'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-default)]',
        muted:
          'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-transparent',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
      },
      uppercase: {
        true: 'uppercase [letter-spacing:0.08em]',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm', uppercase: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, uppercase, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, uppercase }), className)} {...props} />;
}

export { badgeVariants };
