#!/usr/bin/env node
/**
 * Prueba los hosts externos que el bot llama de verdad.
 *
 * No basta con contar referencias: una URL de imagen puede ser solo un ejemplo
 * dentro de un array de respaldo y no romper nada. Lo que rompe un comando es
 * que su endpoint principal devuelva 4xx/5xx o no resuelva, así que aquí se
 * prueban las URLs reales tal como están escritas en el código y se agrupan por
 * host para que el veredicto sea por servicio, no por línea.
 *
 * Uso:  node tools/audit-hosts.mjs [--limit N] [--json]
 * Exit: 0 cuando ningún host probado está muerto, 1 si alguno lo está.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const LIMIT = Number(process.argv[process.argv.indexOf('--limit') + 1]) || 3
const AS_JSON = process.argv.includes('--json')
const TIMEOUT_MS = 12_000

// Hosts de documentación, ejemplos y assets propios: no son dependencias.
const SKIP = new Set([
  'github.com', 'raw.githubusercontent.com', 'wa.me', 'whatsapp.com', 'chat.whatsapp.com',
  'youtu.be', 'youtube.com', 'i.imgur.com', 'files.catbox.moe', 'example.com',
  'localhost', '127.0.0.1', 'discord.gg', 'discord.com', 'npmjs.com', 'nodejs.org',
])

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, out)
    else if (entry.endsWith('.js')) out.push(full)
  }
  return out
}

const files = [...walk(join(ROOT, 'plugins')), ...walk(join(ROOT, 'lib'))]
const byHost = new Map()

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(/https?:\/\/[^\s'"`)\\,;]+/g)) {
    const raw = match[0]
    const url = raw.replace(/[.,;:]+$/, '')
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      continue
    }
    const host = parsed.hostname.toLowerCase()
    if (SKIP.has(host)) continue
    if (!byHost.has(host)) byHost.set(host, {host, urls: new Set(), files: new Set()})
    const entry = byHost.get(host)
    entry.urls.add(url)
    entry.files.add(basename(file))
  }
}

const probe = async (url) => {
  const started = Date.now()
  try {
    // Algunos CDNs rechazan HEAD; GET con Range evita bajar el cuerpo entero.
    const response = await fetch(url, {
      method: 'GET',
      headers: {'range': 'bytes=0-0', 'user-agent': 'GataBot-Audit/1.0'},
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: 'follow',
    })
    return {status: response.status, ms: Date.now() - started, ok: response.status < 400}
  } catch (error) {
    return {status: 0, ms: Date.now() - started, ok: false, error: error?.name ?? 'error'}
  }
}

const hosts = [...byHost.values()].sort((a, b) => b.urls.size - a.urls.size)
const results = []

for (const entry of hosts) {
  const sample = [...entry.urls].slice(0, LIMIT)
  const probes = []
  for (const url of sample) probes.push({url, ...(await probe(url))})
  const alive = probes.filter((p) => p.ok).length
  const verdict = alive === 0 ? 'dead' : alive === probes.length ? 'alive' : 'partial'
  results.push({
    host: entry.host,
    urls: entry.urls.size,
    probed: probes.length,
    verdict,
    statuses: probes.map((p) => p.status || p.error),
    sample: sample[0],
    files: [...entry.files].slice(0, 6),
  })
  const mark = verdict === 'alive' ? 'OK   ' : verdict === 'partial' ? 'PART ' : 'DEAD '
  if (!AS_JSON) {
    console.log(`[hosts] ${mark} ${entry.host.padEnd(30)} ${String(entry.urls.size).padStart(5)} refs  ${probes.map((p) => p.status || p.error).join(',')}`)
  }
}

const dead = results.filter((r) => r.verdict === 'dead')
const partial = results.filter((r) => r.verdict === 'partial')
const report = join(ROOT, 'tools', 'audit-hosts.report.json')
writeFileSync(report, JSON.stringify(results, null, 2))
if (AS_JSON) console.log(JSON.stringify(results, null, 2))
else console.log(`\n[hosts] ${results.length} hosts · ${results.length - dead.length - partial.length} vivos · ${partial.length} parciales · ${dead.length} muertos\n[hosts] reporte: ${report}`)

process.exit(dead.length ? 1 : 0)
