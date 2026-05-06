'use client';
import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileDropzoneProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  name?: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  hint?: React.ReactNode;
  onFiles?: (files: FileList) => void;
}

export const FileDropzone = React.forwardRef<HTMLLabelElement, FileDropzoneProps>(
  (
    { name, accept, multiple, required, disabled, invalid, hint, onFiles, className, ...props },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [over, setOver] = React.useState(false);
    const [summary, setSummary] = React.useState<string>('');

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) {
        setSummary('');
        return;
      }
      const names = Array.from(files).map((f) => f.name);
      setSummary(
        files.length === 1
          ? `Seleccionado: ${names[0]}`
          : `${files.length} archivos: ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''}`,
      );
      onFiles?.(files);
    };

    return (
      <label
        ref={ref}
        data-over={over || undefined}
        className={cn(
          'relative block cursor-pointer rounded-lg border-2 border-dashed bg-[var(--tei-bg-secondary)] p-6 text-center transition-colors',
          'hover:border-[var(--tei-accent)] hover:bg-[var(--tei-surface-raised)]',
          'data-[over]:border-[var(--tei-accent)] data-[over]:bg-[var(--tei-surface-raised)]',
          disabled && 'cursor-not-allowed opacity-50',
          invalid
            ? 'border-[var(--tei-danger)]'
            : 'border-[var(--tei-border)]',
          className,
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!e.dataTransfer.files?.length) return;
          if (inputRef.current) inputRef.current.files = e.dataTransfer.files;
          handleFiles(e.dataTransfer.files);
        }}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tei-surface)] text-[var(--tei-muted)]">
          <UploadCloud className="h-6 w-6" />
        </span>
        <p className="text-sm font-bold text-[var(--tei-text-strong)]">
          Arrastra y suelta o{' '}
          <span className="text-[var(--tei-accent)] underline">explora</span>
        </p>
        {hint && (
          <p className="mt-1 text-xs text-[var(--tei-muted)]">{hint}</p>
        )}
        {summary && (
          <p className="mt-2 text-xs font-semibold text-[var(--tei-accent)]">{summary}</p>
        )}
      </label>
    );
  },
);
FileDropzone.displayName = 'FileDropzone';
