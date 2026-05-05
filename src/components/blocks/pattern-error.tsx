'use client';
import * as React from 'react';
import { FileQuestion, Home, Mail, RefreshCcw, ServerCrash, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Patrón de página de error: 404, 403, 500, mantenimiento, etc.
 * Tarjeta centrada con icono coloreado, código grande, descripción y
 * dos acciones (primaria + secundaria opcional).
 */

type ErrorVariant = '404' | '403' | '500' | 'maintenance' | 'custom';

const PRESETS: Record<
  Exclude<ErrorVariant, 'custom'>,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }
> = {
  '404': {
    title: 'Esta página no existe',
    description:
      'El enlace que ha seguido apunta a una página que no encontramos. Quizá fue movida o la URL tiene una errata.',
    icon: <FileQuestion className="h-10 w-10" />,
    color: 'var(--tei-warning)',
  },
  '403': {
    title: 'No tiene acceso a este recurso',
    description:
      'Su sesión está activa, pero su rol no incluye esta sección. Pida a un administrador que le promocione si lo necesita.',
    icon: <ShieldAlert className="h-10 w-10" />,
    color: 'var(--tei-danger)',
  },
  '500': {
    title: 'Algo se rompió en nuestro lado',
    description:
      'El servidor devolvió un error inesperado. El equipo recibe automáticamente el aviso y ya está mirándolo.',
    icon: <ServerCrash className="h-10 w-10" />,
    color: 'var(--tei-danger)',
  },
  maintenance: {
    title: 'Mantenimiento programado',
    description:
      'Estamos aplicando mejoras. Volveremos en unos minutos. Disculpe las molestias.',
    icon: <RefreshCcw className="h-10 w-10" />,
    color: 'var(--tei-info)',
  },
};

export function PatternError({
  variant = '404',
  code,
  title,
  description,
  primary,
  secondary,
  hint,
}: {
  variant?: ErrorVariant;
  /** Si variant='custom' o quieres sobreescribir, p.ej. "418". */
  code?: string;
  title?: string;
  description?: string;
  primary?: { label: string; onClick?: () => void; href?: string; icon?: React.ReactNode };
  secondary?: { label: string; onClick?: () => void; href?: string };
  /** Texto pequeño bajo las acciones, p.ej. una referencia de ticket. */
  hint?: React.ReactNode;
}) {
  const preset = variant !== 'custom' ? PRESETS[variant] : null;
  const finalCode = code ?? (variant !== 'custom' ? variant : '');
  const finalTitle = title ?? preset?.title ?? '';
  const finalDescription = description ?? preset?.description ?? '';
  const finalColor = preset?.color ?? 'var(--tei-muted)';
  const finalIcon = preset?.icon ?? <FileQuestion className="h-10 w-10" />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--tei-bg)] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--tei-border)] bg-[var(--tei-surface)] p-8 text-center shadow-[var(--tei-shadow-md)]">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `color-mix(in oklab, ${finalColor} 15%, transparent)`, color: finalColor }}
        >
          {finalIcon}
        </div>
        {finalCode && (
          <p className="font-[var(--tei-font-display)] text-5xl font-bold tracking-tight" style={{ color: finalColor }}>
            {finalCode}
          </p>
        )}
        <h1 className="mt-3 text-xl font-semibold text-[var(--tei-text-strong)]">{finalTitle}</h1>
        <p className="mt-2 text-sm text-[var(--tei-muted)]">{finalDescription}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {primary && (
            <Button asChild={!!primary.href} onClick={primary.onClick}>
              {primary.href ? (
                <a href={primary.href}>
                  {primary.icon ?? <Home className="h-4 w-4" />}
                  {primary.label}
                </a>
              ) : (
                <>
                  {primary.icon ?? <Home className="h-4 w-4" />}
                  {primary.label}
                </>
              )}
            </Button>
          )}
          {secondary && (
            <Button variant="outline" asChild={!!secondary.href} onClick={secondary.onClick}>
              {secondary.href ? <a href={secondary.href}>{secondary.label}</a> : <>{secondary.label}</>}
            </Button>
          )}
          {!primary && !secondary && (
            <Button asChild>
              <a href="/">
                <Home className="h-4 w-4" />
                Volver al inicio
              </a>
            </Button>
          )}
        </div>
        {hint && <p className="mt-5 text-xs text-[var(--tei-muted)]">{hint}</p>}
      </div>
    </div>
  );
}

// Atajos para los presets más comunes.
export const Pattern404 = (
  props: Omit<React.ComponentProps<typeof PatternError>, 'variant'>,
) => <PatternError variant="404" {...props} />;

export const Pattern403 = (
  props: Omit<React.ComponentProps<typeof PatternError>, 'variant'>,
) => (
  <PatternError
    variant="403"
    primary={{ label: 'Solicitar acceso', icon: <Mail className="h-4 w-4" />, href: 'mailto:soporte@example.com' }}
    secondary={{ label: 'Volver al inicio', href: '/' }}
    {...props}
  />
);

export const Pattern500 = (
  props: Omit<React.ComponentProps<typeof PatternError>, 'variant'>,
) => (
  <PatternError
    variant="500"
    primary={{ label: 'Reintentar', icon: <RefreshCcw className="h-4 w-4" />, onClick: () => window.location.reload() }}
    {...props}
  />
);
