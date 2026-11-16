import axios from 'axios'
import fg from 'api-dylux'
import cheerio from 'cheerio'
import { Tiktok } from '../lib/tiktok.js'
import { tiktokLocal } from '../lib/social-local.js'
let handler = async (m, {conn, text, args, usedPrefix, command}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsTikTok2}\n*${usedPrefix + command} https://vm.tiktok.com/ZM6n8r8Dk/*`
if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) throw `${lenguajeGB['smsAvisoFG']()}${mid.smsTikTok3}`
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙋𝙍𝙊𝙉𝙏𝙊 𝙏𝙀𝙉𝘿𝙍𝘼 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 😸\n𝙎𝙊𝙊𝙉 𝙒𝙄𝙇𝙇 𝙃𝘼𝙑𝙀 𝙏𝙃𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙑𝙄𝘿𝙀𝙊 🥳`, fkontak, m)
// Cadena de proveedores en orden de fiabilidad medida. api.dorratz.com cobra
// (402) y devolvía el error antes que el vídeo, así que sale de la lista.
const proveedores = [
async () => { const d = await tiktokLocal(args[0]); return {video: d.video, caption: `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : ${d.title}`} },
async () => { const d = await Tiktok(args); return {video: d.nowm, caption: `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀\n${d.author}`} },
async () => { const d = await tiktokdlF(args[0]); return {video: d.video, caption: wm} },
async () => { const d = await fg.tiktok(args[0]); return {video: d.nowm, caption: wm} }
]

let entregado = false
for (const proveedor of proveedores) {
try {
const r = await proveedor()
if (!r?.video) throw new Error('sin enlace')
await conn.sendMessage(m.chat, {video: {url: r.video}, caption: r.caption}, {quoted: m})
entregado = true
break
} catch (e) {
console.log(`[tiktok] proveedor fallido: ${e?.message ?? e}`)
}
}
if (!entregado) m.react('❌')
}
handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = /^(tt|tiktok)(dl|nowm)?$/i
handler.limit = 2
export default handler

async function tiktokdlF(url) {
if (!/tiktok/.test(url)) return `*Ejemplo:* _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`
const gettoken = await axios.get('https://tikdown.org/id')
const $ = cheerio.load(gettoken.data)
const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value')
const param = {url: url, _token: token}
const {data} = await axios.request('https://tikdown.org/getAjax?', {
method: 'post',
data: new URLSearchParams(Object.entries(param)),
headers: {
'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
}
})
const getdata = cheerio.load(data.html)
if (data.status) {
return {
status: true,
thumbnail: getdata('img').attr('src'),
video: getdata('div.download-links > div:nth-child(1) > a').attr('href'),
audio: getdata('div.download-links > div:nth-child(2) > a').attr('href')
}
} else {
return {status: false}
}
}
