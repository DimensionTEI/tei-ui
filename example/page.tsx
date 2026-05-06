'use client';

/**
 * Página de showcase de los 14 primitivos nuevos del registry tei-ui v1.0.0.
 * Pensada como referencia visual y plantilla de copy/paste — NO se publica
 * vía registry, vive aquí como ejemplo en el repo.
 *
 * Para verla en local:
 *   1. Genera un proyecto Next: npx create-next-app@latest tei-ui-demo --ts --tailwind --app --src-dir --import-alias "@/*"
 *   2. Instala tokens y todos los componentes:
 *        npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json
 *        npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/avatar-group.json ...
 *      (o usa el comando completo en USAGE.md)
 *   3. Copia este archivo a src/app/page.tsx
 *   4. Importa los CSS en src/app/globals.css:
 *        @import 'tailwindcss';
 *        @import '../styles/fonts.css';
 *        @import '../styles/tokens.css';
 *   5. npm run dev
 */
import * as React from 'react';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';

import { AvatarGroup } from '@/components/ui/avatar-group';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { CodeTabs } from '@/components/ui/code-tabs';
import { ConfirmInline } from '@/components/ui/confirm-inline';
import { DateInput } from '@/components/ui/date-input';
import { DescriptionList } from '@/components/ui/description-list';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { NotificationInbox } from '@/components/ui/notification-inbox';
import { NumberInput } from '@/components/ui/number-input';
import { Rating } from '@/components/ui/rating';
import { Stat } from '@/components/ui/stat';
import { Stepper } from '@/components/ui/stepper';
import { Tag } from '@/components/ui/tag';
import { Timeline } from '@/components/ui/timeline';

const team = [
  { name: 'Adrián Ramos' },
  { name: 'Marta López' },
  { name: 'Carmelo Valido' },
  { name: 'Jonathan Luján' },
  { name: 'Ricardo Cabrera' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--tei-border)] bg-[var(--tei-surface)] p-6">
      <h2 className="mb-4 text-base font-bold text-[var(--tei-text-strong)]">{title}</h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

export default function ShowcasePage() {
  const [rating, setRating] = React.useState(3);
  const [step, setStep] = React.useState('revisar');
  const [filters, setFilters] = React.useState(['rgpd', 'web', 'cliente-publico']);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--tei-text-strong)]">tei-ui · showcase v1.0.0</h1>
          <p className="text-sm text-[var(--tei-muted)]">14 primitivos nuevos en composición conjunta.</p>
        </div>
        <NotificationInbox
          items={[
            { id: '1', title: 'Nueva incidencia asignada', body: 'TEI-1247 · Migración SonicWall', at: 'hace 2 min', unread: true },
            { id: '2', title: 'PR aprobado', at: 'hace 1 h', href: '#' },
            { id: '3', title: 'Backup nocturno OK', at: 'hace 3 h' },
          ]}
        />
      </header>

      <Banner variant="info" closable action={<a href="#">Ver cambios →</a>}>
        Nueva versión del SDK disponible (v1.0.0).
      </Banner>

      <Section title="Stat (KPI cards)">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Tickets abiertos" value="42" hint="vs 37 ayer" delta="+5" deltaTone="success" accent="brand" />
          <Stat label="Backups OK" value="100%" delta="0" deltaTone="neutral" accent="success" />
          <Stat label="Errores 5xx" value="3" delta="-12" deltaTone="success" accent="warning" />
          <Stat label="Tiempo medio" value="1.2s" delta="+0.1s" deltaTone="danger" accent="info" />
        </div>
      </Section>

      <Section title="AvatarGroup">
        <AvatarGroup people={team} max={3} size="md" />
        <AvatarGroup people={team} max={4} size="lg" />
      </Section>

      <Section title="Tags (filtros activos)">
        {filters.map((f) => (
          <Tag key={f} tone="brand" dismissible value={f} onDismiss={(v) => setFilters((xs) => xs.filter((x) => x !== v))}>
            {f}
          </Tag>
        ))}
        {filters.length === 0 && <span className="text-sm text-[var(--tei-muted)]">Sin filtros activos.</span>}
      </Section>

      <Section title="Stepper (multi-paso)">
        <div className="w-full">
          <Stepper
            current={step}
            steps={[
              { id: 'datos', label: 'Datos básicos', description: 'Cliente y proyecto' },
              { id: 'revisar', label: 'Revisar', description: 'Confirmar alcance' },
              { id: 'enviar', label: 'Enviar', description: 'Notificar al cliente' },
            ]}
          />
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setStep('datos')}>1</Button>
            <Button size="sm" variant="secondary" onClick={() => setStep('revisar')}>2</Button>
            <Button size="sm" variant="secondary" onClick={() => setStep('enviar')}>3</Button>
          </div>
        </div>
      </Section>

      <Section title="Inputs (date, number, file)">
        <DateInput name="entrega" defaultValue="2026-06-01" />
        <NumberInput name="qty" defaultValue={1} min={1} max={99} suffix="ud" />
        <div className="w-full"><FileDropzone hint="PNG, JPG o PDF · máx 10 MB" /></div>
      </Section>

      <Section title="Rating + ConfirmInline">
        <Rating value={rating} interactive onChange={setRating} />
        <ConfirmInline prompt="¿Eliminar fila?" confirmLabel="Sí, eliminar" onConfirm={() => alert('Eliminado')}>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        </ConfirmInline>
      </Section>

      <Section title="DescriptionList (ficha)">
        <DescriptionList
          orientation="horizontal"
          items={[
            { term: 'Cliente', description: 'Cabildo de Tenerife' },
            { term: 'Owner', description: 'Adrián Ramos' },
            { term: 'Estado', description: 'En curso' },
            { term: 'Fecha límite', description: '2026-06-30' },
          ]}
        />
      </Section>

      <Section title="Timeline (actividad)">
        <Timeline
          items={[
            { id: '1', actor: 'Adrián Ramos', action: 'creó el proyecto', at: 'hace 2 h', icon: <Plus />, accent: 'brand' },
            { id: '2', actor: 'Ricardo Cabrera', action: 'comentó', at: 'hace 1 h', icon: <MessageCircle />, body: 'Falta confirmar el alcance del SLA con el cliente.' },
            { id: '3', actor: 'Marta López', action: 'cerró el ticket TEI-1247', at: 'hace 30 min', icon: <Plus />, accent: 'success' },
          ]}
        />
      </Section>

      <Section title="CodeTabs (multi-lenguaje)">
        <div className="w-full">
          <CodeTabs
            codes={{
              react: `<Button onClick={() => setOpen(true)}>\n  Abrir modal\n</Button>`,
              html: `<button class="btn-primary">\n  Abrir modal\n</button>`,
              astro: `<Button onClick="open()">\n  Abrir modal\n</Button>`,
            }}
          />
        </div>
      </Section>
    </main>
  );
}
