import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'danger' | 'neutral';
type Accent = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'none';

const toneClass: Record<Tone, string> = {
  success: 'text-[var(--tei-success)]',
  danger: 'text-[var(--tei-danger)]',
  neutral: 'text-[var(--tei-muted)]',
};

const accentClass: Record<Exclude<Accent, 'none'>, string> = {
  brand: 'before:bg-[var(--tei-brand)]',
  success: 'before:bg-[var(--tei-success)]',
  warning: 'before:bg-[var(--tei-warning)]',
  danger: 'before:bg-[var(--tei-danger)]',
  info: 'before:bg-[var(--tei-info)]',
};

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  delta?: React.ReactNode;
  deltaTone?: Tone;
  accent?: Accent;
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, hint, delta, deltaTone = 'neutral', accent = 'brand', className, ...props }, ref) => (
    <article
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg border border-[var(--tei-border)] bg-[var(--tei-surface)] p-4 shadow-[var(--tei-shadow-sm)]',
        accent !== 'none' &&
          'before:absolute before:left-0 before:top-0 before:h-1 before:w-full',
        accent !== 'none' && accentClass[accent],
        className,
      )}
      {...props}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tei-muted)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--tei-text-strong)]">
        {value}
      </p>
      {(hint || delta) && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          {hint && <span className="text-[var(--tei-muted)]">{hint}</span>}
          {delta && (
            <span className={cn('font-semibold tabular-nums', toneClass[deltaTone])}>
              {delta}
            </span>
          )}
        </div>
      )}
    </article>
  ),
);
Stat.displayName = 'Stat';
