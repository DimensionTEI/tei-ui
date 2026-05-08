import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-md border px-4 py-3 text-sm flex items-start gap-3 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-0.5 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-bg-elevated)] border-[var(--color-border-subtle)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-text-muted)]',
        info:
          'bg-[var(--color-bg-tinted)] border-[var(--color-cyan-200)] text-[var(--color-cyan-700)] [&>svg]:text-[var(--color-cyan-600)] dark:bg-[rgb(26_163_224/0.18)] dark:border-[rgb(26_163_224/0.45)] dark:text-[var(--color-cyan-300)] dark:[&>svg]:text-[var(--color-cyan-300)]',
        success:
          'bg-[var(--color-success-50)] border-[var(--color-success-300)] text-[var(--color-success-700)] [&>svg]:text-[var(--color-success-600)]',
        warning:
          'bg-[var(--color-yellow-50)] border-[var(--color-yellow-300)] text-[var(--color-yellow-800)] [&>svg]:text-[var(--color-yellow-700)] dark:bg-[rgb(245_195_51/0.20)] dark:border-[rgb(245_195_51/0.45)] dark:text-[var(--color-yellow-300)] dark:[&>svg]:text-[var(--color-yellow-300)]',
        destructive:
          'bg-[var(--color-coral-50)] border-[var(--color-coral-300)] text-[var(--color-coral-700)] [&>svg]:text-[var(--color-coral-600)] dark:bg-[rgb(232_90_61/0.18)] dark:border-[rgb(232_90_61/0.45)] dark:text-[var(--color-coral-300)] dark:[&>svg]:text-[var(--color-coral-300)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-bold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-relaxed [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { alertVariants };
