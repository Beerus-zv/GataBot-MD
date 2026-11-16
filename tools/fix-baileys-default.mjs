#!/usr/bin/env node
/**
 * Baileys 7 ships as ESM with a default export that is a function whose own
 * properties are empty. So this, repeated across the plugin tree, yields
 * undefined and every later call throws "is not a function":
 *
 *   const { generateWAMessageFromContent } = (await import(global.baileys)).default
 *
 * The named exports live on the namespace, not on .default. This rewrites the
 * baileys import namespace only: node-fetch and url-regex-safe are CommonJS and
 * their .default is the function we want, so they are left alone.
 *
 * Usage: node tools/fix-baileys-default.mjs [--write]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const WRITE = process.argv.includes('--write');

const PATTERN = /\(\s*await import\(\s*(global\.baileys|'(?:@whiskeysockets|@adiwajshing)\/baileys')\s*\)\s*\)\.default/g;

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === '.git') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (entry.endsWith('.js') || entry.endsWith('.mjs')) out.push(full);
  }
  return out;
};

const targets = [...walk(join(ROOT, 'plugins')), ...walk(join(ROOT, 'lib'))];
let touched = 0;
let occurrences = 0;

for (const file of targets) {
  const source = readFileSync(file, 'utf8');
  const matches = source.match(PATTERN);
  if (!matches) continue;
  occurrences += matches.length;
  touched += 1;
  const patched = source.replace(PATTERN, 'await import($1)');
  console.log(`${WRITE ? 'write' : 'dry  '} ${file.replace(ROOT + '\\', '')} (${matches.length})`);
  if (WRITE) writeFileSync(file, patched);
}

console.log(`\n${touched} file(s), ${occurrences} occurrence(s)${WRITE ? '' : ' — rerun with --write'}`);
