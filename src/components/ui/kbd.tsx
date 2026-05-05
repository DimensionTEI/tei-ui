import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Pista visual de teclado, ej. <Kbd>⌘</Kbd> + <Kbd>K</Kbd>.
 */
export const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex h-5 min-w-[20px] select-none items-center justify-center rounded border border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-1.5 font-mono text-[10px] font-medium text-[var(--tei-muted)]',
        className,
      )}
      {...props}
    />
  ),
);
Kbd.displayName = 'Kbd';
