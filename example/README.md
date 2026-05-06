# Showcase

Página única (`page.tsx`) que demuestra los 14 primitivos nuevos de la v1.0.0 en composición conjunta. Pensada como referencia visual y plantilla de copy-paste, **no se publica al registry**.

## Cómo verla en local

```bash
# 1. Crea un proyecto Next.js limpio
npx create-next-app@latest tei-ui-demo --ts --tailwind --app --src-dir --import-alias "@/*"
cd tei-ui-demo

# 2. Crea components.json (mínimo viable)
cat > components.json <<'JSON'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide"
}
JSON

# 3. Instala tokens y los 14 primitivos (resuelve deps automáticamente)
npx shadcn@latest add \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tokens.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/avatar-group.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/banner.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/code-tabs.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/confirm-inline.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/date-input.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/description-list.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/file-dropzone.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/notification-inbox.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/number-input.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/rating.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/stat.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/stepper.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/tag.json \
  https://raw.githubusercontent.com/DimensionTEI/tei-ui/main/r/timeline.json

# 4. Importa los CSS en src/app/globals.css (orden importa)
#      @import 'tailwindcss';
#      @import '../styles/fonts.css';
#      @import '../styles/tokens.css';

# 5. Copia example/page.tsx a src/app/page.tsx
# 6. npm run dev → http://localhost:3000
```

## Smoke test verificado

Probado en `D:/temp/tei-ui-smoke` con Next.js 16 + React 19 + Tailwind 4 + shadcn 3:

- 14 primitivos instalados sin errores.
- Auto-resolución de dependencias: `avatar`, `utils`, `tabs`, `button`, `sheet`, `card`.
- `tsc --noEmit` → 0 errores tras instalar primitivos + 1 patrón.
