#!/usr/bin/env node
/**
 * Mide qué proveedor de descargas responde hoy.
 *
 * El bot encadena varias APIs para .play / .ytmp3 / .ytmp4, pero el orden se
 * escribió cuando todas vivían. Este script llama a los mismos endpoints que el
 * código con una URL de vídeo fija y reporta estado + forma de la respuesta, para
 * poder ordenar la cadena por lo que funciona y no por costumbre.
 *
 * Uso: node tools/audit-download-apis.mjs [--json]
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const AS_JSON = process.argv.includes('--json')
const VIDEO = 'https://youtu.be/dQw4w9WgXcQ'
const TIMEOUT = 25_000

const ENDPOINTS = [
  {name: 'stellar ytmp3', url: `https://api.stellarwa.xyz/dow/ytmp3?url=${VIDEO}&key=GataDios`, pick: (j) => j?.data?.url || j?.url},
  {name: 'stellar ytmp4', url: `https://api.stellarwa.xyz/dow/ytmp4?url=${VIDEO}&key=GataDios`, pick: (j) => j?.data?.url || j?.url},
  {name: 'neoxr youtube', url: `https://api.neoxr.eu/api/youtube?url=${VIDEO}&type=audio&quality=128kbps&apikey=GataDios`, pick: (j) => j?.data?.url || j?.url},
  {name: 'siputzx ytmp3', url: `https://api.siputzx.my.id/api/d/ytmp3?url=${VIDEO}`, pick: (j) => j?.data?.url || j?.data?.dl || j?.url},
  {name: 'siputzx ytmp4', url: `https://api.siputzx.my.id/api/d/ytmp4?url=${VIDEO}`, pick: (j) => j?.data?.url || j?.data?.dl || j?.url},
  {name: 'zenkey ytmp3', url: `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${VIDEO}`, pick: (j) => j?.result?.url || j?.data?.url || j?.url},
  {name: 'vreden ytmp3', url: `https://api.vreden.web.id/api/ytmp3?url=${VIDEO}`, pick: (j) => j?.result?.url || j?.data?.url || j?.url},
  {name: 'ryzendesu ytmp3', url: `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${VIDEO}`, pick: (j) => j?.result?.url || j?.data?.url || j?.url},
  {name: 'alyachan ytmp3', url: `https://api.alyachan.dev/api/ytmp3?url=${VIDEO}`, pick: (j) => j?.data?.url || j?.result?.url || j?.url},
  {name: 'skizo ytmp3', url: `https://skizo.tech/api/ytmp3?url=${VIDEO}&apikey=GataDios`, pick: (j) => j?.result?.url || j?.data?.url || j?.url},
  {name: 'delirius ytmp3', url: `https://api.delirius.store/download/ytmp3?url=${VIDEO}`, pick: (j) => j?.data?.url || j?.result?.url || j?.url},
  {name: 'dorratz ytmp3', url: `https://api.dorratz.com/v2/yt-mp3?url=${VIDEO}`, pick: (j) => j?.data?.url || j?.url},
  {name: 'lolhuman ytmp3', url: `https://api.lolhuman.xyz/api/ytmp3?apikey=GataDiosV3&url=${VIDEO}`, pick: (j) => j?.result?.link || j?.result?.url || j?.result},
  {name: 'fgmods ytmp3', url: `https://api.fgmods.xyz/api/downloader/ytmp3?url=${VIDEO}&apikey=elrebelde21`, pick: (j) => j?.data?.url || j?.result?.url || j?.url}
]

const results = []
for (const endpoint of ENDPOINTS) {
  const started = Date.now()
  try {
    const response = await fetch(endpoint.url, {
      headers: {'user-agent': 'GataBot-Audit/1.0'},
      signal: AbortSignal.timeout(TIMEOUT)
    })
    const text = (await response.text()).slice(0, 4000)
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      /* respuesta no JSON: se reporta el estado y el prefijo */
    }
    const picked = json ? endpoint.pick(json) : undefined
    const ok = response.ok && Boolean(picked)
    results.push({
      name: endpoint.name,
      status: response.status,
      ms: Date.now() - started,
      ok,
      link: typeof picked === 'string' ? picked.slice(0, 90) : undefined,
      keys: json && typeof json === 'object' ? Object.keys(json).slice(0, 8) : undefined,
      head: json ? undefined : text.slice(0, 90)
    })
  } catch (error) {
    results.push({name: endpoint.name, status: 0, ms: Date.now() - started, ok: false, error: error?.name ?? 'error'})
  }
  const last = results.at(-1)
  if (!AS_JSON) {
    console.log(
      `[dl] ${last.ok ? 'OK   ' : 'FAIL'} ${last.name.padEnd(16)} ${String(last.status).padStart(3)} ${String(last.ms).padStart(6)}ms ` +
        (last.ok ? last.link : last.error || last.head || JSON.stringify(last.keys ?? ''))
    )
  }
}

const report = join(ROOT, 'tools', 'audit-download-apis.report.json')
writeFileSync(report, JSON.stringify(results, null, 2))
if (AS_JSON) console.log(JSON.stringify(results, null, 2))
else {
  const alive = results.filter((r) => r.ok)
  console.log(`\n[dl] ${alive.length}/${results.length} responden con enlace`)
  if (alive.length) console.log(`[dl] orden recomendado: ${alive.map((r) => r.name).join(' → ')}`)
}
process.exit(results.some((r) => r.ok) ? 0 : 1)
