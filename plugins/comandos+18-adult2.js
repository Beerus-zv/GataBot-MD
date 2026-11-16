//CÓDIGO ELABORADO POR: https://github.com/GataNina-Li & https://github.com/DIEGO-OFC
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
const temaX = [
['hentai', 'pornohentai3', 'nsfwhentai3'],
['ass', 'pornoass2', 'nsfwass2'],
['pgif', 'pornosticker', 'nsfwsticker'],
['thigh', 'pornochica', 'nsfwsgirl'],
['hass', 'pornoass3', 'nsfwass3'],
['boobs', 'pornotetas2', 'nsfwboobs2'], //5
['hboobs', 'pornotetas3', 'nsfwboobs3'],
['pussy', 'pornopussy', 'nsfwpussy'],
['paizuri', 'pornopaizuri', 'nsfwpaizuri'],
['lewdneko', 'pornoneko', 'nsfwneko'],
['feet', 'pornopies2', 'nsfwfoot2'], //10
['hyuri', 'pornoyuri3', 'nsfwyuri3'],
['hthigh', 'pornomuslo', 'nsfwhthigh'],
['hmidriff', 'pornochica2', 'nsfwsgirl2'],
['anal', 'pornoanal', 'nsfwanal'],
['blowjob', 'pornomamada', 'nsfwblowjob'], //15
['gonewild', 'pornogonewild', 'nsfwgonewild'],
['hkitsune', 'pornofurro2', 'nsfwfurry2'],
['tentacle', 'pornotentacle', 'nsfwtentacle'],
['4k', 'porno4k', 'porn4k'],
['kanna', 'pornokanna', 'nsfwkanna'], //20
['hentai_anal', 'pornoanal2', 'nsfwanal2'],
['food', 'pornoalimento', 'nsfwfood'],
['holo', 'pornoholo', 'nsfwholo'],
['nsfw/anal/gif', 'pornoanal3', 'nsfwanal3'],
['nsfw/blowjob/gif', 'pornomamada2', 'nsfwblowjob2'], //25
['nsfw/cum/gif', 'pornocum2', 'nsfwcum2'],
['nsfw/fuck/gif', 'pornofuck', 'nsfwfuck'],
['nsfw/neko/gif', 'pornoneko2', 'nsfwneko2'],
['nsfw/pussylick/gif', 'pornopussy2', 'nsfwpussy2'],
['nsfw/solo/gif', 'pornosolo', 'nsfwsolo'], //30
['nsfw/threesome_fff/gif', 'pornorgia2', 'nsfworgy2'],
['nsfw/threesome_ffm/gif', 'pornorgia3', 'nsfworgy3'],
['yaoi', 'pornoyaoi3', 'nsfwyaoi3'],
['cosplay', 'pornocosplay', 'nsfwcosplay'],
['dbz', 'pornodbz', 'nsfwdbz'], //35
['genshin', 'pornogenshin', 'nsfwgenshin'],
['kimetsu', 'pornokimetsu', 'nsfwkimetsu'],
['hentai2', 'pornohentai2', 'nsfwhentai2'],
['nintendo', 'pornonintendo', 'nsfwnintendo'],
['hololive', 'pornohololive', 'nsfwhololive'], //40
['heroacademy', 'pornoheroacademy', 'nsfwheroacademy'],
['rezero', 'pornorezero', 'nsfwrezero'],
['tatsumaki', 'pornotatsumaki', 'nsfwtatsumaki'],
['naruto', 'pornonaruto', 'nsfwnaruto'],
['kitagawa', 'pornokitagawa', 'nsfwkitagawa']
] //45

// img.nickpic.host dejó de resolver (ENOTFOUND): las 8727 imágenes que traía
// el archivo no existen. Cada categoría se pide a una fuente viva y, si esa
// fuente no contesta, se usa la imagen del repositorio para que el comando
// responda igual en vez de romperse.
const CATEGORIA_VIVA = {
cosplay: 'neko',
dbz: 'hentai',
genshin: 'hentai',
kimetsu: 'hentai',
hentai2: 'hentai',
nintendo: 'hentai',
hololive: 'holo',
heroacademy: 'hentai',
rezero: 'hentai',
tatsumaki: 'hentai',
naruto: 'hentai',
kitagawa: 'hentai'
}

const imagenViva = async (categoria) => {
const tipo = CATEGORIA_VIVA[categoria] || 'neko'
try {
const res = await fetch(`${global.APIs.nekobot.url}image?type=${tipo}`)
const json = await res.json()
if (json?.success && json.message) return json.message
} catch (e) {
console.log(`[18adult2] imagen viva falló (${categoria}): ${e?.message ?? e}`)
}
return global.img
}

