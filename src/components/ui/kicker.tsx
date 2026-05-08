import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'cyan' | 'blue' | 'yellow' | 'coral' | 'ink';

export interface KickerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: Tone;
}

/**
 * Kicker — etiqueta tipográfica de sección al estilo TEI canónico.
 * 11px bold uppercase con tracking 0.14em y color tonal.
 *
 * Ejemplo:
 *   <Kicker tone="cyan">Componentes · Feedback</Kicker>
 *   <h1>Título principal</h1>
 */
export const Kicker = React.forwardRef<HTMLParagraphElement, KickerProps>(
  ({ tone = 'cyan', className, ...props }, ref) => (
    <p ref={ref} className={cn(`tei-kicker-${tone}`, className)} {...props} />
  ),
);
Kicker.displayName = 'Kicker';
