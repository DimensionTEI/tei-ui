'use client';
import * as React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

/**
 * Patrón dashboard — composición típica con:
 *   1) header: título + acciones (Exportar, Nuevo)
 *   2) KPIs en grid (StatCard)
 *   3) franja de filtros activos como tags (consumidor)
 *   4) tabla / contenido principal
 *   5) footer con paginación / meta
 *
 * Se exportan las piezas y un wrapper PatternDashboard que las acepta
 * como children. Da libertad para componer y a la vez ofrece la
 * estructura por defecto.
 */

export function PatternDashboard({
  header,
  kpis,
  filters,
  children,
  footer,
}: {
  header?: React.ReactNode;
  kpis?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden p-0">
      {header && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-6 py-4">
          {header}
        </div>
      )}
      {kpis && (
        <div className="grid gap-4 border-b border-[var(--tei-border)] p-6 sm:grid-cols-2 lg:grid-cols-4">
          {kpis}
        </div>
      )}
      {filters && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--tei-border)] px-6 py-4">
          {filters}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-6 py-3 text-xs text-[var(--tei-muted)]">
          {footer}
        </div>
      )}
    </Card>
  );
}

/**
 * KPI individual. Ej: <StatCard label="Activos" value="42" delta="+5" tone="success" hint="vs 37 anterior" />
 */
export function StatCard({
  label,
  value,
  delta,
  tone = 'neutral',
  hint,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  tone?: 'success' | 'danger' | 'warning' | 'neutral';
  hint?: React.ReactNode;
  className?: string;
}) {
  const toneCls =
    tone === 'success'
      ? 'text-[var(--tei-success)]'
      : tone === 'danger'
        ? 'text-[var(--tei-danger)]'
        : tone === 'warning'
          ? 'text-[var(--tei-warning)]'
          : 'text-[var(--tei-muted)]';
  const Trend = tone === 'danger' ? TrendingDown : TrendingUp;
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--tei-border)] bg-[var(--tei-surface)] p-4',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--tei-muted)]">
        {label}
      </p>
      <p className="mt-1 font-[var(--tei-font-display)] text-2xl font-bold tabular-nums text-[var(--tei-text-strong)]">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span className={cn('inline-flex items-center gap-1 font-medium', toneCls)}>
            {tone !== 'neutral' && <Trend className="h-3.5 w-3.5" />}
            {delta}
          </span>
        )}
        {hint && <span className="text-[var(--tei-muted)]">{hint}</span>}
      </div>
    </div>
  );
}
