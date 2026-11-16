/**
 * Cruza las claves que usan los plugins (APIs.<clave> / global.APIs.<clave>)
 * contra las que define config.js. Una clave inexistente no falla al cargar:
 * se convierte en "undefined" dentro de la URL y el comando muere en el fetch,
 * así que hay que verlo por escrito.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const raiz = process.cwd()
const config = readFileSync(join(raiz, 'config.js'), 'utf8')
const bloque = (config.match(/global\.APIs = \{([\s\S]*?)\n\}/) || [, ''])[1]
const definidas = new Set([...bloque.matchAll(/^\s*([a-zA-Z0-9_]+)\s*:/gm)].map((m) => m[1]))

const archivos = []
const recorrer = (dir) => {
  for (const entrada of readdirSync(dir)) {
    if (entrada === 'node_modules' || entrada === '.git') continue
    const ruta = join(dir, entrada)
    const st = statSync(ruta)
    if (st.isDirectory()) recorrer(ruta)
    else if (entrada.endsWith('.js')) archivos.push(ruta)
  }
}
recorrer(join(raiz, 'plugins'))
recorrer(join(raiz, 'lib'))

const usos = new Map()
for (const archivo of archivos) {
  const texto = readFileSync(archivo, 'utf8')
  for (const m of texto.matchAll(/(?:global\.)?APIs\.([a-zA-Z0-9_]+)/g)) {
    const clave = m[1]
    if (!usos.has(clave)) usos.set(clave, new Map())
    const rel = archivo.replace(raiz + '\\', '').replace(raiz + '/', '')
    usos.get(clave).set(rel, (usos.get(clave).get(rel) || 0) + 1)
  }
}

console.log('claves definidas en config.js:', [...definidas].join(', '))
const faltantes = [...usos.entries()].filter(([k]) => !definidas.has(k)).sort((a, b) => b[1].size - a[1].size)
console.log('\nclaves usadas que NO existen (' + faltantes.length + '):')
for (const [clave, porArchivo] of faltantes) {
  const total = [...porArchivo.values()].reduce((a, b) => a + b, 0)
  console.log(`  ${clave.padEnd(18)} ${String(total).padStart(3)} usos en ${[...porArchivo.keys()].slice(0, 3).join(', ')}`)
}

const sinUsar = [...definidas].filter((k) => !usos.has(k))
console.log('\ndefinidas sin uso:', sinUsar.join(', ') || '(ninguna)')
