'use client';
import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizePx = { sm: 16, md: 20, lg: 24 } as const;

export interface RatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  name?: string;
  size?: keyof typeof sizePx;
  ariaLabel?: string;
  onChange?: (value: number) => void;
  className?: string;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    { value, max = 5, interactive = false, name, size = 'md', ariaLabel = 'Valoración', onChange, className },
    ref,
  ) => {
    const px = sizePx[size];

    return (
      <div
        ref={ref}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={ariaLabel}
        className={cn('inline-flex items-center gap-1', className)}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const filled = value >= n;
          if (!interactive) {
            return (
              <Star
                key={n}
                width={px}
                height={px}
                className={cn(
                  filled ? 'fill-[var(--tei-warning)] text-[var(--tei-warning)]' : 'text-[var(--tei-border-strong)]',
                )}
                aria-hidden="true"
              />
            );
          }
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={filled}
              onClick={() => onChange?.(n)}
              className={cn(
                'inline-flex items-center justify-center rounded transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tei-focus-ring)]',
              )}
            >
              <Star
                width={px}
                height={px}
                className={cn(
                  filled ? 'fill-[var(--tei-warning)] text-[var(--tei-warning)]' : 'text-[var(--tei-border-strong)] hover:text-[var(--tei-warning)]/60',
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
        {interactive && name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  },
);
Rating.displayName = 'Rating';
