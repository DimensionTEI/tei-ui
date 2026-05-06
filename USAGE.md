# Uso por componente

Snippets mínimos para arrancar con cada primitivo. Asume `tokens` instalados y `cn`/`utils` disponibles. Para la lista completa con dependencias npm, ver [`r/registry.json`](./r/registry.json).

## Convenciones generales

- Todos los componentes leen los CSS vars `--tei-*`. Instala `tokens` antes de cualquier otro item.
- Los componentes con estado o eventos llevan `'use client'` y necesitan ejecutarse en un Client Component (Next.js App Router).
- Las APIs son TypeScript-first; no hay PropTypes. Importa los tipos desde el propio módulo si los necesitas.

## Primitivos nuevos (v1.0.0)

### `avatar-group`

```tsx
import { AvatarGroup } from '@/components/ui/avatar-group';

<AvatarGroup
  size="md"
  max={3}
  people={[
    { name: 'Adrián Ramos', src: '/avatars/adrian.jpg' },
    { name: 'Marta López' },
    { name: 'Carmelo Valido' },
    { name: 'Jonathan Luján' },
    { name: 'Ricardo Cabrera' },
  ]}
/>
```

### `banner`

```tsx
import { Banner } from '@/components/ui/banner';

<Banner variant="info" closable action={<a href="#">Ver cambios →</a>}>
  Nueva versión disponible.
</Banner>
```

### `code-tabs`

```tsx
import { CodeTabs } from '@/components/ui/code-tabs';

<CodeTabs
  codes={{
    react: `<Button>Hola</Button>`,
    html:  `<button class="btn">Hola</button>`,
  }}
/>
```

### `confirm-inline`

```tsx
import { ConfirmInline } from '@/components/ui/confirm-inline';
import { Button } from '@/components/ui/button';

<ConfirmInline
  prompt="¿Eliminar fila?"
  confirmLabel="Sí, eliminar"
  variant="destructive"
  onConfirm={() => deleteRow(id)}
>
  <Button variant="destructive" size="sm">Eliminar</Button>
</ConfirmInline>
```

### `date-input`

```tsx
import { DateInput } from '@/components/ui/date-input';

<DateInput name="entrega" min="2026-01-01" />
<DateInput name="hora" type="time" />
```

### `description-list`

```tsx
import { DescriptionList } from '@/components/ui/description-list';

<DescriptionList
  orientation="horizontal"
  items={[
    { term: 'Cliente', description: 'Cabildo de Tenerife' },
    { term: 'Owner',   description: 'Adrián Ramos' },
    { term: 'Estado',  description: 'En curso' },
  ]}
/>
```

### `file-dropzone`

```tsx
import { FileDropzone } from '@/components/ui/file-dropzone';

<FileDropzone
  name="archivo"
  accept="image/*,application/pdf"
  multiple
  hint="PNG, JPG o PDF · máx 10 MB"
  onFiles={(files) => uploadAll(files)}
/>
```

### `notification-inbox`

```tsx
import { NotificationInbox } from '@/components/ui/notification-inbox';

<NotificationInbox
  side="right"
  items={[
    { id: '1', title: 'Nueva incidencia asignada', at: 'hace 2 min', unread: true },
    { id: '2', title: 'PR aprobado', at: 'hace 1 h', href: '/pr/42' },
  ]}
  onMarkAllRead={() => markAll()}
/>
```

### `number-input`

```tsx
import { NumberInput } from '@/components/ui/number-input';

<NumberInput
  name="qty"
  defaultValue={1}
  min={1}
  max={99}
  suffix="ud"
  onValueChange={(v) => setQty(v)}
/>
```

### `rating`

```tsx
import { Rating } from '@/components/ui/rating';

<Rating value={4} />                                {/* solo display */}
<Rating value={value} onChange={setValue} interactive />
```

### `stat`

```tsx
import { Stat } from '@/components/ui/stat';

<Stat
  label="Usuarios activos"
  value="1.247"
  hint="vs. ayer"
  delta="+12%"
  deltaTone="success"
  accent="brand"
/>
```

### `stepper`

```tsx
import { Stepper } from '@/components/ui/stepper';

<Stepper
  current="revisar"
  orientation="horizontal"
  steps={[
    { id: 'datos',    label: 'Datos' },
    { id: 'revisar',  label: 'Revisar' },
    { id: 'enviar',   label: 'Enviar' },
  ]}
/>
```

### `tag`

```tsx
import { Tag } from '@/components/ui/tag';

<Tag tone="brand" dismissible value="rgpd" onDismiss={(v) => removeFilter(v)}>
  RGPD
</Tag>
```

### `timeline`

```tsx
import { Timeline } from '@/components/ui/timeline';
import { Plus, MessageCircle } from 'lucide-react';

<Timeline
  items={[
    { id: '1', actor: 'Adrián Ramos', action: 'creó el proyecto', at: 'hace 2 h', icon: <Plus />, accent: 'brand' },
    { id: '2', actor: 'Ricardo Cabrera', action: 'comentó', at: 'hace 1 h', icon: <MessageCircle />, body: 'Falta confirmar el alcance.' },
  ]}
/>
```

## Patrones (registry:block)

Cada `pattern-*` es una página completa — instálala y edita los textos / handlers. Los detalles de API están en el JSDoc inicial de cada `.tsx`.

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/pattern-dashboard.json
```

Patrones disponibles: `pattern-login`, `pattern-error`, `pattern-empty-states`, `pattern-two-column`, `pattern-master-detail`, `pattern-settings`, `pattern-dashboard`, `pattern-table`, `pattern-long-form`.

## Componentes base

Para los primitivos shadcn estándar (`button`, `card`, `dialog`, `select`, `tabs`, `data-table`, etc.), la API es la oficial de shadcn/ui — consulta [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) y reemplaza el import por `@/components/ui/<nombre>`.
