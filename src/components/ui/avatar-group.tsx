'use client';
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Tone = 'cyan' | 'blue' | 'yellow' | 'coral' | 'neutral';

interface Person {
  name: string;
  src?: string;
  alt?: string;
  tone?: Tone;
}

const sizeClass = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
} as const;

const CYCLE: Tone[] = ['cyan', 'coral', 'yellow', 'blue'];

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
        {visible.map((p, i) => {
          const tone = p.tone ?? CYCLE[i % CYCLE.length];
          return (
            <Avatar
              key={i}
              className={cn(sizeClass[size], 'ring-2 ring-[var(--color-bg)]')}
            >
              {p.src && <AvatarImage src={p.src} alt={p.alt ?? p.name} />}
              <AvatarFallback tone={tone}>{initials(p.name)}</AvatarFallback>
            </Avatar>
          );
        })}
        {overflow > 0 && (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-[var(--color-bg)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]',
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
