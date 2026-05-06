# tei-design — instrucciones operativas para IA y desarrolladores

> Este archivo dicta cómo aplicar el design system **Dimension TEI** en un proyecto. Si lees esto como agente IA (Claude Code, Cursor, etc.), asume estas reglas como **autoridad** sobre cualquier criterio estético propio. Si entran en conflicto con instrucciones del usuario o de un `CLAUDE.md` existente, gana lo que diga el usuario.

## 1. ¿Qué es tei-ui?

Registry público shadcn-compatible: `https://github.com/DimensionTEI/tei-ui`. Sirve componentes React + tokens CSS para el sistema de diseño de Dimension TEI. Compatible con cualquier framework que use Tailwind v4 + React (Next, Vite, Astro con island, Remix, TanStack Start, etc.).

- **Catálogo:** 79 items = 68 primitivos UI (`registry:ui`) + 9 patrones de página (`registry:block`) + tokens + utils.
- **URL raw base:** `https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/<item>.json`.
- **Versión estable:** `v1.0.0` (tag) — para fijar usar `…/v1.0.0/r/<item>.json`.
- **Documentación de uso:** `USAGE.md` en el mismo repo.

## 2. Pre-requisitos del proyecto consumidor

Verificar antes de instalar nada. Si falta cualquiera, parar y resolver primero.

- **Tailwind v4** (no v3). Comprobar en `package.json` que `tailwindcss` empieza por `^4`. Si está en v3, **migrar primero** siguiendo la guía oficial — no intentar adaptar.
- **React ≥ 18** (mejor 19).
- **shadcn CLI 2.x o 3.x** disponible vía `npx`.
- **Path alias `@/*` → `src/*`** (o equivalente) en `tsconfig.json`.
- **Lucide para iconos** (`lucide-react`). Otros packs son aceptables pero los snippets del registry usan Lucide.

Si el proyecto **no tiene shadcn inicializado**, ejecutar:

```bash
npx shadcn@latest init
```

O crear `components.json` mínimo manualmente:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Adaptar `tailwind.css` y los aliases a la estructura real del proyecto (Vite suele usar `src/`, Astro usa `src/`, etc.).

## 3. Orden de instalación obligatorio

**Siempre primero:** tokens. Todos los componentes leen `var(--tei-*)`.

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json
```

Esto crea `src/styles/tokens.css` y `src/styles/fonts.css`. Importarlos al CSS global del proyecto **en este orden**:

```css
@import 'tailwindcss';
@import '../styles/fonts.css';
@import '../styles/tokens.css';
```

Después, instalar los componentes según necesidad:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/<componente>.json
```

`shadcn` resuelve dependencias internas: instalar `confirm-inline` también añade `button`, `utils`, etc.

## 4. Catálogo — qué usar para qué

### Primitivos esenciales (instala antes que custom)

| Necesidad | Componente | Notas |
|---|---|---|
| Botón | `button` | Variantes: default, secondary, ghost, outline, destructive, link |
| Input texto | `input` | |
| Input fecha/hora | `date-input` | type=date/time/datetime-local/month con icono |
| Input número | `number-input` | stepper +/− con sufijo |
| Textarea | `textarea` | |
| Select | `select` | Radix-based |
| Checkbox / Radio | `checkbox`, `radio-group` | |
| Switch | `switch` | |
| Slider | `slider` | |
| Subida archivos | `file-dropzone` | drag & drop con preview |
| Form | `form` | wrapper react-hook-form |

### Feedback y estado

| Necesidad | Componente |
|---|---|
| Aviso pequeño en línea | `alert` |
| Banner ancho con CTA | `banner` |
| Notificación toast | `sonner` |
| Modal de confirmación | `alert-dialog` |
| Confirmación in-situ sin overlay | `confirm-inline` |
| Empty state | `empty-state` |
| Loading | `spinner`, `skeleton` |
| Indicador estado | `status-dot` |
| Progreso | `progress` |

### Navegación y estructura

| Necesidad | Componente |
|---|---|
| Sidebar | `sidebar` |
| Tabs | `tabs` |
| Breadcrumb | `breadcrumb` |
| Pagination | `pagination` |
| Dropdown menu | `dropdown-menu` |
| Modal | `dialog` |
| Drawer lateral | `drawer`, `sheet` |
| Tooltip | `tooltip` |
| Hover card | `hover-card` |

### Datos

| Necesidad | Componente |
|---|---|
| Tabla simple | `table` |
| Tabla con sort/filtro/pagination | `data-table` |
| Lista clave/valor | `description-list` |
| KPI / métrica | `stat` |
| Multi-paso | `stepper` |
| Estrellas | `rating` |
| Badge fijo | `badge` |
| Tag dismissible (filtros) | `tag` |
| Avatar individual | `avatar` |
| Avatares apilados | `avatar-group` |
| Timeline actividad | `timeline` |
| Calendario | `calendar` |
| Code inline / bloque | `code` |
| Code multi-lenguaje con tabs | `code-tabs` |
| Notificaciones inbox | `notification-inbox` |

### Patrones (página completa)

Para arrancar pantallas enteras. Cada uno ya compone primitivos del registry.

| Pattern | Para |
|---|---|
| `pattern-login` | Login |
| `pattern-error` | 404 / 403 / 500 / mantenimiento |
| `pattern-empty-states` | Galería de empty states |
| `pattern-two-column` | Settings con sub-nav lateral |
| `pattern-master-detail` | Lista + detalle |
| `pattern-settings` | Preferencias con tabs + zona peligrosa |
| `pattern-dashboard` | Dashboard KPIs + filtros + tabla |
| `pattern-table` | Tabla densa con bulk actions |
| `pattern-long-form` | Formulario multi-paso |

