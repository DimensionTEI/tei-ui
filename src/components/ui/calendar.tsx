'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',
        head_cell: 'text-[var(--tei-muted)] rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[var(--tei-bg-secondary)] [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[var(--tei-bg-secondary)]/50 [&:has([aria-selected])]:rounded-md',
        day: cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 font-normal aria-selected:opacity-100'),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-[var(--tei-accent)] text-[var(--tei-accent-fg)] hover:bg-[var(--tei-accent)] hover:text-[var(--tei-accent-fg)] focus:bg-[var(--tei-accent)] focus:text-[var(--tei-accent-fg)]',
        day_today: 'bg-[var(--tei-bg-secondary)] text-[var(--tei-text-strong)]',
        day_outside:
          'day-outside text-[var(--tei-muted)] aria-selected:bg-[var(--tei-bg-secondary)]/50 aria-selected:text-[var(--tei-muted)]',
        day_disabled: 'text-[var(--tei-muted)] opacity-50',
        day_range_middle: 'aria-selected:bg-[var(--tei-bg-secondary)] aria-selected:text-[var(--tei-text)]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className: cls, ...iconProps }) => (
          <ChevronLeft className={cn('size-4', cls)} {...iconProps} />
        ),
        IconRight: ({ className: cls, ...iconProps }) => (
          <ChevronRight className={cn('size-4', cls)} {...iconProps} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
