/**
 * Descarga las 16 fuentes WOFF2 (Nunito + JetBrains Mono, latin + latin-ext)
 * a public/fonts/. Pensado para que el consumidor del registry lo ejecute
 * después de añadir el item `tokens`.
 *
 * Uso desde un proyecto cliente:
 *   curl -o tmp.ts https://<host>/r/download-fonts.ts && npx tsx tmp.ts
 *
 * O copiar este archivo a scripts/download-fonts.ts del proyecto cliente.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const FONTS = [
  'nunito-latin-400-normal',
  'nunito-latin-400-italic',
  'nunito-latin-500-normal',
  'nunito-latin-600-normal',
  'nunito-latin-700-normal',
  'nunito-latin-ext-400-normal',
  'nunito-latin-ext-400-italic',
  'nunito-latin-ext-500-normal',
  'nunito-latin-ext-600-normal',
  'nunito-latin-ext-700-normal',
];
const NUNITO_VERSION = '5.2.7';

const MONO = [
  'jetbrains-mono-latin-400-normal',
  'jetbrains-mono-latin-500-normal',
  'jetbrains-mono-latin-700-normal',
  'jetbrains-mono-latin-ext-400-normal',
  'jetbrains-mono-latin-ext-500-normal',
  'jetbrains-mono-latin-ext-700-normal',
];
const MONO_VERSION = '5.2.7';

async function fetchTo(url: string, target: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} en ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(target, buf);
  console.log(`✓ ${target}`);
}

async function main() {
  const outDir = resolve(process.cwd(), 'public/fonts');
  await mkdir(outDir, { recursive: true });

  await Promise.all([
    ...FONTS.map((f) =>
      fetchTo(
        `https://cdn.jsdelivr.net/npm/@fontsource/nunito@${NUNITO_VERSION}/files/${f}.woff2`,
        resolve(outDir, `${f}.woff2`),
      ),
    ),
    ...MONO.map((f) =>
      fetchTo(
        `https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@${MONO_VERSION}/files/${f}.woff2`,
        resolve(outDir, `${f}.woff2`),
      ),
    ),
  ]);

  console.log(`\n${FONTS.length + MONO.length} fuentes en ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
