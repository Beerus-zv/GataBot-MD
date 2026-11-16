import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
let MessageType = await import(global.baileys)
let handler = async (m, {conn}) => {
try {
if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
if (!m.mentionedJid.length) m.mentionedJid.push(m.sender)
// api.waifu.pics ya no resuelve (ENOTFOUND). purrbot v2 y nekos.best
// contestan sin clave; nekos.best exige un User-Agent identificable.
let url = null
try {
const res = await fetch('https://api.purrbot.site/v2/img/sfw/pat/gif')
const json = await res.json()
if (json?.link) url = json.link
} catch (e) {
console.log(`[pat] purrbot: ${e?.message ?? e}`)
}
if (!url) {
try {
const res = await fetch('https://nekos.best/api/v2/pat', {headers: {'user-agent': 'GataBot-MD/1.0 (https://github.com/Beerus-zv/GataBot-MD)'}})
const json = await res.json()
if (json?.results?.[0]?.url) url = json.results[0].url
} catch (e) {
console.log(`[pat] nekos.best: ${e?.message ?? e}`)
}
}
if (!url) url = global.img
let stiker = await sticker(
null,
url,
`+${m.sender.split('@')[0]} le dio palmaditas a ${m.mentionedJid.map((user) => (user === m.sender ? 'alguien ' : `+${user.split('@')[0]}`)).join(', ')}`
)
conn.sendFile(m.chat, stiker, null, {asSticker: true})
} catch (e) {}
}
handler.command = /^(pat|palmaditas|cariños|mimos|patt)$/i
export default handler
