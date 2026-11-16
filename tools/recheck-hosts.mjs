/**
 * Re-verifica con GET y User-Agent de navegador los hosts que el primer barrido
 * marcó como muertos. El barrido inicial usaba HEAD, y varios CDN contestan 403
 * o 405 a HEAD sin UA aunque sirvan el archivo por GET: eso es un falso positivo
 * que no hay que "arreglar" tocando el plugin.
 *
 * Uso: node tools/recheck-hosts.mjs [host ...]
 */
import { readFileSync, writeFileSync } from 'fs'
import { lookup } from 'dns/promises'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

const report = JSON.parse(readFileSync(new URL('./audit-hosts.report.json', import.meta.url), 'utf8'))
const rows = Array.isArray(report) ? report : report.hosts
const pedidos = process.argv.slice(2)
const objetivo = pedidos.length
  ? rows.filter((r) => pedidos.some((p) => r.host.includes(p)))
  : rows.filter((r) => r.verdict !== 'alive').sort((a, b) => b.urls - a.urls).slice(0, 30)

const dnsOk = async (host) => {
  try {
    await lookup(host)
    return true
  } catch {
    return false
  }
}

const getOk = async (url) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {'user-agent': UA, accept: 'image/avif,image/webp,*/*'},
      signal: AbortSignal.timeout(20_000)
    })
    const type = res.headers.get('content-type') || ''
    const len = res.headers.get('content-length') || ''
    // Leer unos bytes confirma que el cuerpo llega, no solo la cabecera.
    const buf = await res.arrayBuffer()
    return {status: res.status, type, len, bytes: buf.byteLength}
  } catch (error) {
    return {error: error?.cause?.code || error?.name || 'error'}
  }
}

const salida = []
for (const row of objetivo) {
  const dns = await dnsOk(row.host)
  const sample = (row.sample || '').startsWith('http') ? row.sample : `https://${row.host}/`
  const res = dns ? await getOk(sample) : {error: 'ENOTFOUND'}
  const alive = dns && res.status && res.status < 400 && res.bytes > 0
  salida.push({host: row.host, urls: row.urls, dns, get: res, alive})
  console.log(
    `${alive ? 'ALIVE' : 'DEAD '} ${String(row.urls).padStart(5)} ${row.host.padEnd(34)} dns=${dns ? 'ok' : 'no'} ${res.status || res.error} ${res.bytes || 0}B ${res.type ? res.type.slice(0, 24) : ''}`
  )
}

const destino = new URL('./recheck-hosts.report.json', import.meta.url)
writeFileSync(destino, JSON.stringify(salida, null, 2))
const vivas = salida.filter((s) => s.alive).length
console.log(`\n${salida.length} hosts revisados: ${vivas} vivos por GET, ${salida.length - vivas} muertos de verdad`)
