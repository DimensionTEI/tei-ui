# tei-ui

Registry shadcn-compatible con los componentes y tokens del sistema de diseño Dimension TEI.

## Instalación en un proyecto cliente

Pre-requisitos: Next.js 15 + Tailwind CSS 4 + `shadcn` CLI 2.x.

```bash
# 1. Inicializa shadcn si no lo está
npx shadcn@latest init

# 2. Instala los tokens (CSS vars + fuentes) — siempre primero
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json

# 3. Instala las fuentes WOFF2 a public/fonts/
npx tsx https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/scripts/download-fonts.ts
# o copia el script a tu repo y ejecútalo en local

# 4. Importa los CSS en tu app/globals.css (orden importa)
#    @import 'tailwindcss';
#    @import '../styles/fonts.css';
#    @import '../styles/tokens.css';

# 5. Añade los componentes que necesites
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/button.json
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/dialog.json
# etc.
```

El `<HOST>` ya está fijado al mirror público — sustituye solo si lo migras a otro hosting.

## Componentes disponibles

**Base (instalar primero):**

| Item | Tipo | Descripción |
|------|------|------|
| `tokens` | style | CSS vars TEI (paleta clara/oscura) + Nunito + JetBrains Mono. |
| `utils` | lib | Helper `cn()` (clsx + tailwind-merge). |

**Primitivos (68):**

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `avatar-group` · `badge` · `banner` · `breadcrumb` · `button` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `code` · `code-tabs` · `collapsible` · `command` · `confirm-inline` · `context-menu` · `data-table` · `date-input` · `description-list` · `dialog` · `drawer` · `dropdown-menu` · `empty-state` · `file-dropzone` · `form` · `hover-card` · `input` · `input-otp` · `kbd` · `label` · `menubar` · `navigation-menu` · `notification-inbox` · `number-input` · `pagination` · `popover` · `progress` · `radio-group` · `rating` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `stat` · `status-dot` · `stepper` · `switch` · `table` · `tabs` · `tag` · `textarea` · `theme-provider` · `theme-toggle` · `timeline` · `toggle` · `toggle-group` · `tooltip` · `typography`

**Patrones / bloques (9):** plantillas compuestas de página completa, listas para empezar a editar.

| Item | Para qué |
|------|----------|
| `pattern-login` | Login centrado con logo, iconos leading, toggle de contraseña |
| `pattern-error` | Páginas 404 / 403 / 500 / mantenimiento |
| `pattern-empty-states` | Galería de estados vacíos (lista, búsqueda, carpeta, offline, error) |
| `pattern-two-column` | Layout settings con sub-nav lateral |
| `pattern-master-detail` | Lista + detalle (bandeja, tickets, conversaciones) |
| `pattern-settings` | Página de preferencias con tabs + secciones + zona peligrosa |
| `pattern-dashboard` | Dashboard con KPIs (`StatCard`) + filtros + tabla + footer |
| `pattern-table` | Tabla densa con sort, filtros, selección múltiple, bulk actions y paginación |
| `pattern-long-form` | Formulario multi-paso con stepper y autoguardado |

`shadcn` resuelve automáticamente las dependencias internas: añadir `button` también añade `utils` si falta.

Lista completa con dependencias npm en [`r/registry.json`](./r/registry.json). Snippets de uso por componente en [`USAGE.md`](./USAGE.md). Showcase Next.js de los 14 primitivos en [`example/`](./example). Historial de releases en [`CHANGELOG.md`](./CHANGELOG.md).

## Hosting del registry

Los JSON en `r/` son ficheros estáticos. Tres opciones:

**1) GitHub raw (cero infraestructura).** Push a un repo público y usa `https://raw.githubusercontent.com/<org>/<repo>/main/r/<item>.json`.

**2) GitHub Pages.** Activa Pages sobre la carpeta `r/`. URL final: `https://<org>.github.io/<repo>/<item>.json`.

**3) Vercel / Netlify.** Importa el repo, build vacío, salida estática. URL: `https://<proyecto>.vercel.app/r/<item>.json`.

Una vez hosteado, `<HOST>` queda fijado y se actualiza una sola vez en este README.

## Actualizar el registry

```bash
# tras editar src/components/ui/*.tsx, src/styles/*.css o src/lib/utils.ts
pnpm build
```

Regenera `r/*.json` y `r/registry.json`. Commit + push.

## Estructura

```
tei-ui-registry/
├── r/                              # JSON consumidos por shadcn add
├── src/
│   ├── components/ui/*.tsx         # fuente de verdad de los componentes
│   ├── lib/utils.ts                # cn()
│   └── styles/{tokens,fonts}.css   # CSS vars + @font-face
├── public/fonts/*.woff2            # Nunito + JetBrains Mono (latin + latin-ext)
├── scripts/
│   ├── build-registry.ts           # genera r/*.json
│   └── download-fonts.ts           # copia para el proyecto cliente
├── package.json
└── tsconfig.json
```
