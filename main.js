process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import './plugins/_content.js'
import { createRequire } from 'module'
import path, {join} from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, {
watchFile,
unwatchFile,
writeFileSync,
readdirSync,
statSync,
unlinkSync,
existsSync,
readFileSync,
copyFileSync,
watch,
rmSync,
mkdirSync,
rename
} from 'fs'
import * as fsPromises from 'fs/promises'
import { readdir, stat, unlink } from 'fs/promises'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { format } from 'util'
import pino from 'pino'
import Pino from 'pino'
import { Boom } from '@hapi/boom'
import os from 'os'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { JSONFile, Low } from 'lowdb'
import PQueue from 'p-queue'
import Datastore from '@seald-io/nedb'
import store from './lib/store.js'
import readline from 'readline'
import NodeCache from 'node-cache'
import { gataJadiBot } from './plugins/jadibot-serbot.js'
const {
makeInMemoryStore,
DisconnectReason,
useMultiFileAuthState,
MessageRetryMap,
fetchLatestBaileysVersion,
makeCacheableSignalKeyStore,
jidNormalizedUser
} = await import('@whiskeysockets/baileys')
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

async function flushLogs() {
await Promise.resolve()
await new Promise((r) => setTimeout(r, 0))
}
async function logCritical(msg) {
process.stdout.write(String(msg) + '\n')
await flushLogs()
}
async function logInfo(msg) {
console.log(msg)
await flushLogs()
}
async function logWarn(msg) {
console.warn(msg)
await flushLogs()
}
async function logError(msg) {
console.error(msg)
await flushLogs()
}

if (typeof global.atob !== 'function') {
global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary')
}

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? (/file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL) : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.timestamp = {start: new Date()}
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbPath = path.join(__dirname, 'database')
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)

const collections = {
users: new Datastore({
filename: path.join(dbPath, 'users.db'),
autoload: true
}),
chats: new Datastore({
filename: path.join(dbPath, 'chats.db'),
autoload: true
}),
settings: new Datastore({
filename: path.join(dbPath, 'settings.db'),
autoload: true
}),
msgs: new Datastore({
filename: path.join(dbPath, 'msgs.db'),
autoload: true
}),
sticker: new Datastore({
filename: path.join(dbPath, 'sticker.db'),
autoload: true
}),
stats: new Datastore({
filename: path.join(dbPath, 'stats.db'),
autoload: true
})
}
Object.values(collections).forEach((db) => {
db.setAutocompactionInterval(300000)
})

global.db = {
data: {
users: {},
chats: {},
settings: {},
msgs: {},
sticker: {},
stats: {}
}
}

function sanitizeId(id) {
return id.replace(/\./g, '_')
}
function unsanitizeId(id) {
return id.replace(/_/g, '.')
}
function sanitizeObject(obj) {
const sanitized = {}
for (const [key, value] of Object.entries(obj)) {
const sanitizedKey = key.replace(/\./g, '_')
sanitized[sanitizedKey] = typeof value === 'object' && value !== null ? sanitizeObject(value) : value
}
return sanitized
}
function unsanitizeObject(obj) {
const unsanitized = {}
for (const [key, value] of Object.entries(obj)) {
const unsanitizedKey = key.replace(/_/g, '.')
unsanitized[unsanitizedKey] = typeof value === 'object' && value !== null ? unsanitizeObject(value) : value
}
return unsanitized
}

global.db.readData = async function (category, id) {
  const memKey = id
  const diskKey = sanitizeId(id)
  if (!global.db.data[category][memKey]) {
    const data = await new Promise((resolve, reject) => {
      collections[category].findOne({ _id: diskKey }, (err, doc) => {
        if (err) return reject(err)
        resolve(doc ? unsanitizeObject(doc.data) : {})
      })
    })
    global.db.data[category][memKey] = data
  }
  return global.db.data[category][memKey]
}

global.db.writeData = async function (category, id, data) {
  const memKey = id
  const diskKey = sanitizeId(id)
  global.db.data[category][memKey] = {
    ...global.db.data[category][memKey],
    ...data // en memoria sin sanitizar
  }
  await new Promise((resolve, reject) => {
    collections[category].update(
      { _id: diskKey },
      { $set: { data: sanitizeObject(global.db.data[category][memKey]) } },
      { upsert: true },
      (err) => (err ? reject(err) : resolve())
    )
  })
}

