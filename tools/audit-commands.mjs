#!/usr/bin/env node
/**
 * Drives every command that can run without arguments through the real
 * handler.js (via tools/probe-command.mjs) and reports which ones answer with
 * something, which answer with nothing, and which land in the generic
 * "ALGO SALIÓ MAL" card.
 *
 * A plugin that throws before its own try/catch is reported by handler.js as
 * format(e), so the reply text is the diagnostic. A plugin that swallows its
 * own error shows the failure card. Either way the chat is broken, and this
 * lists it.
 *
 * Usage: node tools/audit-commands.mjs [--full]
 * Exit:  0 when every probed command answered, 1 otherwise.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PROBE = join(ROOT, 'tools', 'probe-command.mjs');
const FULL = process.argv.includes('--full');
const TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT || 120_000);

// Comandos que deben responder desde estado local: nada de red, nada de media
// externa obligatoria. Los que empujan una imagen o un audio (cuentasoficiales,
// donate) entran a propósito: si el host está muerto, aquí se ve.
const COMMANDS = [
  '.menu',
  '.menu2',
  '.help',
  '.ping',
  '.estado',
  '.infobot',
  '.allmenu',
  '.menucompleto',
  '.runtime',
  '.rules',
  '.bot',
  '.serbot',
  '.grupos',
  '.creador',
  '.owner',
  '.speed',
  '.tts',
  '.morse',
  '.ofuscar',
  '.calculate',
  '.acertijo',
  '.listas',
  '.listaadv',
  '.listapremium',
  '.listabanuser',
  '.cuentasoficiales',
  '.donate',
  '.report',
  '.perfil',
  '.inventory',
];

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

// Comandos que no contestan en el acto y no son un fallo: .serbot abre un socket
// nuevo y entrega el QR o el código cuando WhatsApp responde, así que en un
// arranque sin conexión real la cuenta de respuestas es cero por diseño.
const BACKGROUND = new Set(['.serbot']);

// Which commands does the bot actually declare? Without this, a command that
// simply does not exist reads as "broken" and hides the real failures.
const readDeclaredCommands = () => {
  const dir = join(ROOT, 'plugins');
  const declared = new Set();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    const source = readFileSync(join(dir, file), 'utf8');
    for (const match of source.matchAll(/handler\.command\s*=\s*\/(.+?)\/([gimsuy]*)/g)) {
      try {
        const re = new RegExp(`^(?:${match[1]})$`, match[2].replace('g', ''));
        declared.add({ file, re });
      } catch {
        /* a malformed literal is its own finding, reported by test.js */
      }
    }
  }
  return declared;
};

const isDeclared = (declared, name) => [...declared].some((d) => d.re.test(name));


const classify = (output) => {
  const replies = Number(output.match(/replies captured: (\d+)/)?.[1] ?? 0);
  const threw = /handler THREW/.test(output);
  const generic = /Est[aá] Fallando el siguiente comando/i.test(output);
  const pluginError = /\[plugin\]|ReferenceError|TypeError|is not a function|Cannot read/i.test(output);
  const replyBodies = [...output.matchAll(/\[probe\] #\d+ full=(.+)/g)]
    .map((m) => {
      try {
        return String(JSON.parse(m[1]));
      } catch {
        return m[1];
      }
    })
    .join('\n')
    .slice(0, 900);
  return { replies, threw, generic, pluginError, replyBodies };
};

const results = [];
const declared = readDeclaredCommands();
for (const command of COMMANDS) {
  const name = command.slice(1);
  const exists = isDeclared(declared, name);
  const started = Date.now();
  const result = spawnSync(process.execPath, [PROBE, command], {
    cwd: ROOT,
    env: { ...process.env, PROBE_FULL: '1' },
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  const output = stripAnsi(`${result.stdout ?? ''}${result.stderr ?? ''}`);
  const verdict = classify(output);
  // A command nobody declares is not a bug; skip it instead of inflating the
  // broken count.
  const background = BACKGROUND.has(command);
  const ok = background
    ? !verdict.threw && !verdict.pluginError
    : verdict.replies > 0
      ? !verdict.generic && !verdict.threw && !verdict.pluginError
      : !exists;
  results.push({ command, exists, ok, background, ms: Date.now() - started, ...verdict });

  const flag = ok ? 'OK  ' : 'FAIL';
  const detail = background
    ? 'background'
    : !exists
      ? 'not declared'
      : ok
        ? `${verdict.replies} reply`
        : verdict.threw
          ? 'threw'
          : verdict.generic
            ? 'failure card'
            : verdict.pluginError
              ? 'plugin error'
              : 'no reply';
  console.log(`[audit] ${flag} ${command.padEnd(16)} ${detail.padEnd(14)} ${Date.now() - started}ms`);
}

const failed = results.filter((r) => !r.ok);
const reportPath = join(ROOT, 'tools', 'audit-commands.report.json');
writeFileSync(reportPath, JSON.stringify(results, null, 2));
if (FULL) console.log(`[audit] full report: ${reportPath}`);

if (failed.length) {
  console.error(`\n[audit] ${failed.length}/${results.length} command(s) broken\n`);
  for (const f of failed) {
    console.error(`--- ${f.command} ---`);
    console.error(f.replyBodies || '(no reply body)');
    console.error('');
  }
  process.exit(1);
}
console.log(`\n[audit] ${results.length}/${results.length} commands answered`);