let handler = async (m, {command, conn, usedPrefix}) => {
let frep = {
contextInfo: {
externalAdReply: {title: wm, body: lenguajeGB.smsCont18PornP2(), sourceUrl: redesMenu, thumbnail: await (await fetch(img16)).buffer()}
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

try {
if (command == temaX[0][1] || command == temaX[0][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[0][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu,
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno hentai' : 'nsfw hentai'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornohentai' : 'nsfwhentai'}`]], fkontak, m)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno hentai' : 'nsfw hentai'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornohentai' : 'nsfwhentai'}`]], m, frep)}}

if (command == temaX[1][1] || command == temaX[1][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[1][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu,
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno ass' : 'nsfw ass'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoass' : 'nsfwass'}`]], fkontak, m)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno ass' : 'nsfw ass'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoass' : 'nsfwass'}`]], m, frep)}}

if (command == temaX[2][1] || command == temaX[2][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[2][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu,
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], fkontak, m)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[3][1] || command == temaX[3][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[3][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu,
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica 2' : 'nsfws girl 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[13][1] : temaX[13][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica 2' : 'nsfws girl 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[13][1] : temaX[13][2]}`]], m, frep)}}

if (command == temaX[4][1] || command == temaX[4][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[4][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno ass 2' : 'nsfw ass 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[1][1] : temaX[1][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno ass 2' : 'nsfw ass 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[1][2] : temaX[1][2]}`]], m, frep)}}

if (command == temaX[5][1] || command == temaX[5][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[5][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno tetas' : 'nsfw boobs'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotetas' : 'nsfwboobs'}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno tetas' : 'nsfw boobs'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotetas' : 'nsfwboobs'}`]], m, frep)}}

if (command == temaX[6][1] || command == temaX[6][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[6][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno tetas 2' : 'nsfw boobs 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[5][1] : temaX[5][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno tetas 2' : 'nsfw boobs 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[5][1] : temaX[5][2]}`]], m, frep)}}

if (command == temaX[7][1] || command == temaX[7][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[7][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno pussy 2' : 'nsfw pussy 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[29][1] : temaX[29][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno pussy 2' : 'nsfw pussy 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[29][1] : temaX[29][2]}`]], m, frep)}}

if (command == temaX[8][1] || command == temaX[8][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[8][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[9][1] || command == temaX[9][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[9][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno neko 2' : 'nsfw neko 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[28][1] : temaX[28][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno neko 2' : 'nsfw neko 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[28][1] : temaX[28][2]}`]], m, frep)}}

if (command == temaX[10][1] || command == temaX[10][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[10][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[11][1] || command == temaX[11][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[11][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yuri' : 'nsfw yuri'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri' : 'nsfwyuri'}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yuri' : 'nsfw yuri'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri' : 'nsfwyuri'}`]], m, frep)}}

if (command == temaX[12][1] || command == temaX[12][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[12][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[13][1] || command == temaX[13][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[13][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica' : 'nsfws girl'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[3][1] : temaX[3][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica' : 'nsfws girl'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[3][1] : temaX[3][2]}`]], m, frep)}}

