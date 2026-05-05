'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Patrón two-column — dos columnas tipo "settings": navegación lateral
 * + contenido principal. La columna lateral colapsa a fila horizontal
 * scrolleable en móvil.
 *
 * Pasa `sections` con id, label e icono. El consumidor controla
 * `activeId` y dispara `onSelect`.
 */

export type TwoColumnSection = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: React.ReactNode;
};

export function PatternTwoColumn({
  sections,
  activeId,
  onSelect,
  title,
  subtitle,
  children,
  sidebarTitle = 'Secciones',
}: {
  sections: TwoColumnSection[];
  activeId: string;
  onSelect: (id: string) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  sidebarTitle?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {(title || subtitle) && (
        <header className="mb-6">
          {title && (
            <h1 className="font-[var(--tei-font-display)] text-3xl font-semibold tracking-tight text-[var(--tei-text-strong)]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--tei-muted)]">{subtitle}</p>
          )}
        </header>
      )}
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--tei-muted)]">
            {sidebarTitle}
          </p>
          <nav
            className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
            aria-label={sidebarTitle}
          >
            {sections.map((s) => {
              const Icon = s.icon;
              const active = s.id === activeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors lg:w-full',
                    active
                      ? 'bg-[var(--tei-bg-secondary)] font-medium text-[var(--tei-text-strong)]'
                      : 'text-[var(--tei-muted)] hover:bg-[var(--tei-bg-secondary)] hover:text-[var(--tei-text)]',
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="flex-1">{s.label}</span>
                  {s.hint && (
                    <span className="text-xs text-[var(--tei-muted)]">{s.hint}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
