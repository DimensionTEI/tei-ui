import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateInputType = 'date' | 'time' | 'datetime-local' | 'month';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: DateInputType;
  invalid?: boolean;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ type = 'date', invalid, className, ...props }, ref) => (
    <div className="relative">
      <Calendar
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tei-muted)]"
      />
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex h-10 w-full rounded-md border bg-[var(--tei-surface)] pl-9 pr-3 py-2 text-sm text-[var(--tei-text)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tei-bg)] disabled:cursor-not-allowed disabled:opacity-50',
          invalid
            ? 'border-[var(--tei-danger)] focus-visible:ring-[var(--tei-danger)]'
            : 'border-[var(--tei-border)] focus-visible:ring-[var(--tei-focus-ring)]',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
DateInput.displayName = 'DateInput';
