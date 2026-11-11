#!/usr/bin/env node
/**
 * Exercises the pairing-by-code entry path end to end without a human at the
 * keyboard.
 *
 * It spawns `main.js` directly rather than `index.js`. The cluster primary and
 * its worker share one console on Windows, and the worker's writes go to that
 * console instead of the parent's redirected handle — so a cluster run cannot
 * be observed from a test. Running main.js alone exercises the same prompt,
 * sanitiser and requestPairingCode call without the fork.
 *
 * Output goes to files rather than pipes: on Windows a cluster worker does not
 * reliably inherit pipe handles, which hides every worker line from the parent.
 *
 * Usage: node tools/test-pairing.mjs [number]
 * Exit:  0 when the number was captured, 1 when the prompt timed out.
 */

import { spawn } from 'node:child_process';
import { closeSync, openSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const NUMBER = process.argv[2] ?? '+15551234567';
const OUT_PATH = join(tmpdir(), `gata-pairing-${process.pid}.log`);
const PROMPT_TIMEOUT_MS = 70_000;
const AFTER_INPUT_MS = 20_000;
const POLL_MS = 500;

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
const readLog = () => {
  try {
    return stripAnsi(readFileSync(OUT_PATH, 'utf8'));
  } catch {
    return '';
  }
};

rmSync(OUT_PATH, { force: true });
const outFd = openSync(OUT_PATH, 'w');

const child = spawn(process.execPath, ['main.js', 'code'], {
  cwd: ROOT,
  stdio: ['pipe', outFd, outFd],
});

let sent = false;
let exitCode = null;
child.on('exit', (code, signal) => {
  exitCode = `${code}/${signal ?? '-'}`;
});

const startedAt = Date.now();

const poll = setInterval(() => {
  if (sent) return;
  const log = readLog();
  if (!/mero de WhatsApp/i.test(log)) return;
  sent = true;
  setTimeout(() => child.stdin.write(`${NUMBER}\n`), 500);
}, POLL_MS);

setTimeout(async () => {
  clearInterval(poll);
  child.kill();
  closeSync(outFd);

  const log = readLog();
  const gotCode = /\b[A-Z0-9]{4}-[A-Z0-9]{4}\b/.test(log);
  const reachedRequest = /Intento \d\/\d/.test(log) || /No se pudo pedir/.test(log);

  console.log(`[pairing-test] elapsed=${Date.now() - startedAt}ms childExit=${exitCode ?? 'alive'}`);
  console.log(`[pairing-test] stale session wiped: ${/Sesi[oó]n sin registrar/.test(log)}`);
  console.log(`[pairing-test] prompt shown: ${sent}`);
  console.log(`[pairing-test] pairing code printed: ${gotCode}`);
  console.log(`[pairing-test] request attempted: ${reachedRequest}`);

  if (!sent) {
    console.error('--- log tail ---');
    console.error(log.split('\n').slice(-25).join('\n'));
    process.exit(1);
  }
  if (!gotCode) {
    console.error('[pairing-test] FAIL — no pairing code reached the console');
    console.error(log.split('\n').slice(-25).join('\n'));
    process.exit(1);
  }
  console.log('[pairing-test] PASS — pairing code printed for the submitted number');
  rmSync(OUT_PATH, { force: true });
  process.exit(0);
}, PROMPT_TIMEOUT_MS + AFTER_INPUT_MS);
