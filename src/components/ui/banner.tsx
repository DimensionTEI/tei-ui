'use client';
import * as React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium',
  {
    variants: {
      variant: {
        info: 'border-[var(--tei-info)]/40 bg-[var(--tei-info)]/5 text-[var(--tei-info)]',
        success:
          'border-[var(--tei-success)]/40 bg-[var(--tei-success)]/5 text-[var(--tei-success)]',
        warning:
          'border-[var(--tei-warning)]/40 bg-[var(--tei-warning)]/5 text-[var(--tei-warning)]',
        danger:
          'border-[var(--tei-danger)]/40 bg-[var(--tei-danger)]/5 text-[var(--tei-danger)]',
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

const iconByVariant = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof bannerVariants> {
  closable?: boolean;
  action?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = 'info', closable, action, onClose, className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(true);
    if (!open) return null;
    const Icon = iconByVariant[variant ?? 'info'];
    return (
      <div
        ref={ref}
        role={variant === 'danger' ? 'alert' : 'status'}
        className={cn(bannerVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 leading-snug">{children}</div>
        {action && <div className="shrink-0 font-bold">{action}</div>}
        {closable && (
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => {
              onClose?.();
              setOpen(false);
            }}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
Banner.displayName = 'Banner';

export { bannerVariants };
