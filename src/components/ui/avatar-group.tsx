'use client';
import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Person {
  name: string;
  src?: string;
  alt?: string;
}

const sizeClass = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
} as const;

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  people: Person[];
  max?: number;
  size?: keyof typeof sizeClass;
  label?: string;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ people, max = 4, size = 'md', label, className, ...props }, ref) => {
    const visible = people.slice(0, max);
    const overflow = Math.max(0, people.length - max);
    return (
      <div
        ref={ref}
        role="img"
        aria-label={label ?? people.map((p) => p.name).join(', ')}
        className={cn('flex items-center -space-x-2', className)}
        {...props}
      >
        {visible.map((p, i) => (
          <Avatar
            key={i}
            className={cn(
              sizeClass[size],
              'ring-2 ring-[var(--tei-bg)]',
            )}
          >
            {p.src && <AvatarPrimitive.Image src={p.src} alt={p.alt ?? p.name} className="aspect-square h-full w-full object-cover" />}
            <AvatarFallback>{initials(p.name)}</AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-[var(--tei-bg)] bg-[var(--tei-bg-secondary)] text-[var(--tei-text)] border border-[var(--tei-border)]',
              sizeClass[size],
            )}
            aria-hidden="true"
          >
            +{overflow}
          </span>
        )}
      </div>
    );
  },
);
AvatarGroup.displayName = 'AvatarGroup';
