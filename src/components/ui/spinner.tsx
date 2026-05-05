import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Spinner básico — wrapper alrededor de Loader2 con tamaño y color
 * controlables vía className. Para estados de carga inline.
 */
export const Spinner = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement> & { size?: number }
>(({ className, size = 16, ...props }, ref) => (
  <Loader2
    ref={ref}
    width={size}
    height={size}
    className={cn('animate-spin text-[var(--tei-muted)]', className)}
    {...props}
  />
));
Spinner.displayName = 'Spinner';
