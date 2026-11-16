/* -------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */
/*                                                       */
/*       |- [ ⚠ ] - CREDITOS DEL CODIGO - [ ⚠ ] -|      */
/*     —◉ DESAROLLADO POR OTOSAKA:                       */
/*     ◉ Otosaka (https://github.com/6otosaka9)          */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ BrunoSobrino (https://github.com/BrunoSobrino)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/* -------------------------------------------------------*/
/**
 * La cadena de respaldo original encadenaba nueve servicios:
 * api-fgmods.ddns.net (ENOTFOUND), vihangayt.me x3 (ENOTFOUND),
 * api.lolhuman.xyz (clave rechazada), api.ibeng.tech (ENOTFOUND) y
 * api.akuari.my.id x2 (503). Ninguno contestaba, así que sin una clave de
 * OpenAI propia el comando siempre terminaba en el mensaje de error.
 *
 * Quedan dos caminos: OpenAI si hay clave configurada, y text.pollinations.ai
 * (texto plano, sin clave) como respaldo real.
 */
import fetch from 'node-fetch'
import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const idioma = 'es'
const sistema1 = 'Actuaras como un Bot de WhatsApp el cual fue creado por GataNina-Li, tu seras GataBot-MD'

const handler = async (m, {conn, text, usedPrefix, command}) => {
if (usedPrefix == 'a' || usedPrefix == 'A') return
if (!text)
throw `*${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉𝘼 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉 𝙊 𝙐𝙉𝘼 𝙊𝙍𝘿𝙀𝙉 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝘾𝙃𝘼𝙏𝙂𝙋𝙏\n\n❏ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝘿𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎 𝙔 𝙊𝙍𝘿𝙀𝙉𝙀𝙎\n❏ ${usedPrefix + command} Recomienda un top 10 de películas de acción\n❏ ${usedPrefix + command} Codigo en JS para un juego de cartas`
conn.sendPresenceUpdate('recording', m.chat)
const respuesta = await responder(text, m)
const audio = await tts(respuesta, idioma)
await conn.sendMessage(m.chat, {audio, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true}, {quoted: m})
}
handler.command = /^(openaivoz|chatgptvoz|iavoz|aivoice|robotvoz|openai2voz|chatgpt2voz|ia2voz|robot2voz)$/i
export default handler

async function responder(texto, m) {
// 1. OpenAI, sólo si el dueño del bot configuró una clave.
if (global.openai_key) {
try {
const historial = global.chatgpt?.data?.users?.[m.sender]
if (historial) historial.push({role: 'user', content: texto})
const messages = historial?.length ? historial : [{role: 'user', content: texto}]
const res = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {'Content-Type': 'application/json', Authorization: `Bearer ${global.openai_key}`},
body: JSON.stringify({model: 'gpt-3.5-turbo', messages: [{role: 'system', content: sistema1}, ...messages]})
})
const json = await res.json()
const salida = json?.choices?.[0]?.message?.content?.trim()
if (salida) return salida
console.log(`[voz] openai sin contenido: ${json?.error?.message ?? res.status}`)
} catch (e) {
console.log(`[voz] openai: ${e?.message ?? e}`)
}
}
// 2. pollinations: texto plano, sin clave, sin registro.
try {
const sistema = encodeURIComponent(`${sistema1}. Responde en español, sin markdown, en dos o tres frases.`)
const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(texto)}?model=openai&system=${sistema}`)
const salida = (await res.text()).replace(/<\|endoftext\|>/g, '').trim()
if (salida) return salida
} catch (e) {
console.log(`[voz] pollinations: ${e?.message ?? e}`)
}
throw `${lenguajeGB['smsAvisoFG']()}NO SE PUDO GENERAR LA RESPUESTA DE VOZ.`
}

async function tts(text = 'error', lang = 'es') {
return new Promise((resolve, reject) => {
try {
const tts = gtts(lang)
const filePath = join(global.__dirname(import.meta.url), '../tmp', 1 * new Date() + '.wav')
tts.save(filePath, text, () => {
resolve(readFileSync(filePath))
unlinkSync(filePath)
})
} catch (e) {
reject(e)
}
})
}
