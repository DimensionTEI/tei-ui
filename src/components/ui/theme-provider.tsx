'use client';
import * as React from 'react';

/**
 * Provider de tema claro/oscuro/sistema con persistencia en localStorage.
 * Sin dependencia de next-themes. SSR-safe.
 *
 * Aplica `data-theme="light|dark"` al <html>; los tokens TEI ya están
 * definidos en :root y :root[data-theme='dark'] (ver tokens.css).
 */
export type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'tei-theme';

type Ctx = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
};

const ThemeContext = React.createContext<Ctx | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolved] = React.useState<'light' | 'dark'>('light');

  // Lee la preferencia guardada al montar.
  React.useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? defaultTheme;
    setThemeState(stored);
  }, [defaultTheme]);

  // Resuelve el tema efectivo y aplica al DOM. Si está en 'system',
  // suscribe al cambio de prefers-color-scheme.
  React.useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolved(resolved);
    applyTheme(resolved);
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r = mq.matches ? 'dark' : 'light';
      setResolved(r);
      applyTheme(r);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