global.db.loadDatabase = async function () {
const loadPromises = Object.keys(collections).map(async (category) => {
const docs = await new Promise((resolve, reject) => {
collections[category].find({}, (err, docs) => {
if (err) return reject(err)
resolve(docs)
})
})
const seenIds = new Set()
for (const doc of docs) {
const originalId = unsanitizeId(doc._id)
if (seenIds.has(originalId)) {
await new Promise((resolve, reject) => {
collections[category].remove({_id: doc._id}, {}, (err) => {
if (err) return reject(err)
resolve()
})
})
} else {
seenIds.add(originalId)
if (category === 'users' && (originalId.includes('@newsletter') || originalId.includes('lid'))) continue
if (category === 'chats' && originalId.includes('@newsletter')) continue
global.db.data[category][originalId] = unsanitizeObject(doc.data)
}
}
})
await Promise.all(loadPromises)
}

global.db.save = async function () {
const savePromises = []
for (const category of Object.keys(global.db.data)) {
for (const [id, data] of Object.entries(global.db.data[category])) {
if (Object.keys(data).length > 0) {
if (category === 'users' && (id.includes('@newsletter') || id.includes('lid'))) continue
if (category === 'chats' && id.includes('@newsletter')) continue
savePromises.push(
new Promise((resolve, reject) => {
collections[category].update({_id: sanitizeId(id)}, {$set: {data: sanitizeObject(data)}}, {upsert: true}, (err) => {
if (err) return reject(err)
resolve()
})
})
)
}
}
}
await Promise.all(savePromises)
}

global.db
.loadDatabase()
.then(() => {
console.log('Base de datos lista')
})
.catch((err) => {
console.error('Error cargando base de datos:', err)
})

async function gracefulShutdown() {
await global.db.save()
console.log('Guardando base de datos antes de cerrar...')
process.exit(0)
}
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

global.creds = 'creds.json'
global.authFile = 'GataBotSession'
global.authFileJB = 'GataJadiBot'
global.rutaBot = join(__dirname, global.authFile)
global.rutaJadiBot = join(__dirname, global.authFileJB)
const respaldoDir = join(__dirname, 'BackupSession')
const credsFile = join(global.rutaBot, global.creds)
const backupFile = join(respaldoDir, global.creds)

if (!fs.existsSync(global.rutaJadiBot)) fs.mkdirSync(global.rutaJadiBot)
if (!fs.existsSync(respaldoDir)) fs.mkdirSync(respaldoDir)

/**
 * A creds.json that exists but never finished pairing is worse than no creds at
 * all: baileys signs the handshake with a device identity WhatsApp never
 * confirmed, so the server answers 500 (badSession) then 401 (loggedOut) on an
 * endless reconnect loop and no QR is ever issued. An interrupted `npm run code`
 * is enough to leave one behind. Wipe only the unregistered case — a creds file
 * that says registered:true is a real device and must survive, even when the
 * server later rejects it.
 */
const credsSnapshot = (() => {
try {
return JSON.parse(readFileSync(credsFile, 'utf8'))
} catch {
return null
}
})()
if (existsSync(credsFile) && credsSnapshot?.registered !== true) {
rmSync(global.rutaBot, {recursive: true, force: true})
console.log(chalk.bold.yellowBright('[⚠] Sesión sin registrar detectada en ' + global.authFile + '; se reinicia el emparejamiento.'))
}

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.rutaBot)
const msgRetryCounterMap = new Map()
const msgRetryCounterCache = new NodeCache({stdTTL: 0, checkperiod: 0})
const userDevicesCache = new NodeCache({stdTTL: 0, checkperiod: 0})
const {version} = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumberCode
const methodCodeQR = process.argv.includes('qr')
const methodCode = !!phoneNumber || process.argv.includes('code')
const MethodMobile = process.argv.includes('mobile')
const isClusterWorker = typeof process.send === 'function'
const stdinLines = []
let stdinWaiter = null
if (isClusterWorker) {
process.on('message', (data) => {
if (typeof data !== 'string') return
const line = data.trim()
if (stdinWaiter) {
const resolve = stdinWaiter
stdinWaiter = null
resolve(line)
} else {
stdinLines.push(line)
}
})
}
let rl = isClusterWorker
? null
: readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: true
})

