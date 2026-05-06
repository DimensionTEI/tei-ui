'use client';
import * as React from 'react';
import { Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  at: React.ReactNode;
  unread?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export interface NotificationInboxProps {
  items: Notification[];
  emptyText?: React.ReactNode;
  onMarkAllRead?: () => void;
  onItemClick?: (notification: Notification) => void;
  side?: 'left' | 'right';
  className?: string;
}

export function NotificationInbox({
  items,
  emptyText = 'Sin notificaciones nuevas.',
  onMarkAllRead,
  onItemClick,
  side = 'right',
  className,
}: NotificationInboxProps) {
  const unread = items.filter((n) => n.unread).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Notificaciones"
          className={cn(
            'relative inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--tei-text)] transition-colors hover:bg-[var(--tei-bg-secondary)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tei-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tei-bg)]',
            className,
          )}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span
              aria-label={`${unread} sin leer`}
              className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--tei-danger)] px-1 text-[10px] font-bold tabular-nums text-white"
            >
              {unread}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={side} className="w-96 max-w-full">
        <div className="flex items-center justify-between border-b border-[var(--tei-border)] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[var(--tei-text-strong)]">Notificaciones</h2>
            <p className="text-xs text-[var(--tei-muted)]">
              {unread === 0 ? 'Sin nuevas' : `${unread} sin leer`}
            </p>
          </div>
          {unread > 0 && onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-[var(--tei-muted)] hover:text-[var(--tei-text-strong)]"
            >
              Marcar todo
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="py-12 px-5 text-center text-sm text-[var(--tei-muted)]">{emptyText}</p>
          ) : (
            <ul className="divide-y divide-[var(--tei-border)]">
              {items.map((n) => {
                const Inner = (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--tei-bg-secondary)] text-[var(--tei-muted)] [&>svg]:h-4 [&>svg]:w-4"
                    >
                      {n.icon ?? <Bell />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-sm leading-snug',
                          n.unread
                            ? 'font-bold text-[var(--tei-text-strong)]'
                            : 'text-[var(--tei-text)]',
                        )}
                      >
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="mt-1 line-clamp-2 text-xs leading-snug text-[var(--tei-muted)]">
                          {n.body}
                        </p>
                      )}
                      <p className="mt-1.5 font-mono text-[11px] text-[var(--tei-muted)]">{n.at}</p>
                    </div>
                    {n.unread && (
                      <span
                        aria-label="Sin leer"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--tei-danger)]"
                      />
                    )}
                  </>
                );
                const cls =
                  'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--tei-bg-secondary)]';
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <a href={n.href} className={cls} onClick={() => onItemClick?.(n)}>
                        {Inner}
                      </a>
                    ) : (
                      <button type="button" className={cls} onClick={() => onItemClick?.(n)}>
                        {Inner}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
