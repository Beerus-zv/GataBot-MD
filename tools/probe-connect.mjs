#!/usr/bin/env node
/**
 * Bare-bones connect probe: no plugins, no cluster, no language files.
 *
 * Purpose is to separate "WhatsApp rejects the handshake" from "main.js drops
 * the event". It prints every connection.update payload verbatim and exits on
 * the first QR (proving the socket reached the pairing stage) or on a hard
 * disconnect (proving WhatsApp refused it).
 *
 * Usage: node tools/probe-connect.mjs [--qr] [--seconds N]
 *   --qr        print the QR payload as raw text instead of an ASCII matrix
 *   --seconds   hard deadline, default 45
 */

import { mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const AUTH_DIR = join(ROOT, '.probe-session');
const args = process.argv.slice(2);
const RAW_QR = args.includes('--qr');
const secondsArg = args.indexOf('--seconds');
const DEADLINE_MS = (secondsArg !== -1 ? Number(args[secondsArg + 1]) : 45) * 1000;

await rm(AUTH_DIR, { recursive: true, force: true });
await mkdir(AUTH_DIR, { recursive: true });

const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
const { version, isLatest } = await fetchLatestBaileysVersion();
console.log(`[probe] baileys version ${version.join('.')} isLatest=${isLatest}`);

const sock = makeWASocket({
  version,
  auth: { creds: state.creds, keys: state.keys },
  printQRInTerminal: false,
  browser: ['GataBot-MD', 'Edge', '20.0.04'],
  markOnlineOnConnect: false,
  syncFullHistory: false,
  defaultQueryTimeoutMs: undefined,
  keepAliveIntervalMs: 55000,
});

sock.ev.on('creds.update', saveCreds);

let qrSeen = false;

sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect, qr, isNewLogin } = update;
  console.log(
    `[probe] connection=${connection ?? '-'} qr=${qr ? `<${qr.length} chars>` : '-'} newLogin=${!!isNewLogin}`,
  );

  if (qr) {
    qrSeen = true;
    if (RAW_QR) console.log(qr);
    else console.log('[probe] QR payload received — pairing stage reached');
  }

  if (connection === 'close') {
    const err = lastDisconnect?.error;
    const reason = new Boom(err)?.output?.statusCode;
    console.log(`[probe] close reason=${reason} name=${err?.name ?? 'n/a'} message=${err?.message ?? 'n/a'}`);
    console.log(`[probe] ws socket present=${sock.ws?.socket != null}`);
  }
});

const deadline = setTimeout(async () => {
  console.log(`[probe] deadline ${DEADLINE_MS}ms reached; qrSeen=${qrSeen}`);
  await rm(AUTH_DIR, { recursive: true, force: true });
  process.exit(qrSeen ? 0 : 2);
}, DEADLINE_MS);

process.on('exit', () => clearTimeout(deadline));
