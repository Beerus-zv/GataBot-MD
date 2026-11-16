/**
 * Descargas de TikTok, Instagram y Pinterest sin depender de una API propia.
 *
 * Los endpoints que usa el bot para estas tres redes están caídos: dorratz cobra
 * (402), siputzx devuelve 404 y betabotz responde vacío. @hiudyy/ytdl ya está en
 * las dependencias y resuelve los tres con sus propios endpoints públicos, así
 * que se ofrece como primer intento, siempre con deadline propio para no colgar
 * el comando si el resolutor no contesta.
 *
 * Formas reales medidas contra las versiones instaladas:
 *   TikTok    {type: 'video', urls: [...], title, audio}
 *   Instagram {medias: [{type: 'video'|'image', url}]}
 *   Pinterest {image | url | download | videos: {V_720P: {url}}}
 */
const TIMEOUT_MS = 25_000

const firstString = (...values) => values.find((value) => typeof value === 'string' && value.length > 0)

export const tiktokLocal = async (url) => {
  const { downloadTiktok } = await import('@hiudyy/ytdl')
  const result = await downloadTiktok(url, {signal: AbortSignal.timeout(TIMEOUT_MS)})
  const data = result?.data ?? result
  const video = firstString(data?.urls?.[0], data?.play, data?.hdplay, data?.video, data?.url, data?.download)
  if (!video) throw new Error('social-local: tiktok sin enlace de vídeo')
  return {
    title: data?.title ?? result?.title ?? 'TikTok',
    video,
    audio: firstString(data?.audio, data?.music)
  }
}

export const instagramLocal = async (url) => {
  const { downloadInstagram } = await import('@hiudyy/ytdl')
  const result = await downloadInstagram(url, {signal: AbortSignal.timeout(TIMEOUT_MS)})
  const media = result?.medias ?? result?.data?.medias ?? result?.data ?? result?.url
  const list = Array.isArray(media) ? media : media ? [media] : []
  const items = list
    .map((item) => (typeof item === 'string' ? {type: 'image', url: item} : {type: item?.type ?? 'image', url: item?.url}))
    .filter((item) => typeof item.url === 'string' && item.url)
  if (!items.length) throw new Error('social-local: instagram sin enlaces')
  return {title: result?.title ?? 'Instagram', items}
}

export const pinterestLocal = async (url) => {
  const { downloadPinterest } = await import('@hiudyy/ytdl')
  const result = await downloadPinterest(url, {signal: AbortSignal.timeout(TIMEOUT_MS)})
  const data = result?.data ?? result
  const image = firstString(
    data?.image,
    data?.url,
    data?.download,
    data?.videos?.V_720P?.url,
    Array.isArray(data?.images) ? data.images[0] : undefined
  )
  if (!image) throw new Error('social-local: pinterest sin imagen')
  return {title: data?.title ?? result?.title ?? 'Pinterest', image}
}

export default {tiktok: tiktokLocal, instagram: instagramLocal, pinterest: pinterestLocal}
