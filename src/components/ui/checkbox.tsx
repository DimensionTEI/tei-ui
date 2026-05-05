'use client';
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-[var(--tei-border-strong)] bg-[var(--tei-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tei-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tei-bg)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--tei-accent)] data-[state=checked]:bg-[var(--tei-accent)] data-[state=checked]:text-[var(--tei-accent-fg)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
