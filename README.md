# tei-ui

Registry shadcn-compatible con los componentes y tokens del sistema de diseño **Dimension TEI**. 79 items: 68 primitivos React + 9 patrones de página + tokens + utils. Funciona con cualquier framework que use **Tailwind v4** + **React** (Next, Vite, Astro, Remix, TanStack Start, etc.).

- **URL pública:** `https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/<item>.json`
- **Versión estable:** `v1.0.0` (tag) — fijar con `…/v1.0.0/r/<item>.json`
- **Demo:** [`example/page.tsx`](./example/page.tsx) — composición de los 14 primitivos clave

---

## Cómo empezar — elige tu camino

| Tu situación | Camino |
|---|---|
| Empiezo un proyecto desde cero | [→ A. Proyecto nuevo](#a-proyecto-nuevo) |
| Tengo proyecto avanzado, lo migraré yo | [→ B. Migración manual](#b-migración-manual-proyecto-existente) |
| Tengo proyecto avanzado, trabajaré con IA (Claude Code, Cursor, …) | [→ C. Migración asistida por IA](#c-migración-asistida-por-ia) |
| Solo quiero curiosear o ver el catálogo | [→ D. Curiosear sin instalar](#d-curiosear-sin-instalar) |

---

### A. Proyecto nuevo

Para arrancar un proyecto desde cero con tei-ui ya integrado.

**1. Crea el proyecto** con cualquier framework que tenga Tailwind v4 + React. Ejemplo Next.js:

```bash
npx create-next-app@latest mi-proyecto --ts --tailwind --app --src-dir --import-alias "@/*"
cd mi-proyecto
```

Vite, Astro, Remix, TanStack Start: ver [§ Notas por framework](#notas-por-framework).

**2. Inicializa shadcn** (si tu scaffold no lo hizo):

```bash
npx shadcn@latest init
```

Si te pregunta interactivamente, pulsa Enter en defaults. Si quieres saltarte el prompt, copia el [`components.json` mínimo](#componentsjson-mínimo).

**3. Instala los tokens** (siempre primero):

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json
```

Esto crea `src/styles/tokens.css` y `src/styles/fonts.css`.

**4. Importa los CSS** en tu fichero global (orden importa). Ejemplo `src/app/globals.css` para Next:

```css
@import 'tailwindcss';
@import '../styles/fonts.css';
@import '../styles/tokens.css';
```

**5. Descarga las fuentes WOFF2** a `public/fonts/`:

```bash
curl -o tmp-fonts.ts https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/scripts/download-fonts.ts
npx tsx tmp-fonts.ts && rm tmp-fonts.ts
```

(Sin esto las fuentes Nunito + JetBrains Mono no cargarán — el sistema usará el fallback Segoe UI / monospace.)

**6. Añade los componentes que necesites:**

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/button.json
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/dialog.json
# … o varios de una vez:
npx shadcn@latest add \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/card.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/input.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sonner.json
```

`shadcn` resuelve dependencias internas: instalar `confirm-inline` también añade `button` y `utils` si faltan.

**7. Empieza a usarlos:**

```tsx
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

<Button><Save className="h-4 w-4" /> Guardar</Button>
```

Snippets por componente en [`USAGE.md`](./USAGE.md). Showcase visual en [`example/`](./example).

---

### B. Migración manual (proyecto existente)

Para integrar tei-ui en un proyecto avanzado sin agente IA.

**Pre-requisitos** (verificar antes):

- Tailwind **v4** (no v3). Si tienes v3, migra Tailwind primero — esta guía no cubre la migración v3→v4.
- React ≥ 18.
- Path alias `@/*` configurado en `tsconfig.json`.
- Si ya tienes shadcn, anota tu `components.json` actual — puede tener `baseColor` o `style` distinto. Coexistirá sin problemas con tei-ui.

**Pasos:** los mismos que el [Camino A](#a-proyecto-nuevo) desde el paso 2, **pero**:

- En el **paso 4** integra los `@import` en tu CSS global existente, **antes** de tus reglas custom y **después** de `@import 'tailwindcss'`.
- En el **paso 6** instala progresivamente, no todo de golpe. Empieza por la base atómica (`button`, `input`, `card`, `dialog`) y avanza por features.
- Reemplaza tus componentes legacy uno a uno. Conservar coexistencia temporal es OK — un PR migra una pantalla, no medio botón.

**Para una migración estructurada** (auditoría → fases → cierre) lee [`migration.md`](./migration.md). Está pensado tanto para humanos como para IA.

---

### C. Migración asistida por IA

Para proyectos donde quieres que un agente (Claude Code, Cursor, Aider, etc.) haga el trabajo pesado.

**1. Descarga las dos guías a la raíz de tu proyecto:**

```bash
curl -O https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/tei-design.md
curl -O https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/migration.md
```

- [`tei-design.md`](./tei-design.md) — reglas operativas (qué primitivo usar, tokens permitidos, anti-patrones).
- [`migration.md`](./migration.md) — playbook fase-a-fase para migrar.

**No necesitas tocar tu `CLAUDE.md` ni `.cursorrules`.** Los archivos son self-contained.

**2. Abre tu proyecto en la IA y dile:**

> *"lee `tei-design.md` y `migration.md`. Empieza por la Fase 0: audita el proyecto e identifica el stack actual (Tailwind v3 o v4, shadcn ya instalado, librería UI legacy si la hay, sistema de color). Devuélveme el inventario y el alcance recomendado antes de tocar código."*

**3. Aprueba el alcance que te proponga** y avanza fase a fase:

> *"ejecuta Fase 1"* → instala tokens y verifica build.
> *"ejecuta Fase 2"* → ThemeProvider y dark mode.
> *"ejecuta Fase 3"* → migra Button, Input, Card, Dialog, Toast.
> … y así hasta Fase 6 (cierre).

Cada fase es atómica — un PR por fase. Si algo se rompe, paras y haces rollback de esa fase.

**4. Si quieres que la IA aplique las reglas siempre** (no solo cuando lo pides), añade UNA línea a tu `CLAUDE.md` / `.cursorrules` / `AGENTS.md` existente:

```md
> Para trabajo visual / UI seguir las reglas de `tei-design.md` y los pasos de `migration.md` en este repo.
```

---

### D. Curiosear sin instalar

- **Catálogo completo** con dependencias npm: [`r/registry.json`](./r/registry.json).
- **Snippets de uso** por primitivo: [`USAGE.md`](./USAGE.md).
- **Showcase de los 14 primitivos clave** en composición real: [`example/page.tsx`](./example/page.tsx).
- **Historial de versiones:** [`CHANGELOG.md`](./CHANGELOG.md).

Para verlos en vivo, sigue las instrucciones de [`example/README.md`](./example/README.md) — son ~5 minutos.

---

## Catálogo

**Base** (instala primero, son dependencia de todo lo demás):

| Item | Tipo | Descripción |
|---|---|---|
| `tokens` | style | CSS vars TEI (paleta clara/oscura) + fuentes Nunito + JetBrains Mono. |
| `utils` | lib | Helper `cn()` (clsx + tailwind-merge). |

**Primitivos (68):**

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `avatar-group` · `badge` · `banner` · `breadcrumb` · `button` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `code` · `code-tabs` · `collapsible` · `command` · `confirm-inline` · `context-menu` · `data-table` · `date-input` · `description-list` · `dialog` · `drawer` · `dropdown-menu` · `empty-state` · `file-dropzone` · `form` · `hover-card` · `input` · `input-otp` · `kbd` · `label` · `menubar` · `navigation-menu` · `notification-inbox` · `number-input` · `pagination` · `popover` · `progress` · `radio-group` · `rating` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `stat` · `status-dot` · `stepper` · `switch` · `table` · `tabs` · `tag` · `textarea` · `theme-provider` · `theme-toggle` · `timeline` · `toggle` · `toggle-group` · `tooltip` · `typography`

**Patrones / bloques (9):** plantillas compuestas de página completa, listas para empezar a editar.

| Item | Para qué |
|---|---|
| `pattern-login` | Login centrado con logo, iconos leading, toggle de contraseña |
| `pattern-error` | Páginas 404 / 403 / 500 / mantenimiento |
| `pattern-empty-states` | Galería de estados vacíos (lista, búsqueda, carpeta, offline, error) |
| `pattern-two-column` | Layout settings con sub-nav lateral |
| `pattern-master-detail` | Lista + detalle (bandeja, tickets, conversaciones) |
| `pattern-settings` | Página de preferencias con tabs + secciones + zona peligrosa |
| `pattern-dashboard` | Dashboard con KPIs (`StatCard`) + filtros + tabla + footer |
| `pattern-table` | Tabla densa con sort, filtros, selección múltiple, bulk actions y paginación |
| `pattern-long-form` | Formulario multi-paso con stepper y autoguardado |

Saber qué primitivo usar para qué necesidad: [`tei-design.md` § Catálogo](./tei-design.md#4-catálogo--qué-usar-para-qué).

---

## Notas por framework

Las diferencias suelen estar en **dónde va el CSS global** y **dónde se monta el `ThemeProvider`**.

### Next.js (App Router) — recomendado

- CSS global: `src/app/globals.css`.
- Provider: en `src/app/layout.tsx`, envolviendo `<body>`.
- `'use client'`: los componentes interactivos (Modal, Drawer, etc.) ya lo declaran. Si los importas en un Server Component, Next aísla automáticamente.

### Vite + React

- CSS global: `src/index.css` o `src/main.css`. Importarlo en `src/main.tsx`.
- Provider: en `src/main.tsx` envolviendo `<App />`.
- Asegúrate de tener `@vitejs/plugin-react` y `@tailwindcss/vite`.

### Astro

- CSS global: `src/styles/global.css`. Importarlo desde el layout principal.
- Los componentes React del registry son **islands** — usar con `client:load` o `client:visible`. La parte estática (Card, Stat, DescriptionList…) puede ir SSR sin client.
- Si usas formularios complejos, ten en cuenta que algunos primitivos (`form`) dependen de react-hook-form y necesitan `client:load`.

### Remix / React Router 7

- CSS global: `app/styles/globals.css`, exportado como `links()` en `app/root.tsx`.
- Provider: en `app/root.tsx` envolviendo el `<Outlet />`.
- Sin cambios respecto a Next en cuanto a primitivos.

### TanStack Start

- CSS global: `app/styles/app.css`, importado en `app/router.tsx`.
- Provider: en el root layout.

### Otros frameworks (SolidStart, Qwik, Svelte…)

Los componentes son React puro. Para usarlos en frameworks no-React necesitas un wrapper o un micro-frontend. **No es el caso de uso target.** Recomendación: si tu proyecto no es React, no merece la pena adaptar tei-ui — usa los tokens (`tokens.json`) sueltos para coherencia visual y construye tus primitivos nativos.

---

## `components.json` mínimo

Si `npx shadcn@latest init` falla o quieres saltarte el prompt interactivo, crea este fichero en la raíz:

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

Ajusta `tailwind.css` si tu fichero global está en otra ruta (Vite suele usar `src/index.css`, Astro `src/styles/global.css`, etc.).

---

## Hosting del registry

Los JSON en `r/` son ficheros estáticos. Si quieres servir tu propio mirror (privado o público):

| Opción | Cero infra | Coste | URL final |
|---|---|---|---|
| GitHub raw | ✅ | 0 | `https://raw.githubusercontent.com/<org>/<repo>/main/r/<item>.json` |
| GitHub Pages | ✅ | 0 | `https://<org>.github.io/<repo>/<item>.json` |
| Vercel / Netlify | ⚠️ build | 0 | `https://<proyecto>.vercel.app/r/<item>.json` |

Si lo migras a otro hosting, sustituye `https://raw.githubusercontent.com/DimensionTEI/tei-ui/main` en este README + `tei-design.md` + `migration.md` + `USAGE.md`.

---

## Mantener el registry (solo para mantenedores)

```bash
# tras editar src/components/ui/*.tsx, src/styles/*.css o src/lib/utils.ts
pnpm build
```

Regenera `r/*.json` y `r/registry.json`. Commit + push al monorepo. Luego publica al mirror público:

```bash
git subtree push --prefix=tei-ui-registry tei-ui main
```

Para tag de release nueva: ver [`CHANGELOG.md`](./CHANGELOG.md) y `git tag`.

---

## Estructura del repo

```
tei-ui-registry/
├── r/                                # JSON consumidos por shadcn add
├── src/
│   ├── components/ui/*.tsx           # 68 primitivos
│   ├── components/blocks/pattern-*.tsx  # 9 patrones de página
│   ├── lib/utils.ts                  # cn()
│   └── styles/{tokens,fonts}.css     # CSS vars + @font-face
├── public/fonts/*.woff2              # Nunito + JetBrains Mono (latin + latin-ext)
├── scripts/
│   ├── build-registry.ts             # genera r/*.json
│   └── download-fonts.ts             # copia para el proyecto cliente
├── example/                          # showcase Next.js (no se publica al registry)
├── README.md                         # este archivo
├── USAGE.md                          # snippets de uso por componente
├── tei-design.md                     # reglas operativas (humanos + IA)
├── migration.md                      # playbook de migración (humanos + IA)
├── CHANGELOG.md                      # historial de releases
├── tsconfig.check.json               # typecheck offline contra ../node_modules
├── package.json
└── tsconfig.json
```