### Tema claro/oscuro

| Componente | Para |
|---|---|
| `theme-provider` | Provider que aplica `data-theme` al `<html>` con persistencia + prefers-color-scheme |
| `theme-toggle` | Botón Sun/Moon |

## 5. Reglas de uso

### Importación

Siempre desde alias `@/components/ui/<nombre>` (o `@/components/blocks/<pattern>`):

```tsx
import { Button } from '@/components/ui/button';
import { Stat } from '@/components/ui/stat';
```

Nunca importar relativo (`../../components/...`). Nunca renombrar el alias.

### Tokens (color, espaciado, sombra)

Usar **siempre** los CSS vars TEI:

```tsx
<div className="bg-[var(--tei-surface)] text-[var(--tei-text)] border border-[var(--tei-border)]" />
```

**Vars disponibles** (ver `src/styles/tokens.css` tras instalar):

- Superficie: `--tei-bg`, `--tei-bg-secondary`, `--tei-surface`, `--tei-surface-raised`
- Borde: `--tei-border`, `--tei-border-strong`
- Texto: `--tei-text`, `--tei-text-strong`, `--tei-muted`
- Acento: `--tei-accent`, `--tei-accent-hover`, `--tei-accent-fg`
- Marca: `--tei-brand`, `--tei-brand-soft`
- Semánticos: `--tei-success`, `--tei-warning`, `--tei-danger`, `--tei-info`
- Foco: `--tei-focus-ring`
- Tipografía: `--tei-font-sans`, `--tei-font-display`, `--tei-font-mono`
- Overlay: `--tei-overlay`
- Radios: `--tei-radius-{sm,md,lg,xl}`
- Sombras: `--tei-shadow-{sm,md,lg}`

Modo oscuro: aplicar `data-theme="dark"` al `<html>` (lo hace `theme-provider`). Las mismas vars cambian de valor.

### Iconos

`lucide-react` por defecto. Tamaño base `h-4 w-4` dentro de botones, `h-5 w-5` en headers.

```tsx
import { Save } from 'lucide-react';
<Button><Save className="h-4 w-4" /> Guardar</Button>
```

### Tipografía

Las fuentes Nunito + JetBrains Mono se cargan vía `fonts.css`. No instalar Google Fonts ni `next/font` adicionales para estas dos. Si el proyecto necesita una distinta, sumar — no reemplazar.

## 6. Anti-patrones — qué NO hacer

- ❌ **No usar utilidades de color de Tailwind directas** (`bg-blue-500`, `text-gray-700`). Romper el theme. Usar siempre `var(--tei-*)`.
- ❌ **No mezclar otra librería de UI** (MUI, Mantine, Chakra, Ant) con tei-ui en la misma pantalla. Si el proyecto venía con otra lib, migrar pieza a pieza, no superponer.
- ❌ **No copiar el código de un primitivo a otro lugar** ("inline duplicate"). Si necesitas algo similar, instalar el primitivo y componer.
- ❌ **No editar `src/styles/tokens.css`** directamente para cambiar colores TEI. Si hace falta override, declarar en una capa propia con `:where(.proyecto-x)` para no romper otros consumidores.
- ❌ **No saltarse los pasos de instalación** (tokens primero, siempre).
- ❌ **No usar `style={{...}}` con valores hex/rgb literales** para colores que tienen var TEI equivalente.

## 7. Ejemplos de aplicación

### Reemplazar botón nativo

Antes:
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
```

Después:
```tsx
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

<Button><Save className="h-4 w-4" /> Guardar</Button>
```

### Reemplazar card propia

Antes:
```tsx
<div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">…</div>
```

Después:
```tsx
import { Card } from '@/components/ui/card';
<Card className="p-4">…</Card>
```

### Aviso de error → Banner / Alert

Antes (alerta toda la página):
```tsx
<div className="bg-red-50 border-l-4 border-red-500 p-4">…</div>
```

Después:
```tsx
import { Banner } from '@/components/ui/banner';
<Banner variant="danger" closable>El backup nocturno ha fallado.</Banner>
```

## 8. Cuando decidas no usar un primitivo

Justifícalo. Casos válidos:

- El primitivo no cubre el caso (entonces compón con primitivos más bajos: Card + Button, no inventes uno nuevo).
- Hay constraint de bundle size que no permite añadir Radix subpaquetes (raro).
- Estás en un Server Component y el primitivo lleva `'use client'` — entonces aísla la parte interactiva en un Client Component hijo, **no clones** el primitivo.

Si ninguna aplica, usa el primitivo.

## 9. Para agentes IA — protocolo de trabajo

Cuando recibas una tarea visual en un proyecto que sigue tei-design:

1. **Auditar primero.** Listar `src/components/ui/` para ver qué primitivos ya están instalados.
2. **Identificar qué falta.** Comparar con la necesidad de la tarea.
3. **Instalar antes de codear.** `npx shadcn add <url>` para los que falten. NO copiar el .tsx desde el repo manualmente — usar el CLI.
4. **Importar y componer.** Siempre desde `@/components/ui/...`.
5. **Validar.** Correr `tsc --noEmit` y el build del framework. Si hay errores de tipos en componentes recién instalados, no editar los componentes — reportar y consultar.
6. **No tocar tokens.** Si la tarea pide cambiar la paleta, parar y consultar — los tokens son SemVer MAJOR.

## 10. Recursos

- Catálogo completo: [`r/registry.json`](./r/registry.json)
- Snippets de uso: [`USAGE.md`](./USAGE.md)
- Showcase de los 14 primitivos clave: [`example/page.tsx`](./example/page.tsx)
- Playbook de migración para proyectos existentes: [`migration.md`](./migration.md)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)
