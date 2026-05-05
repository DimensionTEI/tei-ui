# tei-ui

Registry shadcn-compatible con los componentes y tokens del sistema de diseño Dimension TEI.

## Instalación en un proyecto cliente

Pre-requisitos: Next.js 15 + Tailwind CSS 4 + `shadcn` CLI 2.x.

```bash
# 1. Inicializa shadcn si no lo está
npx shadcn@latest init

# 2. Instala los tokens (CSS vars + fuentes) — siempre primero
npx shadcn@latest add https://<HOST>/r/tokens.json

# 3. Instala las fuentes WOFF2 a public/fonts/
npx tsx https://<HOST>/scripts/download-fonts.ts
# o copia el script a tu repo y ejecútalo en local

# 4. Importa los CSS en tu app/globals.css (orden importa)
#    @import 'tailwindcss';
#    @import '../styles/fonts.css';
#    @import '../styles/tokens.css';

# 5. Añade los componentes que necesites
npx shadcn@latest add https://<HOST>/r/button.json
npx shadcn@latest add https://<HOST>/r/dialog.json
# etc.
```

Reemplazar `<HOST>` por la URL pública donde se sirven los JSON (ver §Hosting).

## Componentes disponibles

| Item | Tipo | Descripción |
|------|------|------|
| `tokens` | style | CSS vars TEI (paleta clara/oscura) + Nunito + JetBrains Mono. **Instalar primero.** |
| `utils` | lib | Helper `cn()` (clsx + tailwind-merge). Dep de todos los demás. |
| `avatar` | ui | Avatar con fallback (Radix). |
| `badge` | ui | Etiqueta inline de estado. |
| `button` | ui | Botón con variantes default/secondary/ghost/outline/destructive/link. |
| `card` | ui | Contenedor con header/content/footer. |
| `code` | ui | `<InlineCode>` y `<CodeBlock>` con JetBrains Mono. |
| `dialog` | ui | Modal Radix con overlay tematizado. |
| `dropdown-menu` | ui | Menú contextual Radix. |
| `input` | ui | Input de formulario. |
| `label` | ui | Label asociable a input. |
| `separator` | ui | Línea divisoria horizontal/vertical. |
| `sheet` | ui | Drawer lateral (left/right). |
| `table` | ui | Tabla con header/row/cell. |
| `textarea` | ui | Textarea de formulario. |

`shadcn` resuelve automáticamente las dependencias internas: añadir `button` también añade `utils` si falta.

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
