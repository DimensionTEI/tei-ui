'use client';
import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Patrón tabla avanzada — versión compuesta y opinada:
 *   - búsqueda + filtros activos como tags eliminables
 *   - sort por columna
 *   - selección múltiple con bulk actions sticky
 *   - footer con paginación y meta
 *   - cabeceras sticky al scroll
 *
 * Si necesitas una tabla genérica con poca personalización, prefiere
 * el componente <DataTable> del registry (basado en tanstack-table).
 *
 * Pasa `columns` con render por celda y `data` cualquiera. El estado
 * de filtros, búsqueda, sort y selección lo gestiona internamente.
 */

export type PatternTableColumn<TRow> = {
  key: string;
  header: React.ReactNode;
  /** Render personalizado de la celda. Por defecto `(row[key] as string)`. */
  cell?: (row: TRow) => React.ReactNode;
  sortable?: boolean;
  /** Para sort. Si no se pasa, se usa `String(row[key])`. */
  sortKey?: (row: TRow) => string | number;
  className?: string;
  align?: 'left' | 'right' | 'center';
};

export type PatternTableFilter = {
  id: string;
  label: React.ReactNode;
};

export function PatternTable<TRow extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Buscar…',
  searchKeys,
  filters,
  onRemoveFilter,
  toolbar,
  bulkActions,
  emptyMessage = 'Sin resultados.',
  pageSize = 10,
}: {
  columns: PatternTableColumn<TRow>[];
  data: TRow[];
  searchPlaceholder?: string;
  /** Campos por los que aplicar la búsqueda en cliente. Si vacío, no busca. */
  searchKeys?: (keyof TRow)[];
  filters?: PatternTableFilter[];
  onRemoveFilter?: (id: string) => void;
  toolbar?: React.ReactNode;
  /** Función render que recibe los IDs seleccionados y devuelve botones. */
  bulkActions?: (selectedIds: Array<TRow['id']>, clear: () => void) => React.ReactNode;
  emptyMessage?: React.ReactNode;
  pageSize?: number;
}) {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [selected, setSelected] = React.useState<Set<TRow['id']>>(new Set());
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!query || !searchKeys?.length) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)),
    );
  }, [data, query, searchKeys]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const getKey = col.sortKey ?? ((r: TRow) => String((r as Record<string, unknown>)[sort.key] ?? ''));
    return [...filtered].sort((a, b) => {
      const va = getKey(a);
      const vb = getKey(b);
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  function toggleSort(key: string) {
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: 'asc' };
      if (cur.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }

  function toggleSelect(id: TRow['id']) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allOnPageSelected = paged.length > 0 && paged.every((r) => selected.has(r.id));
  function toggleSelectAll() {
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) paged.forEach((r) => next.delete(r.id));
      else paged.forEach((r) => next.add(r.id));
      return next;
    });
  }

  const selectedIds = [...selected];
  const hasBulk = bulkActions && selectedIds.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--tei-border)] bg-[var(--tei-surface)]">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-5 py-3">
        {searchKeys?.length ? (
          <div className="relative min-w-60 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tei-muted)]" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        ) : null}
        {filters && filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <Badge key={f.id} variant="secondary" className="gap-1">
                {f.label}
                {onRemoveFilter && (
                  <button
                    type="button"
                    onClick={() => onRemoveFilter(f.id)}
                    aria-label={`Quitar filtro ${f.id}`}
                    className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-[var(--tei-border)]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
        {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
      </header>

      {hasBulk && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--tei-border)] bg-[var(--tei-info)]/5 px-5 py-2 text-sm">
          <span className="font-medium text-[var(--tei-text-strong)]">
            {selectedIds.length} seleccionados
          </span>
          <div className="flex items-center gap-2">{bulkActions(selectedIds, () => setSelected(new Set()))}</div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-[var(--tei-bg-secondary)]">
            <TableRow>
              {bulkActions && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Seleccionar página"
                  />
                </TableHead>
              )}
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    c.align === 'right' && 'text-right',
                    c.align === 'center' && 'text-center',
                    c.className,
                  )}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[var(--tei-muted)] hover:text-[var(--tei-text-strong)]"
                    >
                      {c.header}
                      {sort?.key === c.key ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    <span className="font-semibold uppercase tracking-wider text-[var(--tei-muted)]">
                      {c.header}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions ? 1 : 0)}
                  className="h-24 text-center text-[var(--tei-muted)]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow key={String(row.id)} data-state={selected.has(row.id) ? 'selected' : undefined}>
                  {bulkActions && (
                    <TableCell>
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleSelect(row.id)}
                        aria-label={`Seleccionar ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        c.align === 'right' && 'text-right',
                        c.align === 'center' && 'text-center',
                        c.className,
                      )}
                    >
                      {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-5 py-3 text-xs text-[var(--tei-muted)]">
        <p>
          Mostrando{' '}
          <strong className="text-[var(--tei-text)]">
            {sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, sorted.length)}
          </strong>{' '}
          de <strong className="text-[var(--tei-text)]">{sorted.length}</strong>
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="px-2">
            {safePage} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Siguiente
          </Button>
        </div>
      </footer>
    </div>
  );
}
