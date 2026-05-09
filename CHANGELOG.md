# Changelog

Todas las releases del registry `tei-ui`. Sigue [Keep a Changelog](https://keepachangelog.com/) y [SemVer](https://semver.org/).

## [1.4.6] — 2026-05-09

### Fix · active text theme-aware (sin `dark:` variant)

**Problema descubierto en producción** (gracias Adrián por el debugging del CSS): el selector `dark:text-[var(--color-cyan-100)]` pisaba al `text-[var(--color-oxford-800)]` cuando el navegador detecta `.dark` (incluso en estados ambiguos donde la app no es propiamente dark mode visual).

**Fix:** eliminar la dependencia de `dark:` variant. Usar `var(--color-text-heading)` que ya es theme-aware en los tokens:

- Light: `ink-950` (#080c14, casi negro) → máximo contraste sobre cyan-50 bg.
- Dark: `#ffffff` (blanco) → máximo contraste sobre bg-tinted oxford.

Aplicado a parent y child activos. Sin `dark:` modifiers — el CSS var resuelve automáticamente con el tema.

```tsx
// Antes (frágil ante override de .dark):
text-[var(--color-oxford-800)] dark:text-[var(--color-cyan-100)]

// Ahora (theme-aware nativo):
text-[var(--color-text-heading)]
```

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

## [1.4.5] — 2026-05-09

### Fix · contraste real del active label

**Problema:** cyan-800 sobre cyan-50 tiene contraste técnico (8:1) pero visualmente queda apagado porque ambos pertenecen a la misma familia cromática. El cerebro percibe poca diferencia. Esto era visible en producción incluso con WCAG AA cumplido.

**Fix:** salir del cyan-family para el active text y usar oxford (navy oscuro, casi negro). El bg sigue siendo cyan-50 (cyan-tint suave), pero el texto pasa a navy → contraste visual MASIVO + canónico TEI cumplido (oxford es color de marca).

- Active level 0 (parent): `cyan-800` → `oxford-800` (#0f223a — navy casi negro).
- Active level 1 (child): `cyan-700` → `cyan-800` (un tono más oscuro, dentro de cyan family pero más legible).

**Dark mode:** sin oxford (rompería sobre fondo navy ya oscuro).
- Parent dark active: `cyan-200` → `cyan-100` (más claro sobre bg-tinted oxford).
- Child dark active: `cyan-300` → `cyan-200`.

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

## [1.4.4] — 2026-05-09

### Fix · contraste del Sidebar (final 100%)

**1. Active label más oscuro**

En v1.4.2 cambié `cyan-700` → `cyan-600` pensando "más saturado". **Era al revés** — cyan-600 (#0086c2) es MÁS CLARO que cyan-700 (#0a6c9c) en la escala TEI. Resultado: parent activo se veía pálido vs el canónico que está claramente más oscuro.

Fix:
- Active level 0 (parent): `cyan-700` → `cyan-800` (#0f5980, oscuro vibrante).
- Active level 1 (child): `cyan-600` → `cyan-700` (oscurecer un grado).
- Dark mode: `cyan-300` → `cyan-200` para parent (más claro sobre oxford navy).

**2. Shortcuts con MUCHO más contraste**

Las kbd seguían apenas leíbles tras v1.4.3. Salto agresivo:
- Border: `border-default` → `border-strong` (ink-400, claramente visible).
- Texto: `text-secondary` → `text-primary` (ink-900, casi negro).
- Bg: `bg-elevated` → `bg` (asegura contraste sobre cualquier surface).
- Punto separador: `font-bold` añadido para que destaque entre las dos kbd.

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

## [1.4.3] — 2026-05-08

### Fix · 2 detalles canónicos del Sidebar pendientes

**1. Guía vertical en los submenús (tree indent)**

Faltaba la línea sutil que recorre todo el bloque de children expandido (no solo el item activo). Patrón visual canónico TEI: la guía marca la jerarquía de árbol incluso cuando ningún child está activo.

Implementación: `<span absolute left-[15px] top-1 bottom-1 w-px bg-border-default>` dentro del contenedor de children. La barra cyan del item activo (3px en `left-[14px]`) sigue por encima de la guía con su color saturado, sustituyendo visualmente el segmento correspondiente al item activo.

**2. Shortcuts con más contraste**

Los `<kbd>` apenas se leían sobre el bg del sidebar:
- Border: `border-subtle` (ink-200) → `border-default` (ink-300). Más visible.
- Texto: `text-muted` (ink-500) → `text-secondary` (ink-700). Más oscuro, más legible.
- Dark mode bg: `bg-elevated` (oxford-700) → `bg-subtle` (oxford-700) — sin cambio funcional, comentario por consistencia.

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

Sin cambios en API. Solo CSS interno.

## [1.4.2] — 2026-05-08

### Fix · polish visual final del Sidebar (matching canónico TEI 100%)

Tras feedback del integrador (visualmente "casi pero no del todo"), tres ajustes finos:

**1. Items con `font-medium` por defecto**

Antes: items en reposo en `font-normal` (400). Ahora `font-medium` (500). Más legibles, más cercanos al canónico TEI donde los labels tienen presencia tipográfica.

**2. Active label en `cyan-600` (más vibrante)**

Antes: `cyan-700` (más oscuro, podía verse apagado sobre el bg cyan-50). Ahora `cyan-600` — más saturado, más TEI. El `!font-bold` con `!important` asegura que prevalece sobre `font-medium` base.

**3. Barra vertical de child más visible**

- Ancho: `w-[2px]` → `w-[3px]` (50% más visible).
- Altura: `top-1.5 bottom-1.5` → `top-1 bottom-1` (cubre más del row).
- Más fácil de detectar a primera vista.

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

Sin cambios en API. Solo CSS interno.

## [1.4.1] — 2026-05-08

### Fix · 3 bugs visuales del Sidebar v1.4.0

**1. Barra vertical de child activo no se renderizaba**

Tailwind v4 exige `content` explícito para pseudo-elements. Faltaba `before:content-['']` en la clase del child activo. Resultado: la barra cyan que debería marcar el child seleccionado no aparecía.

Fix: añadido `before:content-['']` y barra de `w-[2px]` (más visible que `w-0.5`).

**2. Texto de items demasiado claro en reposo**

Items en reposo usaban `text-secondary` (gris medio) en lugar de `text-primary` (negro/blanco). Diferencia visible vs canónico TEI.

Fix:
- Level 0 reposo → `text-primary` (más legible).
- Level 1 reposo → `text-secondary` (un poco más suave que parents, jerárquicamente correcto).

**3. Active label no lo bastante destacado**

`font-semibold` (600) → `font-bold` (700). El parent activo y child activo ahora destacan más sobre los items en reposo.

Y un toque extra: bg active level 0 dark sube de `rgb(.../0.15)` a `rgb(.../0.18)` para más contraste sobre oxford navy.

### Migración

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

Sin cambios en API. Solo CSS interno del componente.

## [1.4.0] — 2026-05-08

### Cambiado · Sidebar canónico TEI completo (matching estilo.dimensiontei.com)

Tras feedback visual del primer integrador (la v1.3.x dejaba el sidebar parecido pero no idéntico al canónico TEI), se ajustan tres aspectos críticos:

**1. `tone` por item — icono colorido individual**

Cada `SidebarItem` puede llevar un `tone` (`cyan` | `blue` | `yellow` | `coral` | `ink`) que colorea el icono en reposo. Antes los iconos eran uniformes por sección; ahora cada item se pinta con su tono propio (`Empezar` cyan, `Marca` coral, `Tipografía` text-primary, etc.) — replicando el lenguaje visual de la guía TEI canónica.

```ts
items: [
  { href: '/marca',      label: 'Marca',      icon: Sparkles, tone: 'coral' },
  { href: '/tipografia', label: 'Tipografía', icon: Type,     tone: 'ink'   },
  { href: '/color',      label: 'Color',      icon: Droplet,  tone: 'blue'  },
  { href: '/voz',        label: 'Voz y tono', icon: MessageCircle, tone: 'coral' },
]
```

El `active state` SIEMPRE pinta el icono cyan, independientemente del tone — el tone solo aplica en reposo.

**2. Active styling distinto entre parent y child**

- **Parent (level 0) activo:** bg `--color-cyan-50` (light) / `rgb(26_163_224/0.15)` (dark) + label en `cyan-700` / `cyan-300` + icono cyan. **Sin** stripe vertical (era confuso visualmente).
- **Child (level 1) activo:** solo **barra vertical lateral** (`w-0.5`, `bg-cyan-500`, posicionada a la izquierda del label). Sin bg, sin icono (children no llevan icono). Más sutil, jerárquicamente correcto — el child es subordinado del parent, no compite visualmente.

**3. Shortcut chip estilo `[G] · [E]`**

Reemplaza el `<kbd>g d</kbd>` plano por dos `<kbd>` separados por un punto:

```html
<kbd>G</kbd> · <kbd>E</kbd>
```

Más legible, más canónico, más bonito.

**4. `tone` por section**

`SidebarSection.tone` permite asignar un color al kicker del título de la sección. Reemplaza el muted gris uniforme. Si no se especifica, sigue muted.

```ts
sections: [
  { title: 'Workspace',      tone: 'cyan',   items: [...] },
  { title: 'Administración', tone: 'coral',  items: [...] },
  { title: 'Plataforma',     tone: 'yellow', items: [...] },
]
```

### Migración para consumidores

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

API aditiva — los proyectos que ya usan v1.3.x siguen funcionando sin cambios. Para activar los nuevos tones, añadir `tone` a items / sections en la factory de sections.

### Bump MINOR (v1.3.1 → v1.4.0)

Las propiedades `tone` son aditivas (opcionales) → no hay breaking change. Pero el cambio visual del active state (parent ya no lleva stripe vertical) es notable, así que MINOR para que los consumidores que actualicen lo vean en el changelog.

## [1.3.1] — 2026-05-08

### Fix · Sidebar shortcuts siempre visibles

`<kbd>g d</kbd>` ahora se muestra **siempre** en items con `shortcut`, no solo en hover. Visibilidad gradual:

- Reposo: `opacity-60` (visible pero discreto).
- Hover o item activo: `opacity-100`.

Patrón Linear/GitHub. Permite descubrir los atajos sin tener que pasar el ratón por encima.

## [1.3.0] — 2026-05-08

### Cambiado · Sidebar canónico TEI

El primitivo `sidebar` se extiende para igualar el comportamiento del sistema TEI canónico (`estilo.dimensiontei.com`):

**1. Sub-items inline (`items[].children`)** — sub-navegación que se expande **dentro del mismo aside**, debajo del item padre activo. Anidación de un nivel. Reemplaza el patrón anterior de "sub-nav en main panel" para casos donde la sub-navegación es estructural a la sección (admin/empresa/{configuracion,usuarios,licencias…}).

**2. Atajos de teclado `g+letra` (`items[].shortcut`)** — al estilo Linear/GitHub. El usuario pulsa `g`, luego una letra (`d`, `c`, `e`…) y navega al item correspondiente. El handler es global pero respeta inputs/textareas/contenteditable. Ventana de 1.2s tras pulsar `g`. Visible en hover como `<kbd>g d</kbd>` en el item.

**3. Stripe vertical cyan en item activo** — `box-shadow: inset 3px 0 0 0 var(--color-cyan-500)`. Acento canónico TEI que faltaba en v1.2.0.

**4. Visual refinado:**
- Icono del item activo en cyan (no en text-strong).
- Bg del item activo: `var(--color-bg-tinted)` (cyan-tint) en lugar de `surface`.
- Section title en 11px bold uppercase tracking 0.14em (canónico).
- Indentación de sub-items: 36px (alineado con el icono del padre).

**5. Prop nueva `onShortcutNavigate`** — el consumidor pasa `(href) => router.push(href)` para integración con Next.js / React Router. Si no se pasa, se hace `window.location.href = href` (recarga, válido para multi-page).

### API

```ts
type SidebarItem = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  active?: boolean;
  shortcut?: string;            // 'd', 'c', 'e'… (una letra)
  children?: SidebarItem[];     // sub-items inline
};

<Sidebar
  sections={sections}
  renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
  onShortcutNavigate={(href) => router.push(href)}
/>
```

Cero breaking change en proyectos que ya usan v1.2.0 (los nuevos props son opcionales).

### Migración para consumidores

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/sidebar.json --overwrite
```

Si el consumidor venía usando una arquitectura "sub-nav en main panel" (patrón Vercel/Stripe Settings) y quiere volver al patrón TEI canónico de inline-expansion, debe:

1. Mover los items del sub-nav a `children` del item padre en la factory de sections.
2. Eliminar el componente `<EmpresaSubNav>` (o equivalente) del shell de la página.
3. Añadir `shortcut: 'letra'` a los items que quiera activar con teclado.
4. Pasar `onShortcutNavigate={(href) => router.push(href)}` al Sidebar.

## [1.2.0] — 2026-05-08

### Cambiado · componentes vibrantes (matching estilo.dimensiontei.com)

La v1.1.0 actualizó solo los **tokens** a la paleta TEI canónica, pero los componentes seguían con styling neutro tipo shadcn estándar. Resultado visual: solo los botones y focus rings cambiaron, las cards/alerts/badges/stats seguían "grises tristes". Esta release **rehace el styling de los componentes coloridos** para igualar el lenguaje visual de `estilo.dimensiontei.com`.

**Componentes con styling vibrante nuevo:**

- `alert` — variantes `info`/`success`/`warning`/`destructive` con bg-50 + border-300 + text-700 (tinte completo en lugar de opacidad subtle).
- `banner` — mismas variantes que alert, ancho completo, con SVG icon coloreado.
- `badge` — añadidas variantes tonales `cyan`/`blue`/`yellow`/`coral` con bg-50 + text-700 + border-200 (light) y rgb-tint con text-300 (dark). Mantiene `default`/`success`/`warning`/`danger`/`outline`/`muted`/`neutral`.
- `tag` — refactor de tonos para igualar al sistema de badges (canónico TEI).
- `stat` — accent stripe colorido arriba (`tei-stripe-{cyan,blue,yellow,coral,ink}` aplicado vía `box-shadow inset`). Etiquetas en tracking 0.14em uppercase.
- `avatar` — añadida prop `tone` en `AvatarFallback` con variantes `cyan`/`blue`/`yellow`/`coral`/`neutral`. Permite avatares coloridos al estilo guía TEI.
- `avatar-group` — auto-cycle de tonos cyan→coral→yellow→blue por defecto, salvo que cada person traiga su propio `tone`.

**Componente nuevo:**

- `kicker` — etiqueta tipográfica de sección (11px bold uppercase, tracking 0.14em). Variantes `cyan`/`blue`/`yellow`/`coral`/`ink`. Usar como label antes de h1/h2 para estilo TEI canónico.

### Añadido · capa semántica `--color-*` completa

`tokens.css` ahora define las semantic tokens que los componentes coloridos consumen:

- **Backgrounds:** `--color-bg`, `--color-bg-elevated`, `--color-bg-chrome`, `--color-bg-subtle`, `--color-bg-muted`, `--color-bg-tinted`, `--color-bg-overlay`.
- **Texto:** `--color-text-primary`, `--color-text-heading`, `--color-text-secondary`, `--color-text-muted`, `--color-text-disabled`, `--color-text-inverse`.
- **Bordes:** `--color-border-subtle`, `--color-border-default`, `--color-border-strong`.
- **Brand:** `--color-brand`, `--color-brand-hover`, `--color-brand-soft`, `--color-brand-bg-soft`.

Todos definidos en light + dark.

### Añadido · utilidades visuales TEI

CSS classes embebidas en `tokens.css` para uso directo desde cualquier componente vía `className`:

- `.tei-kicker-{cyan,blue,yellow,coral,ink}` — usado por el primitivo `Kicker`.
- `.tei-stripe-{cyan,blue,yellow,coral,ink}` — franja coloreada superior (Stat ya la usa internamente, también disponible para Cards destacadas).
- `.text-gradient-cyan` — gradient cyan-500→cyan-300 para palabras destacadas en titulares (`<h1>Dashboard de <span class="text-gradient-cyan">control</span></h1>`).

### Migración para consumidores existentes

```bash
# Sobrescribe los componentes con styling vibrante
npx shadcn@latest add \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/alert.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/banner.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/badge.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tag.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/stat.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/avatar.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/avatar-group.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/kicker.json \
  --overwrite
```

Tras esto:
- Los KPIs renderizan con franja superior cyan/coral/yellow.
- Los alerts/banners llevan tinte completo de color, no opacidad subtle.
- Los badges/tags pueden usar variantes/tonos cyan/blue/yellow/coral.
- Los avatares en grupo se ven coloridos por defecto.
- Los headings de página pueden llevar `<Kicker tone="cyan">` arriba.

**No requieren cambio:** los 71 primitivos restantes siguen funcionando idénticos (button, card, dialog, sidebar, etc.).

### Nota sobre versionado

Los componentes ahora producen visuales sustancialmente distintos a v1.1.0 (cualquiera que use Alert/Badge/Banner/Stat verá cambio inmediato). Aun así marcamos MINOR (v1.2.0) y no MAJOR porque:

- API pública preservada (mismas props, mismas variantes).
- v1.1.0 fue una release de tránsito muy corta (mismo día).
- Cambio dirigido a converger con la intención original de marca, no divergir.

## [1.1.0] — 2026-05-08

### Cambiado · paleta TEI canónica como default

`tokens.css` realineado con el sistema de diseño canónico de Dimension TEI ([estilo.dimensiontei.com](https://estilo.dimensiontei.com)). El registry pasa de paleta neutra ChatGPT/Claude a la **paleta colorida TEI** (oxford navy + cyan + coral + yellow + ink).

**Cambio visual sustancial.** Los 79 primitivos no cambian de código — siguen consumiendo `var(--tei-*)`. Lo que cambia son los **valores** que esas variables resuelven:

- **Tema claro:** superficies blancas/ink-50, texto ink-900, accent y brand `cyan-400/500`, semánticos en cyan/coral/yellow.
- **Tema oscuro:** superficies oxford-800/700 (azul navy profundo), texto blanco, accent y brand `cyan-400`, semánticos algo más claros para contraste.

### Añadido · capa pública `--color-*`

Toda la paleta TEI ahora se expone con namespace `--color-*` (compatible con Tailwind v4 `@theme inline`):

- 11 escalas × 11 tonos = 121 tokens base (`cyan`, `blue`, `yellow`, `coral`, `oxford`, `ink` × `50…950`).
- Aliases semánticos `--color-{success,warning,danger,info}-*`.

Consumidores que quieran usar la paleta TEI directamente (fuera de los 79 primitivos) pueden hacer `bg-[var(--color-cyan-400)]` sin pasar por aliases `--tei-*`.

### Migración para consumidores existentes

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json --overwrite
```

Esto sobrescribe `src/styles/tokens.css` con la paleta canónica. Los componentes ya instalados (`@/components/ui/*`) **no requieren cambio** — siguen usando `var(--tei-*)`.

Tras actualizar:

1. Verifica visual en pantallas críticas (login, dashboard, tabla, settings).
2. Si tu app montaba dark mode con valores ChatGPT-grises, ahora verás oxford navy. Si la marca de tu producto es esto, perfecto. Si no, define tus overrides en una capa propia (`tokens-overrides.css` cargado después).

### Nota sobre versionado

Estrictamente este es un cambio MAJOR (`v2.0.0`) por el cambio visual paradigmático. Lo etiquetamos como `v1.1.0` porque:

- Cero consumidores externos conocidos hasta esta release.
- La intención original del registry era la paleta TEI canónica — la `v1.0.0` neutra fue una decisión experimental que se reinvirtió en menos de una semana.

Futuros cambios visuales paradigmáticos sí escalarán a MAJOR.

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
