import { cn } from '@/lib/utils';

/**
 * Inline `<code>` y bloque `<pre>` con tokens TEI y JetBrains Mono.
 * Pensado para fragmentos cortos en docs/UI; el renderizador Markdown
 * del chat tiene su propio paso porque inyecta children no triviales.
 */

export function InlineCode({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'rounded bg-[var(--tei-bg-secondary)] px-1 py-0.5 font-mono text-[0.875em] text-[var(--tei-text-strong)]',
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        'my-2 overflow-x-auto rounded-md border border-[var(--tei-border)] bg-[var(--tei-surface-raised)] p-3 font-mono text-xs leading-relaxed text-[var(--tei-text)]',
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  );
}
