/**
 * Sube un buffer a un host público y devuelve la URL.
 *
 * Antes apuntaba solo a qu.ax, que ya no existe: todas sus rutas dan 404, así
 * que `.upload` y cualquier comando que dependa de un enlace temporal fallaban
 * siempre. Ahora se intentan varios hosts en orden y se devuelve el primero que
 * responde con una URL. Los errores de red de un host no cortan la cadena.
 */
import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

const UPLOAD_MAX_BYTES = 200 * 1024 * 1024

// Se prueban en orden. Catbox primero: sin clave, sin caducidad y acepta los
// mismos tipos que el bot maneja.
const HOSTS = [
  {
    name: 'catbox',
    async upload(buffer, ext, mime) {
      const form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', new Blob([buffer], {type: mime}), 'tmp.' + ext)
      const res = await fetch('https://catbox.moe/user/api.php', {method: 'POST', body: form})
      const text = (await res.text()).trim()
      if (!res.ok || !/^https?:\/\//.test(text)) throw new Error(`catbox respondió ${res.status}`)
      return text
    }
  },
  {
    name: 'telegra.ph',
    async upload(buffer, ext, mime) {
      // telegra.ph solo acepta imágenes, pero es el respaldo más rápido.
      if (!/^image\//.test(mime)) throw new Error('telegra.ph no acepta este tipo')
      const form = new FormData()
      form.append('file', new Blob([buffer], {type: mime}), 'tmp.' + ext)
      const res = await fetch('https://telegra.ph/upload', {method: 'POST', body: form})
      const json = await res.json()
      if (json?.error) throw new Error(String(json.error))
      if (!json?.[0]?.src) throw new Error('telegra.ph no devolvió src')
      return 'https://telegra.ph' + json[0].src
    }
  }
]

export default async (buffer) => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('uploadImage: buffer vacío')
  if (buffer.length > UPLOAD_MAX_BYTES) throw new Error(`uploadImage: ${buffer.length} bytes excede el límite`)

  const detected = await fileTypeFromBuffer(buffer)
  const ext = detected?.ext ?? 'bin'
  const mime = detected?.mime ?? 'application/octet-stream'

  const failures = []
  for (const host of HOSTS) {
    try {
      return await host.upload(buffer, ext, mime)
    } catch (error) {
      failures.push(`${host.name}: ${error?.message ?? error}`)
    }
  }
  throw new Error(`uploadImage: ningún host aceptó el archivo (${failures.join(' | ')})`)
}
