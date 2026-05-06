'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ConfirmInlineProps extends React.HTMLAttributes<HTMLSpanElement> {
  prompt?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

export const ConfirmInline = React.forwardRef<HTMLSpanElement, ConfirmInlineProps>(
  (
    {
      prompt = '¿Confirmar?',
      confirmLabel = 'Sí',
      cancelLabel = 'Cancelar',
      variant = 'destructive',
      onConfirm,
      onCancel,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const yesRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      if (open) yesRef.current?.focus();
    }, [open]);

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          onCancel?.();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open, onCancel]);

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center', className)}
        {...props}
      >
        {!open && (
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            className="inline-flex items-center"
          >
            {children}
          </span>
        )}
        {open && (
          <span className="inline-flex items-center gap-2 rounded-md border border-[var(--tei-danger)]/30 bg-[var(--tei-danger)]/5 px-3 py-1.5">
            <span className="text-sm font-bold text-[var(--tei-danger)]">{prompt}</span>
            <Button
              ref={yesRef}
              size="sm"
              variant={variant}
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              {confirmLabel}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
            >
              {cancelLabel}
            </Button>
          </span>
        )}
      </span>
    );
  },
);
ConfirmInline.displayName = 'ConfirmInline';