if (command == temaX[14][1] || command == temaX[14][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[14][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno anal 2' : 'nsfws anal 2'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[21][1] : temaX[21][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno anal 2' : 'nsfws anal 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[21][1] : temaX[21][2]}`]], m, frep)}}

if (command == temaX[15][1] || command == temaX[15][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[15][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[16][1] || command == temaX[16][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[16][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
link,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
m,
frep
)
}
}

if (command == temaX[17][1] || command == temaX[17][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[17][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno furro 2' : 'nsfws furry'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornofurro' : 'nsfwafurry'}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno furro 2' : 'nsfws furry'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornofurro' : 'nsfwafurry'}`]], m, frep)}}

if (command == temaX[18][1] || command == temaX[18][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[18][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[19][1] || command == temaX[19][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[19][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno sticker' : 'nsfws sticker'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[2][1] : temaX[2][2]}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno sticker' : 'nsfws sticker'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[2][1] : temaX[2][2]}`]], m, frep)}}

if (command == temaX[20][1] || command == temaX[20][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[20][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[21][1] || command == temaX[21][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[21][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[22][1] || command == temaX[22][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[22][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[23][1] || command == temaX[23][2]) {
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[23][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(),
lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny'
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}}

if (command == temaX[24][1] || command == temaX[24][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[24][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno anal' : 'nsfws anal'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoanal' : 'nsfwanal'}`]], fkontak, m)}

if (command == temaX[25][1] || command == temaX[25][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[25][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[26][1] || command == temaX[26][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[26][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[27][1] || command == temaX[27][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[27][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[28][1] || command == temaX[28][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[28][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[29][1] || command == temaX[29][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[29][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno pussy' : 'nsfw pussy'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopussy' : 'nsfwpussy'}`]], fkontak, m)}

if (command == temaX[30][1] || command == temaX[30][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[30][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], fkontak, m)}

if (command == temaX[31][1] || command == temaX[31][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[31][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno orgia' : 'nsfw orgy'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornorgia' : 'nsfworgy'}`]], fkontak, m)}

if (command == temaX[32][1] || command == temaX[32][2]) {
let res = await fetch(APIs.purrbot.url + 'img/' + temaX[32][0])
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendFile(
m.chat,
null,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[33][1] || command == temaX[33][2]) {
//https://lewd.tritan.dev/api/v1/yaoi
let res = await fetch(APIs.nekobot.url + 'image?type=' + temaX[33][0])
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(
m.chat,
stickerr,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: lenguajeGB.smsCont18PornP2(),
body: wm,
mediaType: 2,
sourceUrl: redesMenu.getRandom(),
thumbnail: await (await fetch(img16)).buffer()
}
}
},
{quoted: m}
)
await conn.sendButton(
m.chat,
lenguajeGB.smsCont18PornP(),
`*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` +
wm +
` : *${command[0].toUpperCase() + command.substring(1)}*`,
null,
[
[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`],
[
`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yaoi' : 'nsfw yaoi'} 🥵`.toUpperCase(),
`${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi' : 'nsfwyaoi'}`
]
],
fkontak,
m
)
} else {
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yaoi' : 'nsfw yaoi'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi' : 'nsfwyaoi'}`]], m, frep)}}

if (command == temaX[34][1] || command == temaX[34][2]) {
let link = await imagenViva(temaX[34][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[35][1] || command == temaX[35][2]) {
let link = await imagenViva(temaX[35][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[36][1] || command == temaX[36][2]) {
let link = await imagenViva(temaX[36][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[37][1] || command == temaX[37][2]) {
let link = await imagenViva(temaX[37][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[38][1] || command == temaX[38][2]) {
let link = await imagenViva(temaX[38][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[39][1] || command == temaX[39][2]) {
let link = await imagenViva(temaX[39][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[40][1] || command == temaX[40][2]) {
let link = await imagenViva(temaX[40][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[41][1] || command == temaX[41][2]) {
let link = await imagenViva(temaX[41][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == temaX[42][1] || command == temaX[42][2]) {
let link = await imagenViva(temaX[42][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[43][1] || command == temaX[43][2]) {
let link = await imagenViva(temaX[43][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[44][1] || command == temaX[44][2]) {
let link = await imagenViva(temaX[44][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}

if (command == temaX[45][1] || command == temaX[45][2]) {
let link = await imagenViva(temaX[45][0])
await conn.sendFile(
m.chat,
link,
null,
`${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`,
null,
null,
{viewOnce: true},
m
)
}
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
/*await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)*/
console.log(e)
}
}
handler.command = [
temaX[0][1],
temaX[0][2],
temaX[1][1],
temaX[1][2],
temaX[2][1],
temaX[2][2],
temaX[3][1],
temaX[3][2],
temaX[4][1],
temaX[4][2],
temaX[5][1],
temaX[5][2],
temaX[6][1],
temaX[6][2],
temaX[7][1],
temaX[7][2],
temaX[8][1],
temaX[8][2],
temaX[9][1],
temaX[9][2],
temaX[10][1],
temaX[10][2],
temaX[11][1],
temaX[11][2],
temaX[12][1],
temaX[12][2],
temaX[13][1],
temaX[13][2],
temaX[14][1],
temaX[14][2],
temaX[15][1],
temaX[15][2],
temaX[16][1],
temaX[16][2],
temaX[17][1],
temaX[17][2],
temaX[18][1],
temaX[18][2],
temaX[19][1],
temaX[19][2],
temaX[20][1],
temaX[20][2],
temaX[21][1],
temaX[21][2],
temaX[22][1],
temaX[22][2],
temaX[23][1],
temaX[23][2],
temaX[24][1],
temaX[24][2],
temaX[25][1],
temaX[25][2],
temaX[26][1],
temaX[26][2],
temaX[27][1],
temaX[27][2],
temaX[28][1],
temaX[28][2],
temaX[29][1],
temaX[29][2],
temaX[30][1],
temaX[30][2],
temaX[31][1],
temaX[31][2],
temaX[32][1],
temaX[32][2],
temaX[33][1],
temaX[33][2],
temaX[34][1],
temaX[34][2],
temaX[35][1],
temaX[35][2],
temaX[36][1],
temaX[36][2],
temaX[37][1],
temaX[37][2],
temaX[38][1],
temaX[38][2],
temaX[39][1],
temaX[39][2],
temaX[40][1],
temaX[40][2],
temaX[41][1],
temaX[41][2],
temaX[42][1],
temaX[42][2],
temaX[43][1],
temaX[43][2],
temaX[44][1],
temaX[44][2],
temaX[45][1],
temaX[45][2]
]
handler.premium = true
handler.register = true
export default handler
