import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  current: string;
  orientation?: 'horizontal' | 'vertical';
}

type State = 'done' | 'current' | 'pending';

const markerByState: Record<State, string> = {
  done: 'bg-[var(--tei-success)] text-[var(--tei-accent-fg)] border-[var(--tei-success)]',
  current:
    'bg-[var(--tei-accent)] text-[var(--tei-accent-fg)] border-[var(--tei-accent)] ring-4 ring-[var(--tei-accent)]/20',
  pending:
    'bg-[var(--tei-bg-secondary)] text-[var(--tei-muted)] border-[var(--tei-border-strong)]',
};

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, current, orientation = 'horizontal', className, ...props }, ref) => {
    const currentIdx = steps.findIndex((s) => s.id === current);
    const stateOf = (idx: number): State =>
      idx < currentIdx ? 'done' : idx === currentIdx ? 'current' : 'pending';

    return (
      <ol
        ref={ref}
        className={cn(
          orientation === 'horizontal'
            ? 'flex items-start gap-2'
            : 'flex flex-col gap-4',
          className,
        )}
        {...props}
      >
        {steps.map((s, i) => {
          const state = stateOf(i);
          const isLast = i === steps.length - 1;
          return (
            <li
              key={s.id}
              className={cn(
                'flex',
                orientation === 'horizontal'
                  ? 'flex-1 items-start gap-3'
                  : 'items-start gap-3',
              )}
            >
              <span
                aria-current={state === 'current' ? 'step' : undefined}
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  markerByState[state],
                )}
              >
                {state === 'done' ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    state === 'current'
                      ? 'text-[var(--tei-text-strong)]'
                      : state === 'done'
                        ? 'text-[var(--tei-text)]'
                        : 'text-[var(--tei-muted)]',
                  )}
                >
                  {s.label}
                </p>
                {s.description && (
                  <p className="text-xs text-[var(--tei-muted)]">{s.description}</p>
                )}
              </div>
              {!isLast && orientation === 'horizontal' && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-4 h-px flex-1',
                    state === 'done'
                      ? 'bg-[var(--tei-success)]'
                      : 'bg-[var(--tei-border)]',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);
Stepper.displayName = 'Stepper';
