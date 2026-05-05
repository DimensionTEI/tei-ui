import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusDotVariants = cva('inline-block rounded-full', {
  variants: {
    variant: {
      default: 'bg-[var(--tei-muted)]',
      success: 'bg-[var(--tei-success)]',
      warning: 'bg-[var(--tei-warning)]',
      danger: 'bg-[var(--tei-danger)]',
      info: 'bg-[var(--tei-info)]',
    },
    size: {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    },
    pulse: {
      true: 'animate-pulse',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md', pulse: false },
});

export const StatusDot = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof statusDotVariants>
>(({ className, variant, size, pulse, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(statusDotVariants({ variant, size, pulse }), className)}
    {...props}
  />
));
StatusDot.displayName = 'StatusDot';
