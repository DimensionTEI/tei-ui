import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Pantalla vacía estandarizada — icono opcional, título, descripción y
 * acciones. Para listas vacías, paneles sin datos, búsquedas sin
 * resultados, etc.
 */
export const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
  }
>(({ icon, title, description, actions, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--tei-border)] bg-[var(--tei-bg-secondary)]/40 p-12 text-center',
      className,
    )}
    {...props}
  >
    {icon && (
      <div className="text-[var(--tei-muted)] [&>svg]:h-10 [&>svg]:w-10">{icon}</div>
    )}
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-[var(--tei-text-strong)]">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--tei-muted)]">{description}</p>
      )}
    </div>
    {actions && <div className="mt-2 flex items-center gap-2">{actions}</div>}
  </div>
));
EmptyState.displayName = 'EmptyState';
