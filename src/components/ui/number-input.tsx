'use client';
import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  invalid?: boolean;
  suffix?: React.ReactNode;
  onValueChange?: (value: number) => void;
}

function clamp(n: number, min?: number | string, max?: number | string) {
  let lo = -Infinity;
  let hi = Infinity;
  if (min !== undefined && min !== '') lo = Number(min);
  if (max !== undefined && max !== '') hi = Number(max);
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ invalid, suffix, onValueChange, className, value, defaultValue, min, max, step = 1, disabled, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const bump = (dir: 1 | -1) => {
      const input = innerRef.current;
      if (!input) return;
      const current = Number(input.value) || 0;
      const stepNum = Number(step) || 1;
      const next = clamp(current + dir * stepNum, min, max);
      input.value = String(next);
      onValueChange?.(next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    return (
      <div
        className={cn(
          'inline-flex items-stretch overflow-hidden rounded-md border bg-[var(--tei-surface)] transition-colors',
          'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[var(--tei-bg)]',
          disabled && 'opacity-50',
          invalid
            ? 'border-[var(--tei-danger)] focus-within:ring-[var(--tei-danger)]'
            : 'border-[var(--tei-border)] focus-within:ring-[var(--tei-focus-ring)]',
          className,
        )}
      >
        <button
          type="button"
          aria-label="Decrementar"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => bump(-1)}
          className="inline-flex w-9 items-center justify-center border-r border-[var(--tei-border)] text-[var(--tei-muted)] transition-colors hover:bg-[var(--tei-bg-secondary)] hover:text-[var(--tei-text)] disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          ref={innerRef}
          type="number"
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className="w-20 appearance-none border-0 bg-transparent px-2 py-2 text-center text-sm font-semibold tabular-nums text-[var(--tei-text-strong)] focus:outline-none disabled:cursor-not-allowed [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
        {suffix && (
          <span className="inline-flex items-center border-l border-[var(--tei-border)] bg-[var(--tei-bg-secondary)] px-2 font-mono text-xs text-[var(--tei-muted)]">
            {suffix}
          </span>
        )}
        <button
          type="button"
          aria-label="Incrementar"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => bump(1)}
          className="inline-flex w-9 items-center justify-center border-l border-[var(--tei-border)] text-[var(--tei-muted)] transition-colors hover:bg-[var(--tei-bg-secondary)] hover:text-[var(--tei-text)] disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';
