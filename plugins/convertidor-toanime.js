import uploadImage from '../lib/uploadImage.js'
const handler = async (m, {conn, text, args, usedPrefix, command}) => {
const q = m.quoted ? m.quoted : m
const mime = (q.msg || q).mimetype || q.mediaType || ''
if (!/image/g.test(mime)) throw `${lenguajeGB.smsAvisoMG()}${mid.smsconvert}`
m.reply(`${lenguajeGB.smsAvisoIIG()}${mid.smsconvert1}`)
const data = await q.download?.()
const image = await uploadImage(data)
try {
// api.lolhuman.xyz rechaza la clave y api.zahwazein.xyz / api.caliph.biz.id
// no resuelven. pollinations convierte la foto con el parámetro image= y
// no pide clave; tarda unos 6 s la primera vez y luego sirve caché.
const estilo = encodeURIComponent('anime style illustration, high quality, detailed shading')
const anime = `https://image.pollinations.ai/prompt/${estilo}?image=${encodeURIComponent(image)}&model=turbo&nologo=true&width=768&height=768`
await conn.sendFile(m.chat, anime, 'error.jpg', null, m)
} catch (e) {
console.log(`[toanime] ${e?.message ?? e}`)
throw `${lenguajeGB.smsAvisoFG()}${mid.smsconvert2}`
}
}
handler.help = ['toanime']
handler.tags = ['tools']
handler.command = /^(jadianime|toanime)$/i
export default handler
