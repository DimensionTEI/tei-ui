import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-[var(--tei-border)] bg-[var(--tei-surface)] px-3 py-2 text-sm text-[var(--tei-text)] placeholder:text-[var(--tei-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tei-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tei-bg)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
