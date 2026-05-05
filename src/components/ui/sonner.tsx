'use client';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Wrapper de Sonner con tokens TEI. Montar una vez en el layout raíz.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast border border-[var(--tei-border)] bg-[var(--tei-surface)] text-[var(--tei-text)] shadow-[var(--tei-shadow-md)]',
          description: 'group-[.toast]:text-[var(--tei-muted)]',
          actionButton:
            'group-[.toast]:bg-[var(--tei-accent)] group-[.toast]:text-[var(--tei-accent-fg)]',
          cancelButton:
            'group-[.toast]:bg-[var(--tei-bg-secondary)] group-[.toast]:text-[var(--tei-muted)]',
          success: 'group-[.toaster]:!text-[var(--tei-success)]',
          error: 'group-[.toaster]:!text-[var(--tei-danger)]',
          warning: 'group-[.toaster]:!text-[var(--tei-warning)]',
          info: 'group-[.toaster]:!text-[var(--tei-info)]',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