const question = (texto) => {
/**
 * Only one process may read a terminal. index.js (the cluster primary) owns
 * stdin and forwards each line over IPC, so this worker must not open a second
 * readline on the same fd — two readers split a paste between them and both end
 * up with fragments, which is why pasting the number did nothing.
 */
if (!isClusterWorker) {
return new Promise((resolver) => {
rl.question(texto, (respuesta) => resolver(String(respuesta ?? '').trim()))
})
}

process.stdout.write(texto)
return new Promise((resolver) => {
if (stdinLines.length) return resolver(stdinLines.shift())
stdinWaiter = resolver
})
}

/**
 * Pairing-by-code needed a pasted number, and pasting into a readline listener
 * that calls clearLine on every keystroke loses the buffer on Windows. Accept
 * the number from four places instead, in order of how little the user has to
 * do: --number, a bare positional argument, BOT_NUMBER, then config.js.
 */
const bootArgs = process.argv.slice(2)
const pairingNumberArg = (() => {
const inline = bootArgs.find((a) => /^--?number=/i.test(a))
if (inline) return inline.split('=').slice(1).join('=')
const flagIndex = bootArgs.findIndex((a) => /^--?(number|tel|phone)$/i.test(a))
if (flagIndex !== -1 && bootArgs[flagIndex + 1]) return bootArgs[flagIndex + 1]
return bootArgs.find((a) => !/^[-]{1,2}/.test(a) && !/^(qr|code|mobile|test|server)$/i.test(a) && /^\+?[\d\s().-]{8,}$/.test(a))
})()

const normalizeNumber = (value) => {
let digits = String(value ?? '').replace(/\D/g, '')
if (digits.startsWith('00')) digits = digits.slice(2)
// Mexican mobiles report as +521...; WhatsApp wants +52 and drops the extra 1.
if (digits.length === 13 && digits.startsWith('521')) digits = `52${digits.slice(3)}`
return digits
}

const looksLikePhone = (digits) => digits.length >= 8 && digits.length <= 15

async function resolvePairingNumber() {
const preset = normalizeNumber(pairingNumberArg ?? process.env.BOT_NUMBER ?? global.botNumberCode)
if (looksLikePhone(preset)) return preset

for (let attempt = 1; attempt <= 3; attempt++) {
const typed = normalizeNumber(await question(chalk.bgBlack(chalk.bold.greenBright(mid.phNumber2(chalk)))))
if (looksLikePhone(typed)) return typed
console.log(chalk.bold.redBright(`[⚠] Número inválido (${attempt}/3): usa solo dígitos, incluyendo el código de país.`))
}
return null
}

/**
 * requestPairingCode throws "Connection Closed" when the noise handshake has
 * not finished yet — the socket object exists the instant makeWASocket returns,
 * but its transport is not open. Wait for the transport, and retry if WhatsApp
 * drops it mid-request (it does when a QR refresh races the pairing).
 */
const socketOpen = () => {
const ws = global.conn?.ws
if (!ws) return false
if (typeof ws.isOpen === 'boolean') return ws.isOpen
const state = ws.socket?.readyState ?? ws.readyState
return state === 1
}

async function waitForSocket(timeoutMs = 25000) {
const deadline = Date.now() + timeoutMs
while (Date.now() < deadline) {
if (socketOpen()) return true
await new Promise((resolve) => setTimeout(resolve, 250))
}
return false
}

