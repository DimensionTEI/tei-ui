'use client';
import * as React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium',
  {
    variants: {
      variant: {
        info:
          'bg-[var(--color-cyan-50)] border-[var(--color-cyan-200)] text-[var(--color-cyan-800)] [&_svg]:text-[var(--color-cyan-700)] dark:bg-[rgb(26_163_224/0.15)] dark:border-[rgb(26_163_224/0.45)] dark:text-[var(--color-cyan-200)] dark:[&_svg]:text-[var(--color-cyan-300)]',
        success:
          'bg-[var(--color-success-50)] border-[var(--color-success-300)] text-[var(--color-success-700)] [&_svg]:text-[var(--color-success-600)]',
        warning:
          'bg-[var(--color-yellow-50)] border-[var(--color-yellow-300)] text-[var(--color-yellow-800)] [&_svg]:text-[var(--color-yellow-700)] dark:bg-[rgb(245_195_51/0.18)] dark:border-[rgb(245_195_51/0.45)] dark:text-[var(--color-yellow-300)] dark:[&_svg]:text-[var(--color-yellow-300)]',
        danger:
          'bg-[var(--color-coral-50)] border-[var(--color-coral-300)] text-[var(--color-coral-700)] [&_svg]:text-[var(--color-coral-600)] dark:bg-[rgb(232_90_61/0.18)] dark:border-[rgb(232_90_61/0.45)] dark:text-[var(--color-coral-200)] dark:[&_svg]:text-[var(--color-coral-300)]',
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
