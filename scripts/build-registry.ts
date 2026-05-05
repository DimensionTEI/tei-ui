/**
 * Genera los items del registry shadcn a partir de los .tsx en
 * src/components/ui y de los activos comunes (utils, tokens, fonts).
 *
 * Para cada componente:
 *  - lee el archivo
 *  - extrae imports npm (lo que NO empieza por '@/' ni '.')
 *  - extrae imports internos (rutas '@/components/ui/X' → registryDependencies)
 *  - emite r/<componente>.json conforme al schema de shadcn
 *
 * Items especiales:
 *  - r/utils.json    → src/lib/utils.ts (función cn)
 *  - r/tokens.json   → tokens.css + fonts.css (registry:style)
 *
 * Genera además r/registry.json con el índice global.
 *
 * Uso: pnpm build
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const ROOT = join(__dirname, '..');
const SRC_UI = join(ROOT, 'src/components/ui');
const SRC_LIB = join(ROOT, 'src/lib');
const SRC_STYLES = join(ROOT, 'src/styles');
const OUT = join(ROOT, 'r');

// Deps asumidas en cualquier proyecto Next/React — no se declaran.
const HOST_PROVIDED = new Set(['react', 'react-dom', 'next']);

// Mapea import npm raíz → nombre de paquete a declarar.
function detectNpmDeps(content: string): string[] {
  const deps = new Set<string>();
  const re = /from\s+['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const spec = m[1]!;
    if (spec.startsWith('@/') || spec.startsWith('.')) continue;
    const parts = spec.split('/');
    const pkg = spec.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]!;
    if (HOST_PROVIDED.has(pkg)) continue;
    deps.add(pkg);
  }
  return [...deps].sort();
}

// Imports '@/components/ui/X' → registryDependency 'X'.
// Imports '@/lib/utils' → registryDependency 'utils'.
function detectRegistryDeps(content: string): string[] {
  const deps = new Set<string>();
  const re = /from\s+['"]@\/(components\/ui|lib)\/([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const which = m[1]!;
    const name = m[2]!;
    if (which === 'components/ui') deps.add(name);
    else if (which === 'lib' && name === 'utils') deps.add('utils');
  }
  return [...deps].sort();
}

type RegistryFile = {
  path: string;
  content: string;
  type: 'registry:ui' | 'registry:lib' | 'registry:file';
  target?: string;
};

type RegistryItem = {
  $schema: string;
  name: string;
  type: 'registry:ui' | 'registry:lib' | 'registry:style';
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
};

const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';

async function buildUiItem(filename: string): Promise<RegistryItem> {
  const name = basename(filename, '.tsx');
  const content = await readFile(join(SRC_UI, filename), 'utf-8');
  return {
    $schema: SCHEMA,
    name,
    type: 'registry:ui',
    description: `Primitivo TEI: ${name}`,
    dependencies: detectNpmDeps(content),
    registryDependencies: detectRegistryDeps(content),
    files: [
      {
        path: `components/ui/${filename}`,
        content,
        type: 'registry:ui',
        target: `components/ui/${filename}`,
      },
    ],
  };
}

async function buildUtilsItem(): Promise<RegistryItem> {
  const content = await readFile(join(SRC_LIB, 'utils.ts'), 'utf-8');
  return {
    $schema: SCHEMA,
    name: 'utils',
    type: 'registry:lib',
    description: 'Helper cn() para componer clases (clsx + tailwind-merge)',
    dependencies: detectNpmDeps(content),
    files: [
      {
        path: 'lib/utils.ts',
        content,
        type: 'registry:lib',
        target: 'lib/utils.ts',
      },
    ],
  };
}

async function buildTokensItem(): Promise<RegistryItem> {
  const tokens = await readFile(join(SRC_STYLES, 'tokens.css'), 'utf-8');
  const fonts = await readFile(join(SRC_STYLES, 'fonts.css'), 'utf-8');
  return {
    $schema: SCHEMA,
    name: 'tokens',
    type: 'registry:style',
    description:
      'Tokens TEI (CSS vars, paleta clara/oscura, fuentes Nunito + JetBrains Mono). Instala primero — todos los componentes dependen.',
    files: [
      {
        path: 'styles/tokens.css',
        content: tokens,
        type: 'registry:file',
        target: 'styles/tokens.css',
      },
      {
        path: 'styles/fonts.css',
        content: fonts,
        type: 'registry:file',
        target: 'styles/fonts.css',
      },
    ],
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const items: RegistryItem[] = [];
  items.push(await buildTokensItem());
  items.push(await buildUtilsItem());

  const uiFiles = (await readdir(SRC_UI)).filter((f) => f.endsWith('.tsx'));
  for (const f of uiFiles.sort()) {
    items.push(await buildUiItem(f));
  }

  for (const item of items) {
    await writeFile(join(OUT, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n');
  }

  // Índice global. Lista los items por nombre + tipo + descripción.
  const indexHomepage = process.env.TEI_UI_HOMEPAGE ?? 'https://github.com/DimensionTEI/tei-ui';
  const index = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'tei-ui',
    homepage: indexHomepage,
    items: items.map((i) => ({
      name: i.name,
      type: i.type,
      description: i.description,
      dependencies: i.dependencies,
      registryDependencies: i.registryDependencies,
    })),
  };
  await writeFile(join(OUT, 'registry.json'), JSON.stringify(index, null, 2) + '\n');

  console.log(`Generados ${items.length} items + registry.json en r/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