async function requestPairingWithRetry(number, attempts = 3) {
for (let attempt = 1; attempt <= attempts; attempt++) {
const ready = await waitForSocket()
if (!ready) {
console.log(chalk.bold.redBright(`[⚠] El socket no abrió (${attempt}/${attempts}).`))
continue
}
try {
let code = await global.conn.requestPairingCode(number)
code = code?.match(/.{1,4}/g)?.join('-') || code
pairingCodeIssued = true
console.log(chalk.bold.white(chalk.bgMagenta(mid.pairingCode)), chalk.bold.white(chalk.white(code)))
console.log(chalk.bold.cyanBright('[⏳] Ese código vence en ~60 s. En el teléfono: WhatsApp > Dispositivos vinculados > Vincular un dispositivo > Vincular con número de teléfono.'))
return code
} catch (error) {
const message = error?.message ?? String(error)
console.log(chalk.bold.yellowBright(`[⚠] Intento ${attempt}/${attempts}: ${message}`))
await new Promise((resolve) => setTimeout(resolve, 1500))
}
}
return null
}

/**
 * A pairing code lives about a minute. When it expires WhatsApp closes the
 * socket with 428 and baileys has already written creds.json, so the next
 * reconnect presents unconfirmed device keys and lands in the 401 loop — the
 * same dead end as a poisoned session, except it happens while the user is
 * still typing the code into their phone.
 *
 * The device keys are single-use, so the only way out is a brand new auth
 * state. The worker asks the cluster primary for 'reset', which restarts it
 * from scratch; main.js then wipes the unregistered session at boot and asks
 * for a fresh code. The marker file caps the cycle so a wrong number does not
 * spin forever.
 */
const PAIRING_MARKER = join(__dirname, '.pairing-attempts')
const PAIRING_MAX_CYCLES = 10
// WhatsApp invalidates a fresh code sooner when codes are requested back to
// back; spacing the retries keeps each one usable for its full window.
const PAIRING_COOLDOWN_MS = 15_000
let pairingNumber = null
let pairingRestarting = false
// A code only lives about a minute. Boot (330 plugins, handler, quick test) used
// to run between printing the code and the bot being usable, so the countdown
// was already half gone — or over — before the digits could be typed. The number
// is resolved early, the request itself is deferred to the end of boot.
let pairingPending = false
// Only a code that was actually delivered can "expire". A socket that closes
// during boot is a dropped connection, not a burnt code, and must not cost a
// cycle from the ten allowed.
let pairingCodeIssued = false

const readPairingCycles = () => {
try {
const cycles = Number(readFileSync(PAIRING_MARKER, 'utf8'))
return Number.isFinite(cycles) ? cycles : 0
} catch {
return 0
}
}

const restartPairing = (reason) => {
// A dying socket emits several close events; without this latch the cycle
// counter jumps by three or four for one expiry and the user burns through the
// allowance while typing a single code.
if (pairingRestarting) return
pairingRestarting = true

const cycles = readPairingCycles() + 1
try {
writeFileSync(PAIRING_MARKER, String(cycles))
} catch {}

if (cycles >= PAIRING_MAX_CYCLES) {
console.log(chalk.bold.redBright(`[⚠] ${cycles} códigos sin vincular. Revisa el número y vuelve a empezar con: npm run code -- +${pairingNumber}`))
return
}

console.log(chalk.bold.yellowBright(`[⚠] El código anterior venció (${reason}). Generando uno nuevo (${cycles}/${PAIRING_MAX_CYCLES})...`))
if (typeof process.send === 'function') {
process.send('reset')
} else {
process.exit(1)
}
}

