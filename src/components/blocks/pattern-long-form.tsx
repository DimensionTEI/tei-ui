'use client';
import * as React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Patrón de formulario largo / multi-paso. Composición:
 *   - header: título + estado de guardado (CheckCircle2 + tiempo)
 *   - stepper de pasos con indicador del actual + completados
 *   - body: contenido del paso actual (children)
 *   - footer sticky: Volver / Guardar / Siguiente
 *
 * El consumidor controla `currentStep`, `saving`, `lastSavedAt` y los
 * children del paso. Diseñado para integrarse con react-hook-form o
 * con el estado que prefiera.
 */

export type LongFormStep = {
  id: string;
  label: string;
  /** Si está marcado como completado, se muestra con check. */
  done?: boolean;
};

export function PatternLongForm({
  title,
  subtitle,
  steps,
  currentStep,
  onStepChange,
  lastSavedAt,
  saving = false,
  onSubmit,
  onBack,
  onNext,
  submitLabel = 'Guardar borrador',
  nextLabel = 'Siguiente',
  backLabel = 'Atrás',
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  steps: LongFormStep[];
  currentStep: string;
  onStepChange?: (id: string) => void;
  /** Texto a mostrar tras el check verde. Ej: "Guardado hace 2 min". */
  lastSavedAt?: React.ReactNode;
  saving?: boolean;
  onSubmit?: () => void;
  onBack?: () => void;
  onNext?: () => void;
  submitLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  backLabel?: React.ReactNode;
  children: React.ReactNode;
}) {
  const currentIdx = steps.findIndex((s) => s.id === currentStep);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === steps.length - 1;

  return (
    <Card className="overflow-hidden p-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--tei-text-strong)]">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--tei-muted)]">{subtitle}</p>
          )}
        </div>
        {lastSavedAt && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--tei-success)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {lastSavedAt}
          </span>
        )}
      </header>

      <ol className="flex flex-wrap items-center gap-2 border-b border-[var(--tei-border)] px-6 py-4">
        {steps.map((s, i) => {
          const active = s.id === currentStep;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStepChange?.(s.id)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-[var(--tei-bg-secondary)] font-medium text-[var(--tei-text-strong)]'
                    : 'text-[var(--tei-muted)] hover:bg-[var(--tei-bg-secondary)] hover:text-[var(--tei-text)]',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold',
                    s.done
                      ? 'border-[var(--tei-success)] bg-[var(--tei-success)] text-[var(--tei-accent-fg)]'
                      : active
                        ? 'border-[var(--tei-accent)] bg-[var(--tei-accent)] text-[var(--tei-accent-fg)]'
                        : 'border-[var(--tei-border-strong)] text-[var(--tei-muted)]',
                  )}
                >
                  {s.done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-px w-8 bg-[var(--tei-border)] sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="px-6 py-6 lg:px-8">{children}</div>

      <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[var(--tei-border)] bg-[var(--tei-surface)] px-6 py-3">
        <Button variant="outline" onClick={onBack} disabled={isFirst || saving}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
        <div className="flex items-center gap-2">
          {onSubmit && (
            <Button variant="ghost" onClick={onSubmit} disabled={saving}>
              <Save className="h-4 w-4" />
              {submitLabel}
            </Button>
          )}
          <Button onClick={onNext} disabled={isLast || saving}>
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </Card>
  );
}
