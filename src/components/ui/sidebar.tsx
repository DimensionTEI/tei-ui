'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * Sidebar TEI — declarativo, framework-agnostic.
 *
 * Soporta:
 * - Sub-items inline (`children`) que expanden bajo el padre activo.
 * - Atajos de teclado `g+letter` por item (vía prop `shortcut`).
 * - Franja vertical cyan en item activo (acento canónico TEI).
 *
 * El renderer del Link se inyecta para que sirva tanto en Next.js
 * (`next/link`) como en react-router o `<a>` plano.
 */

export type SidebarItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  /**
   * Letra para el atajo `g+letra`. Ejemplo: `'d'` → el usuario pulsa
   * `g` luego `d` para navegar aquí. Una letra por item; case-insensitive.
   */
  shortcut?: string;
  /**
   * Sub-items renderizados inline cuando este item está activo o cuando
   * alguno de los children está activo. Anidación de un nivel.
   */
  children?: SidebarItem[];
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
  /**
   * Función que navega cuando un atajo `g+letra` coincide. Si no se pasa,
   * se hace `window.location.href = href`.
   */
  onShortcutNavigate?: (href: string) => void;
};

function flattenItems(sections: SidebarSection[]): SidebarItem[] {
  const out: SidebarItem[] = [];
  for (const s of sections) {
    for (const i of s.items) {
      out.push(i);
      if (i.children) out.push(...i.children);
    }
  }
  return out;
}

function isActiveItem(item: SidebarItem): boolean {
  if (item.active) return true;
  return item.children?.some(isActiveItem) ?? false;
}

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
  onShortcutNavigate,
}: SidebarProps) {
  const allItems = React.useMemo(() => flattenItems(sections), [sections]);

  // Atajos g+letter — escucha global, ignora inputs.
  React.useEffect(() => {
    const map = new Map<string, string>();
    for (const it of allItems) {
      if (it.shortcut) map.set(it.shortcut.toLowerCase(), it.href);
    }
    if (map.size === 0) return;

    let armed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const disarm = () => {
      armed = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.matches('input, textarea, [contenteditable="true"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (armed) {
        const href = map.get(k);
        if (href) {
          e.preventDefault();
          if (onShortcutNavigate) onShortcutNavigate(href);
          else window.location.href = href;
        }
        disarm();
        return;
      }
      if (k === 'g') {
        armed = true;
        timeoutId = setTimeout(disarm, 1200);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      disarm();
    };
  }, [allItems, onShortcutNavigate]);

  return (
    <aside
      className={cn(
        'hidden w-60 shrink-0 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-chrome)] md:flex md:flex-col',
        className,
      )}
    >
      <div className="flex h-full flex-col p-3">
        {logo && <div className="mb-6 flex items-center gap-2 px-2">{logo}</div>}

        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {sections.map((section, si) => (
            <div key={si} className="flex flex-col gap-1">
              {section.title && (
                <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarItemRow
                  key={item.href}
                  item={item}
                  renderLink={renderLink}
                  expanded={isActiveItem(item)}
                  level={0}
                />
              ))}
              {si < sections.length - 1 && <Separator className="my-2" />}
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

function SidebarItemRow({
  item,
  renderLink,
  expanded,
  level,
}: {
  item: SidebarItem;
  renderLink: NonNullable<SidebarProps['renderLink']>;
  expanded: boolean;
  level: 0 | 1;
}) {
  const Icon = item.icon;
  const isActive = item.active === true;

  const inner = (
    <span
      className={cn(
        'group/sidebar-item relative flex items-center gap-3 rounded-md text-sm transition-colors',
        level === 0 ? 'px-3 py-2' : 'pl-9 pr-3 py-1.5 text-[13px]',
        isActive
          ? 'bg-[var(--color-bg-tinted)] font-semibold text-[var(--color-text-heading)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
        // Stripe vertical cyan en activo (canónico TEI)
        isActive && 'shadow-[inset_3px_0_0_0_var(--color-cyan-500)]',
      )}
    >
      {Icon && level === 0 && (
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            isActive ? 'text-[var(--color-cyan-500)] dark:text-[var(--color-cyan-400)]' : '',
          )}
        />
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <kbd
          aria-hidden="true"
          className={cn(
            'ml-auto hidden shrink-0 rounded border px-1 font-mono text-[10px] font-semibold tabular-nums leading-tight md:inline-flex md:items-center',
            'border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]',
            'transition-opacity opacity-60 group-hover/sidebar-item:opacity-100',
            isActive && 'opacity-100',
          )}
        >
          g {item.shortcut}
        </kbd>
      )}
    </span>
  );

  return (
    <>
      {renderLink(item, inner)}
      {expanded && item.children && item.children.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {item.children.map((child) => (
            <SidebarItemRow
              key={child.href}
              item={child}
              renderLink={renderLink}
              expanded={isActiveItem(child)}
              level={1}
            />
          ))}
        </div>
      )}
    </>
  );
}
