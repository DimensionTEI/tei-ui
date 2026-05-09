'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Sidebar TEI canónico — declarativo, framework-agnostic.
 *
 * Soporta:
 * - Sub-items inline (`children`) que expanden bajo el padre activo.
 * - Atajos de teclado `g+letter` por item (`shortcut`), siempre visibles.
 * - Tone por item (icono coloreado) y por section (kicker tonal).
 * - Active styling distinto: parent con bg-cyan, child con barra lateral.
 *
 * El renderer del Link se inyecta para Next.js / React Router / `<a>`.
 */

export type Tone = 'cyan' | 'blue' | 'yellow' | 'coral' | 'ink';

export type SidebarItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  /** Letra para el atajo `g+letra`. Una letra por item. */
  shortcut?: string;
  /** Sub-items renderizados inline cuando este item o un child está activo. */
  children?: SidebarItem[];
  /** Tono del icono en reposo. En active state usa cyan. Default: ink (text-muted). */
  tone?: Tone;
};

export type SidebarSection = {
  title?: string;
  /** Tono del kicker (label de sección). Default: muted. */
  tone?: Tone;
  items: SidebarItem[];
};

export type SidebarProps = {
  logo?: React.ReactNode;
  sections: SidebarSection[];
  footer?: React.ReactNode;
  className?: string;
  renderLink?: (item: SidebarItem, children: React.ReactNode) => React.ReactNode;
  onShortcutNavigate?: (href: string) => void;
};

const iconToneClass: Record<Tone, string> = {
  cyan:   'text-[var(--color-cyan-500)] dark:text-[var(--color-cyan-400)]',
  blue:   'text-[var(--color-blue-500)] dark:text-[var(--color-blue-400)]',
  yellow: 'text-[var(--color-yellow-500)] dark:text-[var(--color-yellow-400)]',
  coral:  'text-[var(--color-coral-500)] dark:text-[var(--color-coral-400)]',
  ink:    'text-[var(--color-text-muted)]',
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

  // Atajos g+letter
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

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
          {sections.map((section, si) => (
            <div key={si} className="flex flex-col gap-1">
              {section.title && (
                <p
                  className={cn(
                    'mb-1 px-3',
                    section.tone
                      ? `tei-kicker-${section.tone}`
                      : 'text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]',
                  )}
                >
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
            </div>
          ))}
        </nav>

        {footer && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
            {footer}
          </div>
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
        'group/sidebar-item relative flex items-center gap-3 rounded-md transition-colors',
        // Layout
        level === 0 ? 'px-3 py-2 text-sm font-medium' : 'pl-9 pr-3 py-1.5 text-[13px] font-medium',
        // Reposo level 0 — text-primary para mejor legibilidad
        !isActive && level === 0 &&
          'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
        // Reposo level 1 — children un poco más suaves que parents
        !isActive && level === 1 &&
          'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        // Active level 0 — bg cyan + label theme-aware (oxford light / blanco dark) + bold
        isActive && level === 0 &&
          'bg-[var(--color-cyan-50)] text-[var(--color-text-heading)] !font-bold dark:bg-[rgb(26_163_224/0.20)]',
        // Active level 1 — barra vertical 3px + label theme-aware + bold
        isActive && level === 1 &&
          "text-[var(--color-text-heading)] !font-bold before:content-[''] before:absolute before:left-[14px] before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-[var(--color-cyan-500)]",
      )}
    >
      {Icon && level === 0 && (
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            isActive
              ? 'text-[var(--color-cyan-500)] dark:text-[var(--color-cyan-400)]'
              : iconToneClass[item.tone ?? 'ink'],
          )}
        />
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span
          aria-hidden="true"
          className={cn(
            'ml-auto hidden shrink-0 md:inline-flex items-center gap-0.5',
            'transition-opacity opacity-60 group-hover/sidebar-item:opacity-100',
            isActive && 'opacity-100',
          )}
        >
          <kbd className="rounded border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-1 font-mono text-[10px] font-bold leading-tight text-[var(--color-text-primary)] dark:bg-[var(--color-bg-subtle)]">
            G
          </kbd>
          <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">·</span>
          <kbd className="rounded border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-1 font-mono text-[10px] font-bold leading-tight text-[var(--color-text-primary)] dark:bg-[var(--color-bg-subtle)]">
            {item.shortcut.toUpperCase()}
          </kbd>
        </span>
      )}
    </span>
  );

  return (
    <>
      {renderLink(item, inner)}
      {expanded && item.children && item.children.length > 0 && (
        <div className="relative flex flex-col gap-0.5">
          {/* Guía vertical que recorre todos los children — patrón TEI canónico */}
          <span
            aria-hidden="true"
            className="absolute left-[15px] top-1 bottom-1 w-px bg-[var(--color-border-default)]"
          />
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
