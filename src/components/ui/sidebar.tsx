'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * Sidebar genérico — el consumidor pasa `logo`, `sections` y `footer`.
 * El renderer del Link se inyecta para que sirva tanto en Next.js
 * (`next/link`) como en react-router o `<a>` plano.
 */

export type SidebarItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

export type SidebarProps = {
  logo?: React.ReactNode;
  sections: SidebarSection[];
  footer?: React.ReactNode;
  className?: string;
  /** Cómo renderizar cada link. Por defecto un `<a>` plano. */
  renderLink?: (item: SidebarItem, children: React.ReactNode) => React.ReactNode;
};

export function Sidebar({
  logo,
  sections,
  footer,
  className,
  renderLink = (item, children) => (
    <a key={item.href} href={item.href}>
      {children}
    </a>
  ),
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'hidden w-60 shrink-0 border-r border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] md:flex md:flex-col',
        className,
      )}
    >
      <div className="flex h-full flex-col p-3">
        {logo && <div className="mb-6 flex items-center gap-2 px-2">{logo}</div>}

        <nav className="flex flex-1 flex-col gap-3">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-1">
              {section.title && (
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--tei-muted)]">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <span
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      item.active
                        ? 'bg-[var(--tei-surface)] font-medium text-[var(--tei-text-strong)]'
                        : 'text-[var(--tei-muted)] hover:bg-[var(--tei-surface)] hover:text-[var(--tei-text)]',
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </span>
                );
                return (
                  <React.Fragment key={item.href}>{renderLink(item, inner)}</React.Fragment>
                );
              })}
              {i < sections.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </nav>

        {footer && (
          <>
            <Separator className="my-3" />
            <div>{footer}</div>
          </>
        )}
      </div>
    </aside>
  );
}
Sidebar.displayName = 'Sidebar';
