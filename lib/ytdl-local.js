/**
 * Descarga de YouTube sin depender de una API de terceros.
 *
 * La cadena de proveedores del bot (lolhuman, dorratz, siputzx, zenkey, vreden,
 * alyachan, fgmods, skizo, delirius) está muerta o devuelve HTML de parking: de
 * catorce endpoints medidos, uno respondía. @hiudyy/ytdl ya está en las
 * dependencias y mantiene su propio pool de resolutores con reintentos, así que
 * se usa como primer intento y el resto queda como respaldo.
 *
 * Devuelve una URL directa al stream (la del proxy del resolutor), que es
 * exactamente lo que sendFile consume con {url}.
 */
const TIMEOUT_MS = 60_000

const resolve = async (videoUrl, format) => {
  const { downloadYouTube, isYouTubeURL } = await import('@hiudyy/ytdl')
  if (!videoUrl || !isYouTubeURL(videoUrl)) throw new Error('ytdl-local: no es una URL de YouTube')
  const result = await downloadYouTube(videoUrl, format, {signal: AbortSignal.timeout(TIMEOUT_MS)})
  if (!result?.success || !result.filePath) {
    throw new Error(`ytdl-local: ${result?.error ?? 'sin enlace'}`)
  }
  return result.filePath
}

export const ytdlLocalAudio = (videoUrl) => resolve(videoUrl, 'mp3')
export const ytdlLocalVideo = (videoUrl) => resolve(videoUrl, 'mp4')

export default {audio: ytdlLocalAudio, video: ytdlLocalVideo}
