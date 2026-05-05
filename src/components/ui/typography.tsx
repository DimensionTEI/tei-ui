import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tipografía coherente para contenido editorial — h1..h4, p, blockquote,
 * code inline, listas. Usa --tei-font-display y --tei-font-mono.
 */

export const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'scroll-m-20 font-[var(--tei-font-display)] text-4xl font-bold tracking-tight text-[var(--tei-text-strong)] lg:text-5xl',
      className,
    )}
    {...props}
  />
));
TypographyH1.displayName = 'TypographyH1';

export const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'scroll-m-20 border-b border-[var(--tei-border)] pb-2 font-[var(--tei-font-display)] text-3xl font-semibold tracking-tight text-[var(--tei-text-strong)] first:mt-0',
      className,
    )}
    {...props}
  />
));
TypographyH2.displayName = 'TypographyH2';

export const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'scroll-m-20 font-[var(--tei-font-display)] text-2xl font-semibold tracking-tight text-[var(--tei-text-strong)]',
      className,
    )}
    {...props}
  />
));
TypographyH3.displayName = 'TypographyH3';

export const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'scroll-m-20 font-[var(--tei-font-display)] text-xl font-semibold tracking-tight text-[var(--tei-text-strong)]',
      className,
    )}
    {...props}
  />
));
TypographyH4.displayName = 'TypographyH4';

export const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('leading-7 text-[var(--tei-text)] [&:not(:first-child)]:mt-4', className)}
    {...props}
  />
));
TypographyP.displayName = 'TypographyP';

export const TypographyBlockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      'mt-4 border-l-2 border-[var(--tei-border-strong)] pl-6 italic text-[var(--tei-muted)]',
      className,
    )}
    {...props}
  />
));
TypographyBlockquote.displayName = 'TypographyBlockquote';

export const TypographyList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('my-4 ml-6 list-disc [&>li]:mt-1', className)} {...props} />
  ),
);
TypographyList.displayName = 'TypographyList';

export const TypographyLead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xl text-[var(--tei-muted)]', className)} {...props} />
));
TypographyLead.displayName = 'TypographyLead';

export const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-[var(--tei-muted)]', className)} {...props} />
));
TypographyMuted.displayName = 'TypographyMuted';

export const TypographyLarge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--tei-text-strong)]', className)}
      {...props}
    />
  ),
);
TypographyLarge.displayName = 'TypographyLarge';

export const TypographySmall = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small ref={ref} className={cn('text-sm font-medium leading-none', className)} {...props} />
  ),
);
TypographySmall.displayName = 'TypographySmall';
