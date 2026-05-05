'use client';
import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

// Paleta para series. Cada una se expone como CSS var --chart-N para
// que las shapes de recharts puedan usarla via stroke="var(--chart-1)".
// Los colores cambian con el tema oscuro a través de tokens.css.
const CHART_THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof CHART_THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error('useChart debe usarse dentro de <ChartContainer>');
  return ctx;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-[var(--tei-muted)] [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-[var(--tei-border)] [&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--tei-border)] [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-[var(--tei-border)] [&_.recharts-radial-bar-background-sector]:fill-[var(--tei-bg-secondary)] [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--tei-bg-secondary)] [&_.recharts-reference-line_[stroke='#ccc']]:stroke-[var(--tei-border)] [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, v]) => v.theme || v.color);
  if (!colorConfig.length) return null;
  return (
    <style
      // CSS dinámico con vars por tema y por serie. recharts las consume
      // via stroke="var(--color-<key>)".
      dangerouslySetInnerHTML={{
        __html: Object.entries(CHART_THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      'theme' in item && item.theme
        ? item.theme[theme as keyof typeof CHART_THEMES]
        : 'color' in item
          ? item.color
          : undefined;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color?: string; dataKey?: string }>;
    label?: React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    formatter?: (
      value: number,
      name: string,
      item: { dataKey?: string },
      index: number,
      payload: unknown,
    ) => React.ReactNode;
    labelFormatter?: (value: React.ReactNode) => React.ReactNode;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      formatter,
    },
    ref,
  ) => {
    const { config } = useChart();
    if (!active || !payload?.length) return null;
    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-md border border-[var(--tei-border)] bg-[var(--tei-surface)] px-2.5 py-1.5 text-xs shadow-[var(--tei-shadow-md)]',
          className,
        )}
      >
        {!hideLabel && (
          <div className="font-medium text-[var(--tei-text-strong)]">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, idx) => {
            const key = item.name ?? item.dataKey ?? 'value';
            const itemCfg = config[key];
            const color = item.color ?? `var(--color-${key})`;
            return (
              <div key={`${key}-${idx}`} className="flex w-full items-center gap-2">
                {!hideIndicator && (
                  <span
                    className={cn(
                      'shrink-0 rounded',
                      indicator === 'dot' && 'h-2.5 w-2.5',
                      indicator === 'line' && 'h-1 w-3',
                      indicator === 'dashed' && 'h-0 w-3 border-t-2 border-dashed',
                    )}
                    style={
                      indicator === 'dashed' ? { borderColor: color } : { backgroundColor: color }
                    }
                  />
                )}
                <div className="flex flex-1 justify-between gap-2">
                  <span className="text-[var(--tei-muted)]">{itemCfg?.label ?? key}</span>
                  <span className="font-mono font-medium text-[var(--tei-text-strong)]">
                    {formatter ? formatter(item.value, key, item, idx, payload) : item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    payload?: Array<{ value: string; color?: string; dataKey?: string }>;
    verticalAlign?: 'top' | 'bottom' | 'middle';
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom' }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload.map((item) => {
        const key = item.dataKey ?? item.value;
        const itemCfg = config[key];
        return (
          <div
            key={item.value}
            className="flex items-center gap-1.5 text-[var(--tei-muted)]"
          >
            {!hideIcon && (
              <span
                className="h-2 w-2 shrink-0 rounded"
                style={{ backgroundColor: item.color ?? `var(--color-${key})` }}
              />
            )}
            {itemCfg?.label ?? item.value}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';
