'use client';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'tei-code-tab';

export type CodeLang = 'astro' | 'html' | 'react' | 'vue' | 'blade';

export interface CodeTabsProps {
  /** Mapa lenguaje → código fuente. Solo se renderiza pestaña para los presentes. */
  codes: Partial<Record<CodeLang, string>>;
  /** Lenguaje por defecto si no hay preferencia guardada. */
  defaultLang?: CodeLang;
  /** Persistir la elección entre páginas. Por defecto true. */
  persist?: boolean;
  className?: string;
}

const LABELS: Record<CodeLang, string> = {
  astro: 'Astro',
  html: 'HTML',
  react: 'React/Next',
  vue: 'Vue',
  blade: 'Blade',
};

const ORDER: CodeLang[] = ['astro', 'html', 'react', 'vue', 'blade'];

export function CodeTabs({ codes, defaultLang, persist = true, className }: CodeTabsProps) {
  const available = React.useMemo(
    () =>
      ORDER.filter((k) => {
        const c = codes[k];
        return typeof c === 'string' && c.trim().length > 0;
      }),
    [codes],
  );

  const fallback = defaultLang && available.includes(defaultLang) ? defaultLang : available[0];
  const [active, setActive] = React.useState<CodeLang | undefined>(fallback);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!persist || typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as CodeLang | null;
    if (stored && available.includes(stored)) setActive(stored);
  }, [available, persist]);

  const onChange = (v: string) => {
    const lang = v as CodeLang;
    setActive(lang);
    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const onCopy = async () => {
    if (!active) return;
    const raw = codes[active]?.trim() ?? '';
    try {
      await navigator.clipboard?.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };

  if (!active) return null;

  return (
    <Tabs
      value={active}
      onValueChange={onChange}
      className={cn(
        'overflow-hidden rounded-md border border-[var(--tei-border)] bg-[var(--tei-surface-raised)]',
        className,
      )}
    >
      <div className="flex items-center border-b border-[var(--tei-border)] bg-[var(--tei-bg-secondary)]">
        <TabsList className="h-auto flex-1 justify-start rounded-none bg-transparent p-0">
          {available.map((k) => (
            <TabsTrigger
              key={k}
              value={k}
              className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold data-[state=active]:border-[var(--tei-accent)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {LABELS[k]}
            </TabsTrigger>
          ))}
        </TabsList>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 border-l border-[var(--tei-border)] px-3 py-2 text-xs font-medium text-[var(--tei-muted)] transition-colors hover:text-[var(--tei-text-strong)]"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      {available.map((k) => (
        <TabsContent key={k} value={k} className="mt-0">
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[var(--tei-text)]">
            <code>{codes[k]?.trim()}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  );
}
