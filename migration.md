# migration — playbook para adoptar tei-ui en un proyecto existente

> Guía paso-a-paso para migrar un proyecto ya avanzado al design system **Dimension TEI** sin romper lo que funciona. Para reglas operativas (qué primitivo usar, qué no hacer), ver [`tei-design.md`](./tei-design.md).
>
> Si lees esto como agente IA (Claude Code, Cursor, etc.), sigue las fases en orden. No saltes fases. No mezcles cambios de fases distintas en el mismo commit.

## Filosofía: migración paralela, no big-bang

Reemplazar todo de golpe rompe tests, regresiones visuales y la confianza del equipo. **Convivencia temporal** es OK durante la migración:

- Los componentes nuevos viven en `@/components/ui/` (instalados por shadcn).
- Los antiguos siguen donde estén (`@/components/legacy/`, `@/widgets/`, etc.) hasta que la página entera esté migrada.
- Cada PR migra **una pantalla o feature** completa, no medio botón a medias.
- Cuando un componente legacy ya no tiene callers, se elimina — no antes.

## Fase 0 — Auditoría (no se commitea código)

**Objetivo:** saber dónde estamos antes de tocar nada.

1. **Verificar pre-requisitos** (ver [`tei-design.md` §2](./tei-design.md#2-pre-requisitos-del-proyecto-consumidor)). Si falta Tailwind 4 o el alias `@/*`, **parar** y resolverlo primero.
2. **Inventario actual.** Listar:
   - Librería UI actual (shadcn ya, vanilla Tailwind, MUI, Mantine, Chakra, etc.).
   - `components.json` existe? Si sí, anotar `aliases.ui` y `aliases.utils`.
   - Componentes propios (`src/components/**`). Cuáles son atómicos (Button, Card) y cuáles son features (UserDashboard).
   - Páginas / rutas (qué páginas hay, cuáles tienen más complejidad visual).
   - Sistema de color actual (hex en CSS, Tailwind utilities, theme propio…).
3. **Map de equivalencias.** Para cada primitivo propio identificar el equivalente tei-ui:
   - `MyButton` → `button`
   - `MyModal` → `dialog`
   - `MyToast` → `sonner`
   - `MyCard` → `card`
   - …
4. **Decidir alcance.** ¿Migración total o solo features nuevas en TEI? Lo más realista para proyectos avanzados:
   - **Stop-the-bleed:** todas las features **nuevas** en TEI. Lo legacy no se toca.
   - **Migración por área:** una feature/sección por sprint.
   - **Big-bang controlado:** rara vez vale la pena.

**Entregable de Fase 0:** documento con el inventario, el map de equivalencias y el alcance. Confirmar con stakeholders antes de pasar a Fase 1.

## Fase 1 — Tokens y base (1 PR pequeño, sin tocar UI)

**Objetivo:** que el proyecto pueda renderizar tei-ui sin que aún use ningún primitivo.

1. Inicializar shadcn si no estaba:
   ```bash
   npx shadcn@latest init
   ```
   Adaptar el `components.json` que genere a la estructura real (ver template en [`tei-design.md` §2](./tei-design.md#2-pre-requisitos-del-proyecto-consumidor)).
2. Instalar tokens:
   ```bash
   npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json
   ```
   Crea `src/styles/tokens.css` y `src/styles/fonts.css`.
3. Importarlos en el CSS global del proyecto, **antes** de cualquier `@layer` o reglas propias y **después** de `@import 'tailwindcss'`:
   ```css
   @import 'tailwindcss';
   @import '../styles/fonts.css';
   @import '../styles/tokens.css';

   /* …reglas propias del proyecto… */
   ```
4. Instalar `utils` (helper `cn()`):
   ```bash
   npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/utils.json
   ```
5. **Verificar que el proyecto sigue funcionando exactamente igual que antes.**
   - `npm run build` o equivalente del framework.
   - Pruebas manuales de las 3-5 pantallas más críticas.
   - Las fuentes Nunito + JetBrains Mono ya cargarán pero no aplicarán hasta que algún elemento use `var(--tei-font-sans)`.
6. **Commit + merge.** No incluir nada más en este PR.

## Fase 2 — Theme provider y modo claro/oscuro (1 PR)

**Objetivo:** activar el sistema de temas TEI sin cambiar UI todavía.

1. Instalar:
   ```bash
   npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/theme-provider.json
   npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/theme-toggle.json
   ```
2. Envolver el árbol de la app con `<ThemeProvider>` (en `app/layout.tsx` para Next, `App.tsx` para Vite, layout principal en Astro/Remix).
3. Si el proyecto ya tenía un theme provider propio, **decidir cuál gana.** Reglas:
   - Si el legacy hacía algo más (ej. preferencia de idioma), no removerlo — anidar `<ThemeProvider>` dentro.
   - Si era solo dark mode, reemplazar.
4. Aún **no** poner `<ThemeToggle>` en la UI — eso vendrá en la Fase 3 cuando empiece la migración del header.
5. Verificar build + smoke manual.
6. Commit + merge.

## Fase 3 — Migrar la base atómica (varios PRs por componente)

**Objetivo:** sustituir Button, Input, Card, Dialog, etc. por los primitivos del registry. Página por página o componente por componente.

Estrategia recomendada por orden de impacto:

1. **Button** — toca casi todas las pantallas. Migrar todos los `<button>` y `<MyButton>` en bloque. Ojo a las variants: `primary`/`secondary` propios → `default`/`secondary` shadcn (no son lo mismo en estilo, repasar visual).
2. **Input + Textarea + Select + Checkbox + Switch** — formularios. Si usas `react-hook-form`, instalar también `form`.
3. **Card** — contenedores con borde y sombra.
4. **Dialog (Modal)** — confirmaciones y ediciones rápidas.
5. **Toast** — instalar `sonner` y reemplazar el sistema de toasts propio.
6. **Tabs / Breadcrumb / Pagination** — navegación interna.
7. **Tooltip / DropdownMenu** — menús y ayudas contextuales.

**Por cada primitivo:**

```bash
npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/<componente>.json
```

Buscar todos los usos del legacy con grep:

```bash
# Ejemplo Button
grep -rn 'from .*MyButton' src/
grep -rn '<button ' src/    # también cubre nativos
```

Reemplazar import + JSX. Validar con `npm run build` y revisión visual de pantallas afectadas.

**Anti-patrón crítico durante esta fase:** **no copiar/extender el primitivo recién instalado.** Si necesitas variantes nuevas, primero discútelo — los componentes del registry están hechos para sobrevivir actualizaciones (`shadcn add --overwrite` machaca cambios locales).

## Fase 4 — Sustituir patterns / pantallas completas

**Objetivo:** las páginas con composición compleja (login, dashboard, settings) pasan a usar los `pattern-*`.

1. Identificar la pantalla equivalente en [`pattern-*`](./README.md#patrones--bloques-9).
2. Instalar el patrón:
   ```bash
   npx shadcn@latest add https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/pattern-dashboard.json
   ```
   Crea `src/components/blocks/pattern-dashboard.tsx`.
3. **No usar el patrón directamente** en producción — copiar el contenido a la página real (`app/dashboard/page.tsx`) y editar textos, handlers, estado. El patrón es un punto de partida, no un componente reutilizable.
4. Validar con datos reales del proyecto.
5. Eliminar la versión vieja de la pantalla.

## Fase 5 — Limpieza

**Objetivo:** eliminar deuda y herencia.

1. **Buscar imports muertos.** Componentes legacy sin callers tras Fases 3-4. Eliminar.
2. **Buscar utilidades de color Tailwind crudas** (`bg-blue-*`, `text-gray-*`). Listado:
   ```bash
   grep -rEn '(bg|text|border|ring)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-[0-9]+' src/
   ```
   Reemplazar por `var(--tei-*)` equivalente.
3. **Buscar `style={{ color: '#…' }}`** y similares. Reemplazar.
4. **Eliminar la librería UI antigua** del `package.json` si ya no tiene callers (MUI, Chakra, etc.). Esto reduce bundle 100-300 KB típicamente.
5. **Eliminar `theme-provider` propio** si ya no aporta sobre el de tei-ui.
6. **Decidir tipografía final.** Si Nunito + JetBrains Mono cubren todo, eliminar Google Fonts u otras `@font-face` legacy.

## Fase 6 — Cierre

**Objetivo:** dejar el proyecto preparado para mantener consistencia futura.

1. Añadir al `README.md` o `CLAUDE.md` propio del proyecto una línea: *"Diseño y componentes seguir [`tei-design.md`](./tei-design.md)"*.
2. Añadir `tei-design.md` y `migration.md` (este archivo) a la raíz si quieres que la IA los tenga a mano. Actualizar cuando saquemos versión nueva del registry.
3. Documentar overrides locales (si los hay) en un `tei-overrides.md` propio. Justificar cada uno.
4. Configurar el CI para fallar si aparecen utilidades de color Tailwind crudas — ejemplo lint rule:
   ```jsonc
   // ESLint
   {
     "rules": {
       "no-restricted-syntax": ["error", {
         "selector": "Literal[value=/\\b(bg|text|border|ring)-(red|orange|...|stone)-[0-9]+\\b/]",
         "message": "Usar var(--tei-*) en lugar de utilidades de color Tailwind."
       }]
     }
   }
   ```

## Resolución de conflictos típicos

### "El proyecto ya tenía shadcn pero con `baseColor` distinto"

Las CSS vars de shadcn (`--background`, `--foreground`, etc.) coexisten con las TEI sin chocar (distinto prefijo). Mantener ambas hasta que el legacy esté migrado, luego eliminar las shadcn nativas.

### "El proyecto usa MUI / Chakra y no puedo migrar todo de golpe"

OK convivencia. Mantener MUI/Chakra solo en las pantallas legacy. Las nuevas, siempre tei-ui. Marcar las legacy en el inventario con fecha límite de migración. No mezclar ambos en la misma pantalla — confunde a los usuarios y rompe accesibilidad.

### "Hay un componente del registry que casi me sirve pero quiero cambiar X"

Tres opciones, en este orden:

1. **Composición.** ¿Puedes pasar `className` o `children` para conseguir el cambio?
2. **Wrapper local.** Crear `MyButton.tsx` que envuelva `<Button>` y aplique el cambio. Esto **no** te lo pisa `shadcn add --overwrite`.
3. **Editar el primitivo.** Solo si lo anterior no llega. Documentar el cambio en `tei-overrides.md` y NO ejecutar `--overwrite` sobre ese item sin revisar.

### "El build me peta tras instalar un primitivo"

Causas típicas:
- Falta una dep npm. Mirar `dependencies` en el JSON del item y `npm install` lo que falte.
- Tailwind 3 en lugar de 4. Migrar Tailwind primero.
- Conflicto de tipos por `@types/react` antiguo. Subir a `@types/react@19`.

## Checklist final de migración

- [ ] Fase 0: Inventario completo y alcance acordado.
- [ ] Fase 1: Tokens + utils instalados, `globals.css` con imports en orden, build OK.
- [ ] Fase 2: ThemeProvider operativo, dark mode funcional.
- [ ] Fase 3: Button, Input, Card, Dialog, Toast migrados (mínimo). Build OK por cada PR.
- [ ] Fase 4: Pantallas críticas (login, dashboard, settings) usando `pattern-*` correspondientes.
- [ ] Fase 5: Cero utilidades de color Tailwind crudas. Cero hex literales fuera de `tokens.css`. Librería UI legacy eliminada o con fecha de retiro.
- [ ] Fase 6: README/CLAUDE.md del proyecto referencia `tei-design.md`. CI con lint anti-color-crudo.
