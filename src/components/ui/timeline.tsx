import * as React from 'react';
import { cn } from '@/lib/utils';

type Accent = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const accentClass: Record<Accent, string> = {
  brand: 'bg-[var(--tei-brand)]/10 text-[var(--tei-brand)]',
  success: 'bg-[var(--tei-success)]/10 text-[var(--tei-success)]',
  warning: 'bg-[var(--tei-warning)]/10 text-[var(--tei-warning)]',
  danger: 'bg-[var(--tei-danger)]/10 text-[var(--tei-danger)]',
  info: 'bg-[var(--tei-info)]/10 text-[var(--tei-info)]',
  neutral: 'bg-[var(--tei-bg-secondary)] text-[var(--tei-muted)]',
};

export interface TimelineItem {
  id: string;
  actor?: React.ReactNode;
  action: React.ReactNode;
  at: React.ReactNode;
  icon?: React.ReactNode;
  accent?: Accent;
  body?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, className, ...props }, ref) => (
    <ol ref={ref} className={cn('space-y-0', className)} {...props}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={it.id} className="relative flex items-start gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-4 top-9 w-px bg-[var(--tei-border)]"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-[var(--tei-bg)] [&>svg]:h-4 [&>svg]:w-4',
                accentClass[it.accent ?? 'brand'],
              )}
            >
              {it.icon}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm leading-snug text-[var(--tei-text)]">
                {it.actor && (
                  <strong className="font-bold text-[var(--tei-text-strong)]">
                    {it.actor}
                  </strong>
                )}{' '}
                {it.action}{' '}
                <span className="font-mono text-xs text-[var(--tei-muted)]">
                  · {it.at}
                </span>
              </p>
              {it.body && (
                <div className="mt-2 rounded-md border border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] p-3 text-sm text-[var(--tei-text)]">
                  {it.body}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  ),
);
Timeline.displayName = 'Timeline';
