import * as React from 'react';
import { cn } from '@/lib/utils';

type DeltaTone = 'success' | 'danger' | 'neutral';
type Accent = 'cyan' | 'blue' | 'yellow' | 'coral' | 'ink' | 'none';

const deltaClass: Record<DeltaTone, string> = {
  success: 'text-[var(--color-success-700)] dark:text-[var(--color-success-500)]',
  danger:  'text-[var(--color-danger-700)] dark:text-[var(--color-danger-300)]',
  neutral: 'text-[var(--color-text-muted)]',
};

const stripeClass: Record<Exclude<Accent, 'none'>, string> = {
  cyan:   'tei-stripe-cyan',
  blue:   'tei-stripe-blue',
  yellow: 'tei-stripe-yellow',
  coral:  'tei-stripe-coral',
  ink:    'tei-stripe-ink',
};

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  delta?: React.ReactNode;
  deltaTone?: DeltaTone;
  accent?: Accent;
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, hint, delta, deltaTone = 'neutral', accent = 'cyan', className, ...props }, ref) => (
    <article
      ref={ref}
      className={cn(
        'rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-5',
        accent !== 'none' && stripeClass[accent],
        className,
      )}
      {...props}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight text-[var(--color-text-heading)]">
        {value}
      </p>
      {(hint || delta) && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          {hint && <span className="text-[var(--color-text-muted)]">{hint}</span>}
          {delta && (
            <span className={cn('font-semibold tabular-nums', deltaClass[deltaTone])}>
              {delta}
            </span>
          )}
        </div>
      )}
    </article>
  ),
);
Stat.displayName = 'Stat';
