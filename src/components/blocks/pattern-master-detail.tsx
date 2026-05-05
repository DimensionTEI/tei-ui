'use client';
import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Patrón master-detail — lista a la izquierda, detalle a la derecha.
 * Para bandejas, tickets, conversaciones. En móvil colapsa: si hay
 * `selectedId` muestra solo el detalle (con back button), si no la
 * lista entera.
 */

export type MasterItem<TData = unknown> = {
  id: string;
  data: TData;
};

export function PatternMasterDetail<TData>({
  items,
  selectedId,
  onSelect,
  renderListItem,
  renderDetail,
  searchPlaceholder = 'Buscar…',
  searchValue,
  onSearch,
  toolbar,
  emptyDetail,
}: {
  items: MasterItem<TData>[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Render del item en la lista. `selected` indica si es el activo. */
  renderListItem: (item: MasterItem<TData>, selected: boolean) => React.ReactNode;
  /** Render del panel de detalle. Se invoca solo si hay item seleccionado. */
  renderDetail: (item: MasterItem<TData>) => React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (q: string) => void;
  /** Acciones extra encima de la lista — botón "Marcar todos leídos", etc. */
  toolbar?: React.ReactNode;
  /** Qué mostrar cuando no hay item seleccionado. */
  emptyDetail?: React.ReactNode;
}) {
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
  const showList = !isMobile || !selected;
  const showDetail = !isMobile || selected;

  return (
    <div className="rounded-2xl border border-[var(--tei-border)] bg-[var(--tei-surface)]">
      <div className="grid min-h-[36rem] grid-cols-1 lg:grid-cols-[20rem_1fr]">
        {showList && (
          <aside className="flex flex-col border-b border-[var(--tei-border)] lg:border-b-0 lg:border-r">
            <header className="space-y-2 border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tei-muted)]" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="pl-9"
                />
              </div>
              {toolbar && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  {toolbar}
                </div>
              )}
            </header>
            <ul className="flex-1 divide-y divide-[var(--tei-border)] overflow-y-auto">
              {items.map((it) => {
                const isSelected = it.id === selectedId;
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(it.id)}
                      className={cn(
                        'block w-full px-3 py-3 text-left text-sm transition-colors hover:bg-[var(--tei-bg-secondary)]',
                        isSelected && 'bg-[var(--tei-bg-secondary)]',
                      )}
                    >
                      {renderListItem(it, isSelected)}
                    </button>
                  </li>
                );
              })}
              {items.length === 0 && (
                <li className="p-6 text-center text-sm text-[var(--tei-muted)]">Sin elementos.</li>
              )}
            </ul>
          </aside>
        )}

        {showDetail && (
          <main className="flex flex-col">
            {selected ? (
              <>
                {isMobile && (
                  <div className="border-b border-[var(--tei-border)] p-2">
                    <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
                      ← Volver a la lista
                    </Button>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">{renderDetail(selected)}</div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-12 text-center text-sm text-[var(--tei-muted)]">
                {emptyDetail ?? 'Selecciona un elemento de la lista para ver el detalle.'}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