let opcion
if (methodCodeQR) opcion = '1'
if (!methodCodeQR && !methodCode && !fs.existsSync(credsFile)) {
do {
let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
opcion = await question(
`╭${lineM}  \n┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}\n┊ ${chalk.blueBright('┊')} ${chalk.blue.bgBlue.bold.cyan(mid.methodCode1)}\n┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}   \n┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     \n┊ ${chalk.blueBright('┊')} ${chalk.green.bgMagenta.bold.yellow(mid.methodCode2)}\n┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  ${mid.methodCode3} 1:`)} ${chalk.greenBright(mid.methodCode4)}\n┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  ${mid.methodCode3} 2:`)} ${chalk.greenBright(mid.methodCode5)}\n┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}\n┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     \n┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta(mid.methodCode6)}\n┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta(mid.methodCode7)}\n┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} \n┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}    \n┊ ${chalk.blueBright('┊')} ${chalk.red.bgRed.bold.green(mid.methodCode8)}\n┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan(mid.methodCode9)}\n┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan(mid.methodCode10)}\n┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run qr ${chalk.italic.magenta(`(${mid.methodCode12})`)}`)}\n┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run code ${chalk.italic.magenta(`(${mid.methodCode13})`)}`)}\n┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm start ${chalk.italic.magenta(`(${mid.methodCode14})`)}`)}\n┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} \n╰${lineM}\n${chalk.bold.magentaBright('---> ')}`
)
if (!/^[1-2]$/.test(opcion)) console.log(chalk.bold.redBright(mid.methodCode11(chalk)))
} while ((opcion !== '1' && opcion !== '2') || fs.existsSync(credsFile))
}

const filterStrings = [
'Q2xvc2luZyBzdGFsZSBvcGVu', // "Closing stable open"
'Q2xvc2luZyBvcGVuIHNlc3Npb24=', // "Closing open session"
'RmFpbGVkIHRvIGRlY3J5cHQ=', // "Failed to decrypt"
'U2Vzc2lvbiBlcnJvcg==', // "Session error"
'RXJyb3I6IEJhZCBNQUM=', // "Error: Bad MAC"
'RGVjcnlwdGVkIG1lc3NhZ2U=' // "Decrypted message"
]

function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function () {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some((filterString) => message.includes(atob(filterString)))) {
return
}
return originalConsoleMethod.apply(console, arguments)
}
}
;['log', 'warn', 'error'].forEach((methodName) => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
logger: pino({level: process.env.WA_LOG_LEVEL || 'silent'}),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile,
browser: opcion == '1' ? ['GataBot-MD', 'Edge', '20.0.04'] : methodCodeQR ? ['GataBot-MD', 'Edge', '20.0.04'] : ['Ubuntu', 'Chrome', '20.0.04'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({level: 'fatal'}).child({level: 'fatal'}))
},
markOnlineOnConnect: false,
generateHighQualityLinkPreview: true,
syncFullHistory: false,
getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid)
let msg = await store.loadMessage(jid, key.id)
return msg?.message || ''
} catch (error) {
return ''
}
},
msgRetryCounterCache: msgRetryCounterCache || new Map(),
userDevicesCache: userDevicesCache || new Map(),
defaultQueryTimeoutMs: undefined,
cachedGroupMetadata: (jid) => global.conn?.chats?.[jid] ?? {},
version: version || [2, 3000, 1031793442],
keepAliveIntervalMs: 55000,
maxIdleTimeMs: 60000
}

global.conn = makeWASocket(connectionOptions)
attachConnectionHandler(global.conn)

if (!fs.existsSync(credsFile)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
const addNumber = await resolvePairingNumber()
if (!addNumber) {
console.log(chalk.bold.redBright('[⚠] Sin número no se puede generar el código de vinculación. Usa: npm run code -- +573001234567'))
} else {
if (rl) rl.close()
// Resolved now so a close event during boot is recognised as "pairing in
// progress" instead of "no session"; the code itself is requested once the
// bot has finished loading, further down.
pairingNumber = addNumber
pairingPending = true
}
}
}
}

conn.isInit = false
conn.well = false

if (!opts['test']) {
if (global.db)
setInterval(async () => {
if (global.db.data) await global.db.save()
if (opts['autocleartmp'] && (global.support || {}).find) {
}
}, 30 * 1000)
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT)

const backupCreds = async () => {
if (!fs.existsSync(credsFile)) {
console.log(await tr('[⚠] No se encontró el archivo creds.json para respaldar.'))
return
}
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const newBackup = join(respaldoDir, `creds-${timestamp}.json`)
fs.copyFileSync(credsFile, newBackup)
console.log(`[✅] Respaldo creado: ${newBackup}`)
const backups = fs
.readdirSync(respaldoDir)
.filter((file) => file.startsWith('creds-') && file.endsWith('.json'))
.sort((a, b) => fs.statSync(join(respaldoDir, a)).mtimeMs - fs.statSync(join(respaldoDir, b)).mtimeMs)
while (backups.length > 3) {
const oldest = backups.shift()
fs.unlinkSync(join(respaldoDir, oldest))
console.log(`[🗑️] Respaldo antiguo eliminado: ${oldest}`)
}
}

const restoreCreds = async () => {
const backups = fs
.readdirSync(respaldoDir)
.filter((file) => file.startsWith('creds-') && file.endsWith('.json'))
.sort((a, b) => fs.statSync(join(respaldoDir, b)).mtimeMs - fs.statSync(join(respaldoDir, a)).mtimeMs)
if (backups.length === 0) {
console.log('[⚠] No hay respaldos disponibles para restaurar.')
return
}
const latestBackup = join(respaldoDir, backups[0])
fs.copyFileSync(latestBackup, credsFile)
console.log(`[✅] Restaurado desde respaldo: ${backups[0]}`)
}

setInterval(
async () => {
await backupCreds()
console.log('[♻️] Respaldo periódico realizado.')
},
5 * 60 * 1000
)

let printingNoConn = false
/**
 * The QR/connection events start flowing the moment makeWASocket() returns,
 * long before reloadHandler() finishes loading plugins. Binding the handler
 * here means the first QR is not lost to the plugin scan.
 */
function attachConnectionHandler(target) {
if (target.connectionUpdate) target.ev.off('connection.update', target.connectionUpdate)
target.connectionUpdate = connectionUpdate.bind(target)
target.ev.on('connection.update', target.connectionUpdate)
}

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin, qr} = update
if (process.env.WA_DEBUG) {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
console.error('[conn]', JSON.stringify({connection, qr: qr ? qr.length : 0, reason, name: lastDisconnect?.error?.name, message: lastDisconnect?.error?.message, cwd: process.cwd(), creds: existsSync(credsFile)}))
}
global.stopped = connection
if (isNewLogin) conn.isInit = true

const activeReason = new Boom(lastDisconnect?.error)?.output?.statusCode

// A close while pairing means the code was never redeemed. The device keys in
// creds.json are single-use and already rejected, so reconnecting cannot work.
if (connection === 'close' && pairingNumber && pairingCodeIssued && !conn?.authState?.creds?.registered) {
restartPairing(activeReason ?? 'sin código')
return
}

if (connection === 'close' && !existsSync(credsFile) && !pairingPending) {
if (!printingNoConn) {
printingNoConn = true
await logCritical(chalk.bold.redBright('⚠️ SIN CONEXIÓN, BORRE LA CARPETA GataBotSession Y ESCANEA EL CÓDIGO QR ⚠️'))
setTimeout(() => {
printingNoConn = false
}, 1500)
}
}

const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error)
global.timestamp.connect = new Date()
}

if (global.db.data == null) loadDatabase()
if ((qr != 0 && qr != undefined) || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
console.log(chalk.bold.yellow(mid.mCodigoQR))
if (qr) {
// baileys 7 dropped printQRInTerminal; render the payload ourselves.
try {
const qrMod = await import('qrcode-terminal')
const qrcode = qrMod.default ?? qrMod
qrcode.generate(qr, {small: true})
} catch (e) {
console.log(chalk.dim(`[qr] ${qr}`))
}
}
}
}

if (connection == 'open') {
console.log(chalk.bold.greenBright(mid.mConexion))
// Linked: the pairing cycle counter starts fresh for the next device.
try {
rmSync(PAIRING_MARKER, {force: true})
} catch {}
pairingNumber = null
await joinChannels(conn)
}

let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionOFF']()))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(lenguajeGB['smsConexioncerrar']()))
await restoreCreds()
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(lenguajeGB['smsConexionperdida']()))
await restoreCreds()
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(chalk.bold.yellowBright(lenguajeGB['smsConexionreem']()))
} else if (reason === DisconnectReason.loggedOut) {
console.log(chalk.bold.redBright(lenguajeGB['smsConexionOFF']()))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.restartRequired) {
console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionreinicio']()))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.timedOut) {
console.log(chalk.bold.yellowBright(lenguajeGB['smsConexiontiem']()))
await global.reloadHandler(true).catch(console.error)
} else {
console.log(chalk.bold.redBright(lenguajeGB['smsConexiondescon'](reason, connection)))
}
}
}

process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
const safeOff = (ev, fn) => {
if (fn && typeof fn === 'function') conn.ev.off(ev, fn)
}
const safeOn = (ev, fn) => {
if (fn && typeof fn === 'function') conn.ev.on(ev, fn)
}

global.reloadHandler = async function (restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if (Handler && Object.keys(Handler).length) handler = Handler
} catch (e) {
console.error(e)
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch {}
conn.ev.removeAllListeners?.()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
attachConnectionHandler(global.conn)
isInit = true
}
if (!isInit) {
safeOff('messages.upsert', conn.handler)
safeOff('group-participants.update', conn.participantsUpdate)
safeOff('groups.update', conn.groupsUpdate)
safeOff('message.delete', conn.onDelete)
safeOff('call', conn.onCall)
safeOff('creds.update', conn.credsUpdate)
}

conn.welcome = lenguajeGB['smsWelcome']()
conn.bye = lenguajeGB['smsBye']()
conn.spromote = lenguajeGB['smsSpromote']()
conn.sdemote = lenguajeGB['smsSdemote']()
conn.sDesc = lenguajeGB['smsSdesc']()
conn.sSubject = lenguajeGB['smsSsubject']()
conn.sIcon = lenguajeGB['smsSicon']()
conn.sRevoke = lenguajeGB['smsSrevoke']()

conn.handler = handler.handler.bind(global.conn)
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
conn.onDelete = handler.deleteUpdate.bind(global.conn)
conn.onCall = handler.callUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)
safeOn('messages.upsert', conn.handler)
safeOn('group-participants.update', conn.participantsUpdate)
safeOn('groups.update', conn.groupsUpdate)
safeOn('message.delete', conn.onDelete)
safeOn('call', conn.onCall)
// connection.update is bound in attachConnectionHandler(), at socket creation.
safeOn('creds.update', conn.credsUpdate)
isInit = false
return true
}

if (global.gataJadibts) {
const readRutaJadiBot = fs.readdirSync(global.rutaJadiBot)
if (readRutaJadiBot.length > 0) {
const creds = 'creds.json'
for (const gjbts of readRutaJadiBot) {
const botPath = path.join(global.rutaJadiBot, gjbts)
if (fs.lstatSync(botPath).isDirectory()) {
const readBotPath = fs.readdirSync(botPath)
if (readBotPath.includes(creds)) {
gataJadiBot({
pathGataJadiBot: botPath,
m: null,
conn,
args: '',
usedPrefix: '/',
command: 'serbot'
})
}
}
}
}
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}
}
}
filesInit()
.then((_) => console.log(chalk.bold.cyanBright(`[plugins] ${Object.keys(global.plugins).length} cargados`)))
.catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` SE ACTULIZADO - '${filename}' CON ÉXITO`)
else {
conn.logger.warn(`SE ELIMINO UN ARCHIVO : '${filename}'`)
return delete global.plugins[filename]
}
} else conn.logger.info(`SE DETECTO UN NUEVO PLUGINS : '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true
})
if (err) conn.logger.error(`SE DETECTO UN ERROR DE SINTAXIS | SYNTAX ERROR WHILE LOADING '${filename}'\n${format(err)}`)
else {
try {
const module = await import(`${global.__filename(dir)}?update=${Date.now()}`)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(`HAY UN ERROR REQUIERE EL PLUGINS '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}
}
}
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
const procs = [
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version'])
]

const test = await Promise.all(
procs.map((p) =>
Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127)
})
}),
new Promise((resolve) => {
p.on('error', () => {
resolve(false)
})
})
])
)
)

const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
const s = (global.support = {
ffmpeg,
ffprobe,
ffmpegWebp,
convert,
magick,
gm,
find
})
Object.freeze(global.support)
}

function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
if (!existsSync(tmpDir)) return
const filenames = readdirSync(tmpDir)
filenames.forEach((file) => {
const filePath = join(tmpDir, file)
try {
unlinkSync(filePath)
} catch {}
})
}

async function purgeSession() {
const sessionDir = './GataBotSession'
try {
if (!existsSync(sessionDir)) return
const files = await readdir(sessionDir)
const preKeys = files.filter((file) => file.startsWith('pre-key-'))
const now = Date.now()
const oneHourAgo = now - 24 * 60 * 60 * 1000
for (const file of preKeys) {
const filePath = join(sessionDir, file)
const fileStats = await stat(filePath)
if (fileStats.mtimeMs < oneHourAgo) {
try {
await unlink(filePath)
console.log(chalk.green(`[🗑️] Pre-key antigua eliminada: ${file}`))
} catch {}
} else {
console.log(chalk.yellow(`[ℹ️] Manteniendo pre-key activa: ${file}`))
}
}
console.log(chalk.cyanBright(`[🔵] Sesiones no esenciales eliminadas de ${global.authFile}`))
} catch {}
}

async function purgeSessionSB() {
const jadibtsDir = './GataJadiBot/'
try {
if (!existsSync(jadibtsDir)) return
const directories = await readdir(jadibtsDir)
let SBprekey = []
const now = Date.now()
const oneDayAgo = now - 24 * 60 * 60 * 1000
for (const dir of directories) {
const dirPath = join(jadibtsDir, dir)
const statsDir = await stat(dirPath)
if (statsDir.isDirectory()) {
const files = await readdir(dirPath)
const preKeys = files.filter((file) => file.startsWith('pre-key-') && file !== 'creds.json')
SBprekey = [...SBprekey, ...preKeys]
for (const file of preKeys) {
const filePath = join(dirPath, file)
const fileStats = await stat(filePath)
if (fileStats.mtimeMs < oneDayAgo) {
try {
await unlink(filePath)
console.log(chalk.bold.green(`${lenguajeGB.smspurgeOldFiles1()} ${file} ${lenguajeGB.smspurgeOldFiles2()}`))
} catch {}
}
}
}
}
if (SBprekey.length === 0) console.log(chalk.bold.green(lenguajeGB.smspurgeSessionSB1()))
else console.log(chalk.cyanBright(`[🔵] Pre-keys antiguas eliminadas de sub-bots: ${SBprekey.length}`))
} catch (err) {
console.log(chalk.bold.red(lenguajeGB.smspurgeSessionSB3() + err))
}
}

async function purgeOldFiles() {
const directories = ['./GataBotSession/', './GataJadiBot/']
for (const dir of directories) {
try {
if (!fs.existsSync(dir)) {
console.log(chalk.yellow(`[⚠] Carpeta no existe: ${dir}`))
continue
}
const files = await fsPromises.readdir(dir)
for (const file of files) {
if (file !== 'creds.json') {
const filePath = join(dir, file)
try {
await fsPromises.unlink(filePath)
} catch {}
}
}
} catch {}
}
}

setInterval(
async () => {
if (global.stopped === 'close' || !conn || !conn.user) return
await clearTmp()
console.log(chalk.bold.cyanBright(lenguajeGB.smsClearTmp()))
},
1000 * 60 * 3
)

setInterval(
async () => {
if (global.stopped === 'close' || !conn || !conn.user) return
await purgeSessionSB()
await purgeSession()
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSession()))
//await purgeOldFiles()
//console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeOldFiles()))
},
1000 * 60 * 10
)

// End of boot: plugins, handler and quick test are all in. Only now does the
// clock on the pairing code start, so the whole minute belongs to the user.
if (pairingPending) {
pairingPending = false
if (readPairingCycles() > 0) await new Promise((resolve) => setTimeout(resolve, PAIRING_COOLDOWN_MS))
const codeBot = await requestPairingWithRetry(pairingNumber)
if (!codeBot) {
console.log(chalk.bold.redBright(`[⚠] WhatsApp cerró la conexión antes de entregar el código. Reintenta con: npm run code -- +${pairingNumber}`))
}
}

_quickTest()
.then(() => conn.logger.info(chalk.bold(lenguajeGB['smsCargando']().trim())))
.catch(console.error)

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.bold.greenBright(lenguajeGB['smsMainBot']().trim()))
import(`${file}?update=${Date.now()}`)
})

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}
}
