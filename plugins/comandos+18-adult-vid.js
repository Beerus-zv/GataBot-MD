import fetch from 'node-fetch'
import moment from 'moment-timezone'
let handler = async (m, {conn, command, usedPrefix}) => {
let frep = {
contextInfo: {
externalAdReply: {
title: wm,
body: lenguajeGB.smsCont18PornP2(),
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
}
let user = global.db.data.users[m.sender]

if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
const horarioNsfw = db.data.chats[m.chat].horarioNsfw
const now = moment.tz('America/Guayaquil')
const currentTime = now.format('HH:mm')

if (horarioNsfw) {
const {inicio, fin} = horarioNsfw
const inicioTime = moment(inicio, 'HH:mm').tz('America/Guayaquil')
const finTime = moment(fin, 'HH:mm').tz('America/Guayaquil')
const currentMoment = moment(currentTime, 'HH:mm').tz('America/Guayaquil')
let isWithinTimeRange = false
if (inicioTime.isAfter(finTime)) {
if (
currentMoment.isBetween(inicioTime, moment('23:59', 'HH:mm').tz('America/Guayaquil')) ||
currentMoment.isBetween(moment('00:00', 'HH:mm').tz('America/Guayaquil'), finTime)
) {
isWithinTimeRange = true
}
} else {
if (currentMoment.isBetween(inicioTime, finTime)) {
isWithinTimeRange = true
}
}
if (!isWithinTimeRange)
return m.reply(`${lenguajeGB['smsAvisoAG']()} 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙎𝙊𝙇𝙊 𝙁𝙐𝙉𝘾𝙄𝙊́𝙉𝘼 𝙀𝙇 𝙃𝙊𝙍𝘼𝙍𝙄𝙊 𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎: ${inicio} a ${fin}`)
}

// Los seis arrays de este comando venían de top4top.io, que ya no resuelve
// (ENOTFOUND). Se sustituyen por e621.net, que entrega webm públicos sin
// clave con un User-Agent identificable.
const E621_UA = 'GataBot-MD/1.0 (https://github.com/Beerus-zv/GataBot-MD)'
const TAGS_VIDEO = {
pornovid: 'type:webm rating:explicit',
pornovid2: 'type:webm rating:explicit animated',
pornovidlesbi: 'type:webm rating:explicit lesbian',
pornovidgay: 'type:webm rating:explicit gay',
pornovidbisexual: 'type:webm rating:explicit bisexual',
pornovidrandom: 'type:webm rating:explicit'
}
const videoVivo = async (clave) => {
const tags = TAGS_VIDEO[clave] || TAGS_VIDEO.pornovidrandom
const res = await fetch(`https://e621.net/posts.json?tags=${encodeURIComponent(tags)}&limit=40`, {headers: {"user-agent": E621_UA, accept: "application/json"}})
const json = await res.json()
const lista = (json?.posts ?? []).map((p) => p?.file?.url).filter((u) => u && /\.(webm|mp4)$/i.test(u))
if (!lista.length) throw `${lenguajeGB['smsAvisoFG']()}NO HAY VÍDEO DISPONIBLE EN ESTE MOMENTO.`
return lista[Math.floor(Math.random() * lista.length)]
}
// Una sola consulta por mensaje: la caché se llena sólo para la categoría
// que el usuario pidió.
const cacheVivo = {}
const vivo = async (clave) => {
if (!cacheVivo[clave]) cacheVivo[clave] = await videoVivo(clave)
return cacheVivo[clave]
}

try {
switch (command) {
case 'pornovid':
case 'nsfwvid':
//await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, frep, m)
await conn.sendFile(
m.chat,
await vivo('pornovid'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno vid 2' : 'nsfw vid 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovid2' : 'nsfwvid2'}`]], m, frep)
break

case 'pornovid2':
case 'nsfwvid2':
await conn.sendFile(
m.chat,
await vivo('pornovid2'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace1, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno vid random' : 'nsfw vid random'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovidrandom' : 'nsfwvidrandom'}`]], m, frep)
break

case 'pornovidlesbi':
case 'nsfwvidlesbi':
await conn.sendFile(
m.chat,
await vivo('pornovidlesbi'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace2, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)
break

case 'pornovidgay':
case 'nsfwvidgay':
await conn.sendFile(
m.chat,
await vivo('pornovidgay'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace3, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)
break

case 'pornovidbisexual':
case 'nsfwvidbisexual':
await conn.sendFile(
m.chat,
await vivo('pornovidbisexual'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace4, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)
break

case 'pornovidrandom':
case 'nsfwvidrandom':
await conn.sendFile(
m.chat,
await vivo('pornovidrandom'),
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
m,
null,
{viewOnce: true}
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace5, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno vid' : 'nsfw vid'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovid' : 'nsfwvid'}`]], m, frep)
break
}
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}
}
handler.command = [
'pornovid',
'nsfwvid',
'pornovid2',
'nsfwvid2',
'pornovidlesbi',
'nsfwvidlesbi',
'pornovidgay',
'nsfwvidgay',
'pornovidbisexual',
'nsfwvidbisexual',
'pornovidrandom',
'nsfwvidrandom'
]
handler.premium = true
handler.register = true
export default handler
