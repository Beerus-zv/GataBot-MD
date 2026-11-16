import fg from 'api-dylux'
import fetch from 'node-fetch'
import { facebookdl } from '../lib/facebookscraper.js'
//import fbDownloader from 'fb-downloader-scrapper';
//import { facebook } from '@xct007/frieren-scraper';
import axios from 'axios'
const handler = async (m, {conn, args, command, usedPrefix}) => {
let user = global.db.data.users[m.sender]
if (!args[0])
return conn.reply(
m.chat,
`${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://www.facebook.com/watch?v=636541475139*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://fb.watch/dcXq_0CaHi/*`,
fkontak,
m
)
if (!args[0].match(/www.facebook.com|fb.watch/g))
return conn.reply(
m.chat,
`${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://www.facebook.com/watch?v=636541475139*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://fb.watch/dcXq_0CaHi/*`,
fkontak,
m
)
let contenido = `✅ 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆\n${wm}`
await m.react('⏱️')
// Cadena de proveedores en el orden que responde hoy: api.dorratz.com cobra
// (402) y api.agatz.xyz no resuelve, así que ambos salieron.
const proveedores = [
async () => {
const r = await fetch(`${global.APIs.neoxr.url}/fb?url=${encodeURIComponent(args[0])}&apikey=${global.APIs.neoxr.key}`)
const json = await r.json()
if (!json?.status || !Array.isArray(json.data)) throw new Error('neoxr sin datos')
const hd = json.data.find((v) => v.quality === 'HD')?.url
const sd = json.data.find((v) => v.quality === 'SD')?.url
const url = hd || sd
if (!url) throw new Error('neoxr sin enlace')
return {url, quality: hd ? '720p (HD)' : '360p (SD)'}
},
async () => {
const r = await fg.fbdl(args[0])
const url = r?.data?.[0]?.url
if (!url) throw new Error('api-dylux sin enlace')
return {url, quality: ''}
},
async () => {
const r = await facebookdl(args[0])
const {video} = await r
let elegido = null
for (const v of video) {
if (v.quality === '720p (HD)') { elegido = v; break }
if (!elegido) elegido = v
}
const url = elegido ? await elegido.download() : null
if (!url) throw new Error('scraper sin enlace')
return {url, quality: elegido.quality || ''}
},
async () => {
const r = await fetch(`${apis}/download/facebook?url=${encodeURIComponent(args[0])}`)
const json = await r.json()
const url = json?.urls?.[0]?.hd || json?.urls?.[0]?.sd
if (!url) throw new Error('delirius sin enlace')
return {url, quality: ''}
}
]

let entregado = false
for (const proveedor of proveedores) {
try {
const r = await proveedor()
await conn.sendFile(m.chat, r.url, 'video.mp4', r.quality ? `Resolución: ${r.quality}` : contenido, m)
await m.react('✅')
entregado = true
break
} catch (e) {
console.log(`[facebook] proveedor fallido: ${e?.message ?? e}`)
}
}
if (!entregado) await m.react('❌')
}

handler.command = /^(facebook|fb|facebookdl|fbdl|facebook1|fb1|facebookdl1|fbdl1|facebook2|fb2|facebookdl2|fbdl2)$/i
handler.limit = 3
export default handler

async function igeh(url_media) {
return new Promise(async (resolve, reject) => {
const BASE_URL = 'https://instasupersave.com/'
try {
const resp = await axios(BASE_URL)
const cookie = resp.headers['set-cookie'] // obtener cookie de la solicitud
const session = cookie[0].split(';')[0].replace('XSRF-TOKEN=', '').replace('%3D', '')
const config = {
method: 'post',
url: `${BASE_URL}api/convert`,
headers: {
origin: 'https://instasupersave.com',
referer: 'https://instasupersave.com/pt/',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-origin',
'user-agent':
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.52',
'x-xsrf-token': session,
'Content-Type': 'application/json',
Cookie: `XSRF-TOKEN=${session}; instasupersave_session=${session}`
},
data: {url: url_media}
}
axios(config)
.then(function (response) {
const ig = []
if (Array.isArray(response.data)) {
response.data.forEach((post) => {
ig.push(post.sd === undefined ? post.thumb : post.sd.url)
})
} else {
ig.push(response.data.url[0].url)
}
resolve({results_number: ig.length, url_list: ig})
})
.catch(function (error) {
reject(error.message)
})
} catch (e) {
reject(e.message)
}
})
}
