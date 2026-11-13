#!/usr/bin/env node
/**
 * The menu has to answer on every client and when the media fails.
 *
 * getDevice() decodes a WhatsApp message id into ios / web / android / desktop /
 * unknown. menu-lista.js used to branch on it: an interactive card for phone
 * clients, an image+audio message for web/desktop. WhatsApp Messenger silently
 * drops the interactive card while WhatsApp Business renders it, so the menu
 * simply never appeared for some readers. Both paths are still exercised here;
 * every case must produce a usable menu, never the generic error, never silence.
 *
 * Usage: node tools/test-menu.mjs
 * Exit:  0 when all cases answer, 1 otherwise.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PROBE = join(ROOT, 'tools', 'probe-command.mjs');

const CASES = [
  { name: 'android', id: 'A'.repeat(21), media: false },
  { name: 'ios', id: `3A${'B'.repeat(18)}`, media: false },
  { name: 'web', id: `3E${'C'.repeat(20)}`, media: false },
  { name: 'desktop', id: 'D'.repeat(18), media: false },
  { name: 'android, media failing', id: 'A'.repeat(21), media: true },
  { name: 'web, media failing', id: `3E${'C'.repeat(20)}`, media: true },
];

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

const run = ({ id, media }) => {
  const env = { ...process.env, PROBE_ID: id };
  if (media) env.PROBE_FAIL_MEDIA = '1';
  else delete env.PROBE_FAIL_MEDIA;

  const result = spawnSync(process.execPath, [PROBE, '.menu'], {
    cwd: ROOT,
    env,
    encoding: 'utf8',
    timeout: 180_000,
  });
  const output = stripAnsi(`${result.stdout ?? ''}${result.stderr ?? ''}`);
  const replies = Number(output.match(/replies captured: (\d+)/)?.[1] ?? 0);
  // The generic failure card quotes the command back; a real menu carries the
  // uptime line. Anything else — silence included — is a failure.
  const generic = /Est[aá] Fallando el siguiente comando/i.test(output);
  // The probe prints only the head of each reply, so a relayed interactive card
  // shows up as JSON beginning with viewOnceMessage/interactiveMessage.
  const isMenu = /Total de Usuarios/i.test(output) || /interactive/i.test(output);
  return { replies, generic, isMenu, tail: output.split('\n').slice(-12).join('\n') };
};

let failed = 0;
for (const testCase of CASES) {
  const { replies, generic, isMenu, tail } = run(testCase);
  const ok = !generic && isMenu && replies > 0;
  console.log(
    `[menu-test] ${ok ? 'PASS' : 'FAIL'} ${testCase.name.padEnd(24)} replies=${replies} generic=${generic} menu=${isMenu}`
  );
  if (!ok) {
    failed += 1;
    console.error(tail);
  }
}

if (failed) {
  console.error(`[menu-test] ${failed}/${CASES.length} cases did not answer with a menu`);
  process.exit(1);
}
console.log(`[menu-test] PASS — ${CASES.length}/${CASES.length} cases answered with a menu`);
