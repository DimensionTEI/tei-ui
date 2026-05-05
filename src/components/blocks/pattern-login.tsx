'use client';
import * as React from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Patrón Login — tarjeta centrada sobre fondo de grid sutil.
 *
 * Decisiones:
 * - Una sola acción primaria (Entrar) full-width con flecha.
 * - Iconos leading en cada campo para identificar tipo de un vistazo.
 * - Toggle de visibilidad de contraseña.
 * - "Recuérdeme" decorativo si la cookie ya persiste por defecto.
 *
 * El consumidor sustituye `onSubmit` por su flujo real de auth.
 */
export function PatternLogin({
  onSubmit,
  brand,
  title = 'Acceda con sus credenciales corporativas',
  subtitle,
}: {
  onSubmit?: (data: { user: string; password: string; remember: boolean }) => void;
  brand?: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
}) {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [showPwd, setShowPwd] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ user, password, remember });
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--tei-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--tei-border)_1px,transparent_1px)] [background-size:48px_48px] opacity-40"
      />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 px-4">
        {brand && <div className="mb-2 flex items-center justify-center">{brand}</div>}
        <div className="w-full rounded-2xl border border-[var(--tei-border)] bg-[var(--tei-surface)] p-6 shadow-[var(--tei-shadow-lg)] sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-[var(--tei-font-display)] text-2xl font-semibold tracking-tight text-[var(--tei-text-strong)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--tei-muted)]">{subtitle}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-user">Usuario</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tei-muted)]" />
                <Input
                  id="login-user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="adrian"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-pwd">Contraseña</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tei-muted)]" />
                <Input
                  id="login-pwd"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tei-muted)] hover:text-[var(--tei-text)]"
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--tei-text)]">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
                aria-label="Recuérdeme en este equipo"
              />
              Recuérdeme en este equipo
            </label>
            <Button type="submit" className="w-full">
              Entrar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
