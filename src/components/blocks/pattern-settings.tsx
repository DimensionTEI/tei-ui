'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

/**
 * Patrón settings — header con título + descripción, tabs de nivel
 * superior, y secciones internas con cabecera (`title` + `description`)
 * + bloque de contenido. La "zona peligrosa" aparece destacada con
 * borde rojo si la marcas con `danger`.
 *
 * El consumidor define los tabs y dentro de cada uno compone con
 * <SettingsSection>.
 */

export function PatternSettings({
  title,
  description,
  tabs,
  defaultTab,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  tabs: { id: string; label: string }[];
  defaultTab?: string;
  /** Children deben ser uno o más <TabsContent value="..."> con el id del tab. */
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--tei-border)] bg-[var(--tei-surface)]">
      <header className="border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-6 py-5">
        <h1 className="font-[var(--tei-font-display)] text-2xl font-semibold tracking-tight text-[var(--tei-text-strong)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--tei-muted)]">{description}</p>
        )}
      </header>
      <div className="p-6 lg:p-8">
        <Tabs defaultValue={defaultTab ?? tabs[0]?.id}>
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-6">{children}</div>
        </Tabs>
      </div>
    </div>
  );
}

/**
 * Sección dentro de un tab: cabecera (label + hint) y bloque de
 * contenido. Si `danger`, el bloque va con borde de --tei-danger
 * para resaltar acciones destructivas (eliminar workspace, etc).
 */
export function SettingsSection({
  title,
  description,
  danger,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <header>
        <h2
          className={cn(
            'font-semibold',
            danger ? 'text-[var(--tei-danger)]' : 'text-[var(--tei-text-strong)]',
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--tei-muted)]">{description}</p>
        )}
      </header>
      <div
        className={cn(
          'rounded-md border p-4',
          danger
            ? 'border-[var(--tei-danger)]/40 bg-[var(--tei-danger)]/5'
            : 'border-[var(--tei-border)] bg-[var(--tei-surface)]',
        )}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Helper: una fila label-input en una sección (descripcion arriba,
 * input/control debajo). Muchas veces queremos varias agrupadas,
 * separadas por <Separator>.
 */
export function SettingsRow({
  label,
  description,
  control,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  control: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-[var(--tei-text)]">{label}</p>
        {description && (
          <p className="text-xs text-[var(--tei-muted)]">{description}</p>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export { TabsContent };
export { Separator as SettingsSeparator };
