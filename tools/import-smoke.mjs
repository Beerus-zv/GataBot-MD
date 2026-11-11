#!/usr/bin/env node
/**
 * Dynamically imports every declared dependency and every optional helper the
 * plugins reach for, and reports the ones that throw at link time.
 *
 * `tools/dep-audit.mjs` only proves a specifier *resolves*. That is not enough:
 * a package can resolve cleanly and still explode on import when its nested
 * copy of a transitive dep is an ESM-only build that omits a default export
 * the caller destructures. That failure mode (cheerio 1.2.0 under
 * @bochilteam/scraper-*) is invisible to a resolver check, so it needs its own
 * gate.
 *
 * Usage: node tools/import-smoke.mjs [--json]
 * Exit:  0 when every import lands, 1 when any import throws.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PER_IMPORT_TIMEOUT_MS = 20_000;

/**
 * Packages the plugin tree imports at runtime that are not declared directly.
 * They arrive transitively, so a plain package.json sweep would miss them.
 */
const TRANSITIVE_TARGETS = [
  '@bochilteam/scraper',
  '@bochilteam/scraper-bmkg',
  '@bochilteam/scraper-facebook',
  '@bochilteam/scraper-googleit',
  '@bochilteam/scraper-images',
  '@bochilteam/scraper-instagram',
  '@bochilteam/scraper-lyrics',
  '@bochilteam/scraper-news',
  '@bochilteam/scraper-others',
  '@bochilteam/scraper-primbon',
  '@bochilteam/scraper-religions',
  '@bochilteam/scraper-snapsave',
  '@bochilteam/scraper-texts',
  '@bochilteam/scraper-tiktok',
  '@bochilteam/scraper-twitter',
  '@bochilteam/scraper-wikipedia',
  '@brandond/findthelyrics',
  'api-dylux',
  'aptoide-scraper',
  'google-it',
  'hxz-api',
  'yt-search',
];

/** Packages with a native or CLI-only entry that cannot be imported directly. */
const SKIP = new Set(['fluent-ffmpeg']);

async function declaredDependencies() {
  const raw = await readFile(join(ROOT, 'package.json'), 'utf8');
  const pkg = JSON.parse(raw);
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).sort();
}

/**
 * Import one specifier with a hard deadline. Some packages start timers or
 * open sockets on import; a hung module would otherwise stall the whole sweep.
 */
async function tryImport(specifier) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`timed out after ${PER_IMPORT_TIMEOUT_MS}ms`)),
      PER_IMPORT_TIMEOUT_MS,
    );
  });

  try {
    await Promise.race([import(specifier), deadline]);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message ?? String(error) };
  } finally {
    clearTimeout(timer);
  }
}

const targets = [...new Set([...(await declaredDependencies()), ...TRANSITIVE_TARGETS])]
  .filter((name) => !SKIP.has(name))
  .sort();

const failures = [];
const missing = [];

for (const specifier of targets) {
  const result = await tryImport(specifier);
  if (result.ok) continue;

  // "Cannot find package" is a different defect from "resolved but broken".
  const isMissing = /Cannot find (package|module)/i.test(result.error);
  if (isMissing) {
    missing.push({ specifier, error: result.error });
  } else {
    failures.push({ specifier, error: result.error });
  }
}

const report = {
  checked: targets.length,
  failed: failures,
  missing,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`checked ${report.checked} specifiers`);
  for (const entry of failures) {
    console.log(`FAILED  ${entry.specifier}\n        ${entry.error}`);
  }
  for (const entry of missing) {
    console.log(`MISSING ${entry.specifier}\n        ${entry.error}`);
  }
  if (failures.length === 0 && missing.length === 0) {
    console.log('all imports landed');
  }
}

process.exit(failures.length === 0 && missing.length === 0 ? 0 : 1);
