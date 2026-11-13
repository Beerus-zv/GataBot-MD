#!/usr/bin/env node
/**
 * The menu has to answer on every client, on every account shape, and when the
 * media fails.
 *
 * getDevice() decodes a WhatsApp message id into ios / web / android / desktop /
 * unknown. menu-lista.js used to branch on it: an interactive card for phone
 * clients, an image+audio message for web/desktop. WhatsApp Messenger silently
 * drops the interactive card while WhatsApp Business renders it, so the menu
 * simply never appeared for some readers. It is one plain-text message now.
 *
 * The last three cases cover migrated accounts: WhatsApp addresses the sender
 * as 166842769391723@lid and puts the phone number in key.participantAlt. The
 * greeting must mention the number, never the lid.
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
  { name: 'liquid account', id: 'A'.repeat(21), media: false, lid: true },
  { name: 'liquid, media failing', id: `3E${'C'.repeat(20)}`, media: true, lid: true },
];

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

const run = ({ id, media, lid }) => {
  const env = { ...process.env, PROBE_ID: id, PROBE_FULL: '1' };
  if (media) env.PROBE_FAIL_MEDIA = '1';
  else delete env.PROBE_FAIL_MEDIA;
  if (lid) env.PROBE_LID = '1';
  else delete env.PROBE_LID;

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
  const isMenu = /Total de Usuarios/i.test(output) || /viewOnceMessage/.test(output);
  // A migrated account must never leak the lid into the greeting.
  const mentionsNumber = output.includes('@573000000001');
  const leaksLid = output.includes('@166842769391723');
  return { replies, generic, isMenu, mentionsNumber, leaksLid, tail: output.split('\n').slice(-14).join('\n') };
};

let failed = 0;
for (const testCase of CASES) {
  const { replies, generic, isMenu, mentionsNumber, leaksLid, tail } = run(testCase);
  const mentionOk = testCase.lid ? mentionsNumber && !leaksLid : mentionsNumber;
  const ok = !generic && isMenu && replies > 0 && mentionOk;
  console.log(
    `[menu-test] ${ok ? 'PASS' : 'FAIL'} ${testCase.name.padEnd(24)} replies=${replies} generic=${generic} menu=${isMenu} mention=${mentionsNumber} lid-leak=${leaksLid}`
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
