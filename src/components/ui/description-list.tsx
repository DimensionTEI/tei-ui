import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DescriptionItem {
  term: React.ReactNode;
  description?: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  orientation?: 'horizontal' | 'vertical';
}

export const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ items, orientation = 'horizontal', className, ...props }, ref) => {
    if (orientation === 'horizontal') {
      return (
        <dl
          ref={ref}
          className={cn(
            'grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm',
            className,
          )}
          {...props}
        >
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <dt className="font-semibold text-[var(--tei-muted)]">{it.term}</dt>
              <dd className="text-[var(--tei-text)]">{it.description}</dd>
            </React.Fragment>
          ))}
        </dl>
      );
    }
    return (
      <dl ref={ref} className={cn('space-y-3 text-sm', className)} {...props}>
        {items.map((it, i) => (
          <div key={i} className="space-y-0.5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tei-muted)]">
              {it.term}
            </dt>
            <dd className="text-[var(--tei-text)]">{it.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
DescriptionList.displayName = 'DescriptionList';
