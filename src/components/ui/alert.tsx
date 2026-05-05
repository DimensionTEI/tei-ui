import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-md border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-2px] [&>svg]:h-4 [&>svg]:w-4 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default:
          'border-[var(--tei-border)] bg-[var(--tei-surface)] text-[var(--tei-text)] [&>svg]:text-[var(--tei-muted)]',
        info: 'border-[var(--tei-info)]/40 bg-[var(--tei-info)]/5 text-[var(--tei-info)] [&>svg]:text-[var(--tei-info)]',
        success:
          'border-[var(--tei-success)]/40 bg-[var(--tei-success)]/5 text-[var(--tei-success)] [&>svg]:text-[var(--tei-success)]',
        warning:
          'border-[var(--tei-warning)]/40 bg-[var(--tei-warning)]/5 text-[var(--tei-warning)] [&>svg]:text-[var(--tei-warning)]',
        destructive:
          'border-[var(--tei-danger)]/40 bg-[var(--tei-danger)]/5 text-[var(--tei-danger)] [&>svg]:text-[var(--tei-danger)]',
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
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';
