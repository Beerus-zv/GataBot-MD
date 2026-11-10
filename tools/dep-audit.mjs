// Audits every bare ESM/CJS specifier in the repo against node_modules.
// Built-in modules are skipped; anything unresolvable is reported once.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const root = process.cwd()
const require = createRequire(path.join(root, 'package.json'))
const skipDirs = new Set(['node_modules', '.git', 'tmp', 'GataBotSession', 'GataJadiBot', 'BackupSession', 'database', '.github'])
const files = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) files.push(full)
  }
}
walk(root)

const specRe = /(?:^|\n)\s*(?:import\s+(?:[^'"()]*?\s+from\s+)?|export\s+[^'"()]*?\s+from\s+|import\(\s*)['"]([^'"]+)['"]/g
const missing = new Map()

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  let m
  while ((m = specRe.exec(src)) !== null) {
    const spec = m[1]
    if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) continue
    const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
    if (require('module').builtinModules.includes(pkg)) continue
    try {
      require.resolve(pkg + '/package.json', { paths: [root] })
    } catch {
      try {
        require.resolve(spec, { paths: [root] })
      } catch {
        if (!missing.has(pkg)) missing.set(pkg, [])
        if (!missing.get(pkg).includes(path.relative(root, file))) missing.get(pkg).push(path.relative(root, file))
      }
    }
  }
}

console.log(`scanned ${files.length} files`)
if (missing.size === 0) {
  console.log('UNRESOLVED: none')
} else {
  for (const [pkg, where] of [...missing].sort()) {
    console.log(`UNRESOLVED ${pkg}  <- ${where.slice(0, 4).join(', ')}${where.length > 4 ? ` (+${where.length - 4})` : ''}`)
  }
}
