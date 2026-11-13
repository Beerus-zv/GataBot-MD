#!/usr/bin/env node
/**
 * Feeds a command through the real handler.js with a stub socket, so a silent
 * ".menu" can be traced without a phone. Replies are captured instead of sent.
 *
 * Usage: node tools/probe-command.mjs .menu
 */
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { EventEmitter } from 'events'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const toUrl = (p) => pathToFileURL(p).toString()

global.__filename = (p, rmPrefix = true) => (rmPrefix ? p : p)
global.__dirname = (p) => dirname(p)
global.opts = {}

await import(toUrl(join(root, 'config.js')))
const { default: protoHolder } = await import(toUrl(join(root, 'lib', 'simple.js')))

const text = process.argv[2] || '.menu'
const botJid = '573000000000@s.whatsapp.net'
const userJid = '573000000001@s.whatsapp.net'

const chatStore = {}
const captured = []

const conn = {
  user: {id: botJid, jid: botJid, name: 'Probe'},
  ev: new EventEmitter(),
  chats: chatStore,
  prefix: '.',
  decodeJid: (j) => (j ? String(j).replace(/:\d+/, '') : j),
  pushMessage: async () => {},
  getName: (jid) => String(jid).split('@')[0],
  readMessages: async () => {},
  sendPresenceUpdate: async () => {},
  profilePictureUrl: async () => 'https://example.invalid/pp.jpg',
  parseMention: async () => [],
  groupMetadata: async () => ({participants: []}),
  onWhatsApp: async () => [{exists: false}],
  sendMessage: async (chat, content) => {
    captured.push({chat, content})
    return {key: {id: 'probe'}}
  },
  reply: async (chat, content) => {
    captured.push({chat, content})
    return {key: {id: 'probe'}}
  },
  sendFile: async (chat, file, filename, caption, quoted, ...rest) => {
    captured.push({chat, content: String(caption ?? ''), file})
    return {key: {id: 'probe'}}
  },
  sendButton: async () => ({key: {id: 'probe'}}),
  sendPresenceUpdate: async () => {},
  updateProfilePicture: async () => {},
  logger: {info: () => {}, warn: () => {}, error: () => {}},
  ws: {isOpen: true}
}
global.conn = conn

const now = Math.floor(Date.now() / 1000)
global.db = {
  data: {
    users: {
      [userJid]: {
        exp: 0, money: 150, limit: 15, level: 1, role: 'NOVATO', registered: false,
        premium: false, premiumTime: 0, spam: 0, antispam: 0, banned: false,
        warn: 0, afk: -1, mesagge: 0, reporte: 0, joincount: 1, name: 'Probe'
      }
    },
    chats: {
      [userJid]: {isBanned: false, modoadmin: false, sWelcome: '', sBye: '', sPromote: '', sDemote: '', antilink: false, autolevelup: false},
      [botJid]: {}
    },
    settings: {
      [botJid]: {self: false, restrict: false, prefix: '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@', antiCall: false}
    },
    stats: {},
    sticker: {}
  },
  write: async () => {},
  read: async () => {}
}
global.loadDatabase = async () => {}
global.multiplier = 1
global.ig = 'probe'
global.asistencia = 'probe'
global.APIs = {}
global.API = (u) => u
global.getBuffer = async () => Buffer.alloc(0)

// main.js loads the plugins before importing nothing in particular; the handler
// expects them in global.plugins. Mirror filesInit() here.
const { readdirSync } = await import('fs')
global.plugins = {}
for (const file of readdirSync(join(root, 'plugins')).filter((f) => f.endsWith('.js'))) {
  try {
    const mod = await import(toUrl(join(root, 'plugins', file)))
    global.plugins[file] = mod.default || mod
  } catch (error) {
    if (process.env.WA_DEBUG || process.env.HANDLER_DEBUG) console.error(`[probe] plugin ${file} failed: ${error?.message ?? error}`)
  }
}
console.log(`[probe] plugins loaded: ${Object.keys(global.plugins).length}`)
if (process.env.HANDLER_DEBUG) {
  const content = global.plugins['_content.js']
  console.error(`[probe] _content.js present=${Boolean(content)} before=${typeof content?.before}`)
  console.error(`[probe] order around menu: ${Object.keys(global.plugins).slice(0, 3).join(',')} ... ${Object.keys(global.plugins).indexOf('_content.js')} vs ${Object.keys(global.plugins).indexOf('menu-lista.js')}`)
}

const { proto } = await import('@whiskeysockets/baileys')
const raw = proto.WebMessageInfo.fromObject({
  key: {remoteJid: userJid, fromMe: false, id: 'PROBE' + Date.now(), participant: userJid},
  message: {conversation: text},
  messageTimestamp: now,
  pushName: 'Probe'
})

const handlerModule = await import(toUrl(join(root, 'handler.js')))
const { serialize, protoType } = await import(toUrl(join(root, 'lib', 'simple.js')))
protoType()
serialize()

const chatUpdate = {messages: [raw], type: 'notify'}
const started = Date.now()
try {
  await handlerModule.handler.call(conn, chatUpdate)
  console.log(`[probe] handler returned in ${Date.now() - started}ms without throwing`)
} catch (error) {
  console.log(`[probe] handler THREW: ${error?.stack ?? error}`)
}

console.log(`[probe] replies captured: ${captured.length}`)
for (const [i, entry] of captured.entries()) {
  const body = typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content)
  console.log(`[probe] #${i} chat=${entry.chat} len=${body.length} head=${JSON.stringify(body.slice(0, 120))}`)
}

process.exit(captured.length ? 0 : 1)
