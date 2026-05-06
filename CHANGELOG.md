# Changelog

Todas las releases del registry `tei-ui`. Sigue [Keep a Changelog](https://keepachangelog.com/) y [SemVer](https://semver.org/).

## [1.0.0] — 2026-05-06

Primera release estable. Set completo de primitivos cubriendo el catálogo del design system Dimension TEI más nueve patrones de página listos para usar.

### Añadido — 14 primitivos nuevos

Portados desde el design system Astro `estilo-dimensiontei` con la API de React:

- `avatar-group` — pila de avatares con `+N` overflow.
- `banner` — aviso ancho full-width con acción opcional y cierre.
- `code-tabs` — bloque de código con tabs por lenguaje (Astro/HTML/React/Vue/Blade), copy y persistencia en `localStorage`.
- `confirm-inline` — confirmación inline sin overlay para acciones destructivas pequeñas.
- `date-input` — `<input type="date|time|datetime-local|month">` con icono leading.
- `description-list` — `dl/dt/dd` semántico, orientación horizontal o vertical.
- `file-dropzone` — zona drag & drop con preview de archivos seleccionados.
- `notification-inbox` — botón campana con contador + Sheet con lista de notificaciones.
- `number-input` — stepper numérico con botones `+`/`−` y sufijo opcional.
- `rating` — estrellas en modo display o interactivo (radiogroup).
- `stat` — tarjeta KPI con franja de acento, label, value, hint y delta semántico.
- `stepper` — indicador multi-paso horizontal o vertical con estados done/current/pending.
- `tag` — badge dismissible para colecciones (filtros activos, etiquetas).
- `timeline` — feed cronológico vertical con icono, actor, acción, timestamp y body.

### Notas

- Total registry: **79 items** (68 ui + 9 blocks + tokens + utils).
- Build limpio. `dependencies[]` y `registryDependencies[]` autodetectadas por `scripts/build-registry.ts`.
- TypeScript validado contra el `node_modules` del monorepo (sin errores en los 14 nuevos).

## [0.4.0] — 2026-05-05

### Añadido — 9 patrones de página completos

Plantillas portadas de `estilo-dimensiontei/src/pages/patrones/`:

- `pattern-login` — tarjeta centrada con logo, iconos leading y toggle de contraseña.
- `pattern-error` — 404 / 403 / 500 / mantenimiento con presets + custom.
- `pattern-empty-states` — galería de estados vacíos (lista, búsqueda, carpeta, offline, error).
- `pattern-two-column` — layout settings con sub-nav lateral.
- `pattern-master-detail` — lista + detalle, colapsable en móvil.
- `pattern-settings` — header + tabs + secciones + zona peligrosa.
- `pattern-dashboard` — shell con header / KPIs / filtros / contenido / footer.
- `pattern-table` — tabla densa con sort, filtros como tags eliminables, selección múltiple, paginación.
- `pattern-long-form` — formulario multi-paso con stepper interno y autoguardado.

### Cambiado

- `scripts/build-registry.ts` ahora indexa `src/components/blocks/` y emite items `registry:block`.

## [0.3.0] — 2026-05-05

### Añadido — 4 primitivos compuestos

- `theme-provider` — Provider con `localStorage` + `matchMedia` (system), aplica `data-theme` al `<html>`. SSR-safe, sin `next-themes`.
- `theme-toggle` — botón Sun/Moon que conmuta claro ↔ oscuro.
- `data-table` — wrapper de `@tanstack/react-table` con sort, filtro y paginación cliente.
- `sidebar` — shell genérico con `sections`/`items` y renderer de `Link` inyectable (Next/router/`<a>`).

## [0.2.0] — 2026-05-05

### Añadido — 6 primitivos

- `chart`, `typography`, `empty-state`, `kbd`, `spinner`, `status-dot`.

## [0.1.1] — 2026-05-05

### Añadido — 31 primitivos shadcn standard

Lote inicial de Radix-based: `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `breadcrumb`, `calendar`, `carousel`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `slider`, `sonner`, `switch`, `table`, `tabs`, `toggle`, `toggle-group`, `tooltip`.

## [0.1.0] — 2026-05-05

### Añadido — bootstrap del registry

- `tokens` — CSS vars del design TEI (paleta clara/oscura) + Nunito + JetBrains Mono.
- `utils` — helper `cn()` (clsx + tailwind-merge).
- 13 primitivos iniciales: `avatar`, `badge`, `button`, `card`, `code`, `input`, `skeleton`, `textarea` y otros.
- `scripts/build-registry.ts` y `scripts/download-fonts.ts`.
- Hosting fijado a `https://github.com/DimensionTEI/tei-ui` (raw URLs).
