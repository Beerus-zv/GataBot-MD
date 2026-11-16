/**
 * .stickerpack descargaba paquetes con api.akuari.my.id, que responde 503, y
 * con getstickerpack.com, que está detrás de Cloudflare y devuelve 403 a
 * cualquier petición que no venga de un navegador. No queda servicio público
 * sin clave que convierta un paquete en una lista de imágenes, así que el
 * comando responde con la vía que sí funciona en vez de morir en un fetch
 * muerto.
 */
let handler = async (m, {usedPrefix, text, command}) => {
if (!text)
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused8}\n${usedPrefix + command} https://getstickerpack.com/stickers/flork-memes-4-1`
const telegram = /^https?:\/\/t\.me\/addstickers\//i.test(text)
return m.reply(
[
`${lenguajeGB['smsAvisoFG']()}EL SERVICIO DE PAQUETES DE STICKERS YA NO EXISTE.`,
telegram ? 'LOS PAQUETES DE TELEGRAM NECESITAN UN TOKEN DE BOT, QUE ESTE COMANDO NO TIENE.' : 'getstickerpack.com ESTÁ DETRÁS DE CLOUDFLARE Y api.akuari.my.id RESPONDE 503.',
`ALTERNATIVA QUE SÍ FUNCIONA: RESPONDE A UNA IMAGEN CON *${usedPrefix}s* Y SE CONVIERTE EN STICKER.`
].join('\n')
)
}
handler.command = /^stickerpack$/i
handler.limit = 1
handler.register = true
export default handler
