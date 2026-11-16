import fetch from 'node-fetch'
import yts from 'yt-search'
import { ytdlLocalAudio, ytdlLocalVideo } from '../lib/ytdl-local.js'

const LimitAud = 700 * 1024 * 1024 // 700MB
const LimitVid = 450 * 1024 * 1024 // 450MB

async function search(query, options = {}) {
const s = await yts.search({query, hl: 'es', gl: 'ES', ...options})
return s.videos
}

async function getFileSize(url) {
try {
const res = await fetch(url, {method: 'HEAD'})
return parseInt(res.headers.get('content-length') || 0)
} catch {
return 0
}
}

async function resolveYouTubeTarget(m, args, usedPrefix, command) {
const query = args.join(' ')
const yt_play = await search(query)
let youtubeLink = ''

if (args[0]?.includes('you')) {
youtubeLink = args[0]
} else {
const index = parseInt(args[0]) - 1
if (!isNaN(index)) {
if (index >= 0) {
if (Array.isArray(global.videoList) && global.videoList.length > 0) {
const matchingItem = global.videoList.find((it) => it.from === m.sender)
if (matchingItem) {
if (index < matchingItem.urls.length) youtubeLink = matchingItem.urls[index]
else throw `${lenguajeGB['smsAvisoFG']()} ${mid.smsYT} ${matchingItem.urls.length}*`
} else {
throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
}
}

const target = youtubeLink || yt_play?.[0]?.url
if (!target) throw new Error('No se encontró URL válida de YouTube.')
const title = yt_play?.[0]?.title || 'media'
const thumb = yt_play?.[0]?.thumbnail

return {target, title, thumb}
}

const handler = async (m, {conn, command, args, text, usedPrefix}) => {
if (!args || !args[0]) {
return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`, fkontak, m)
}

try {
const isAudioDoc = /^(playaudiodoc|ytmp3doc|playdoc|playdoc2)$/i.test(command)
const isVideoDoc = /^(playvideodoc|ytmp4doc)$/i.test(command)

const etiqueta = isAudioDoc ? '𝘼𝙐𝘿𝙄𝙊' : '𝙑𝙄𝘿𝙀𝙊'
await conn.reply(
m.chat,
`${lenguajeGB['smsAvisoEG']()}𝙋𝙍𝙊𝙉𝙏𝙊 𝙏𝙀𝙉𝘿𝙍𝘼 𝙎𝙐 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏𝙊 ${etiqueta}, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙎𝙊𝙊𝙉 𝙔𝙊𝙐 𝙒𝙄𝙇𝙇 𝙃𝘼𝙑𝙀 𝙔𝙊𝙐𝙍 ${etiqueta} 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏, 𝙋𝙇𝙀𝘼𝙎𝙀 𝙒𝘼𝙄𝙏`,
fkontak,
m
)

const {target, title, thumb} = await resolveYouTubeTarget(m, args, usedPrefix, command)

if (isAudioDoc) {
try {
const result = await ytdlLocalAudio(target)
const audioOut = result
const isDirect = typeof audioOut !== 'string'
const url = isDirect ? null : audioOut
const size = url ? await getFileSize(url) : 0

await conn.sendMessage(
m.chat,
{
document: isDirect ? audioOut : {url},
mimetype: 'audio/mpeg',
fileName: `${title}.mp3`,
contextInfo: thumb
? {
externalAdReply: {
title,
body: '',
thumbnailUrl: thumb,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
}
}
: {}
},
{quoted: m}
)
handler.limit = 1
return
} catch (e) {
console.log(`❌ Error ytmp3: ${e?.message || e}`)
throw e
}
}

if (isVideoDoc) {
try {
const data = await ytdlLocalVideo(target)
const out = typeof data === 'string' ? data : data?.url || data?.result || data?.downloadUrl || data?.dl || data

const isUrl = typeof out === 'string'
const size = isUrl ? await getFileSize(out) : 0
const caption = `╭━❰ ${wm} ❱━⬣
┃ 💜 ${mid.smsYT1}
┃ ${title}
╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`

await conn.sendMessage(
m.chat,
{
document: isUrl ? {url: out} : out,
fileName: `${title}.mp4`,
caption,
mimetype: 'video/mp4',
contextInfo: thumb
? {
externalAdReply: {
title,
body: '',
thumbnailUrl: thumb,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
}
}
: {}
},
{quoted: m}
)
handler.limit = 2
return
} catch (e) {
console.log(`❌ Error ytmp4: ${e?.message || e}`)
throw e
}
}

return conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = 0
}
}

handler.help = ['ytmp4doc', 'ytmp3doc', 'playaudiodoc', 'playvideodoc', 'playdoc', 'playdoc2'].map((v) => v + ' <búsqueda|link|#índice>')
handler.tags = ['downloader']
handler.command = /^(ytmp4doc|ytmp3doc|playaudiodoc|playdoc|playdoc2|playvideodoc)$/i
handler.register = true

export default handler
