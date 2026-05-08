'use client';
import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold',
  {
    variants: {
      size: {
        sm: 'h-7 w-7 text-[10px]',
        md: 'h-9 w-9 text-xs',
        lg: 'h-11 w-11 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
));
Avatar.displayName = 'Avatar';

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const fallbackVariants = cva(
  'flex h-full w-full items-center justify-center border',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)]',
        cyan:
          'bg-[var(--color-cyan-100)] text-[var(--color-cyan-700)] border-[var(--color-cyan-200)] dark:bg-[rgb(26_163_224/0.25)] dark:text-[var(--color-cyan-300)] dark:border-[rgb(26_163_224/0.45)]',
        blue:
          'bg-[var(--color-blue-100)] text-[var(--color-blue-700)] border-[var(--color-blue-200)] dark:bg-[rgb(30_150_212/0.25)] dark:text-[var(--color-blue-300)] dark:border-[rgb(30_150_212/0.45)]',
        yellow:
          'bg-[var(--color-yellow-100)] text-[var(--color-yellow-800)] border-[var(--color-yellow-200)] dark:bg-[rgb(245_195_51/0.25)] dark:text-[var(--color-yellow-300)] dark:border-[rgb(245_195_51/0.45)]',
        coral:
          'bg-[var(--color-coral-100)] text-[var(--color-coral-700)] border-[var(--color-coral-200)] dark:bg-[rgb(232_90_61/0.25)] dark:text-[var(--color-coral-300)] dark:border-[rgb(232_90_61/0.45)]',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & VariantProps<typeof fallbackVariants>
>(({ className, tone, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(fallbackVariants({ tone }), className)}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { avatarVariants, fallbackVariants };
