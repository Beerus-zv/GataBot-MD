> [!IMPORTANT]
> **Este repositorio es una bifurcación de [GataBot-MD](https://github.com/GataNina-Li/GataBot-MD). No es el proyecto original.** Aquí se mantiene una copia que arranca, se vincula y responde con las dependencias y servicios que siguen vivos en 2026. Si buscas el proyecto de la autora, el enlace es el de arriba.

<p align="center">
<img src="https://files.catbox.moe/ixhyq3.png" alt="GataBot-MD" style="width: 75%; height: auto; max-width: 100px;">

<p align="center">
<a href="#"><img title="GataBot-MD (fork)" src="https://img.shields.io/badge/Fork_de_GataBot--MD-mantenido--para--seguir--funcionando-purple?colorA=%239b33b0&colorB=%231c007b&style=for-the-badge"></a>
</p>

<div align="center">

![Node](https://img.shields.io/badge/Node-%3E%3D%2020-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc14-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

[![Proyecto original](https://img.shields.io/badge/Proyecto_original-GataNina--Li-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/GataNina-Li/GataBot-MD)
[![Vincular por código](https://img.shields.io/badge/Vincular_por_c%C3%B3digo-PAIRING.md-2CA5E0?style=for-the-badge&logo=readthedocs&logoColor=white)](./PAIRING.md)

</div>

---

## Qué cambia respecto al proyecto original

El código de arriba es de `GataNina-Li`. Estos son los cambios que hacen que el bot arranque hoy. Están todos en `git log`.

| Área | Qué estaba roto | Qué se hizo |
| --- | --- | --- |
| **Baileys** | El paquete `gatanina-li/baileys` ya no existe en npm ni en GitHub: `npm install` no resolvía. | Se usa `@whiskeysockets/baileys@7.0.0-rc14`. |
| **jimp** | `lib/simple.js` y los plugins de imagen usan la API v0 (`Jimp.read`, `Jimp.MIME_JPEG`, `Jimp.AUTO`); la v1 la eliminó. | Se fija `jimp@0.22.12` y `.npmrc` lleva `legacy-peer-deps=true` para que npm no rechace el peer de Baileys. |
| **Arranque** | `cluster.setupMaster` no existe desde Node 16; ruta de Windows mal construida; `proto` sin namespace; dependencias sin declarar. | Arranque reescrito y probado en Node 20 y 24. |
| **Vinculación** | El código de 8 dígitos se pedía antes de que el socket tuviera transporte, así que nunca llegaba. | Se pide después del arranque, se rota si caduca y se puede pasar por argumento, variable de entorno o `config.js`. Ver [`PAIRING.md`](./PAIRING.md). |
| **Reconexión** | Un `500`/`401` de WhatsApp dejaba sesión envenenada y el bot en bucle de reconexión. | La sesión se limpia y el proceso sigue vivo: un rechazo sin capturar ya no lo mata. |
| **`.menu`** | Sólo aparecía en WhatsApp Business; en WhatsApp normal no llegaba nada. | Un único mensaje de texto plano para todos los clientes. La tarjeta y la imagen son opcionales: `node index.js --menuinteractivo` y `--menuimagen`. |
| **Saludo** | Mencionaba `@…@lid` en vez del número. | Se resuelve el LID al número real (`resolverSenderPn`, `m.senderPn`). |
| **Contenido global** | `plugins/_content.js` leía una variable inexistente en cada mensaje y corría casi al final de la carga. | Los textos se cargan al importar el módulo y el handler los inicializa una vez al arrancar. |
| **Descargas** | Casi todas las APIs de terceros estaban muertas (lolhuman, zahwazein, axly, neoxr, akuari). | `lib/ytdl-local.js` y `lib/social-local.js` resuelven YouTube, TikTok, Instagram, Pinterest y Facebook sin API externa. Las APIs quedaron como respaldo. |
| **Imágenes y stickers** | Hosts que ya no resuelven: `img.nickpic.host`, `top4top.io`, `api.waifu.pics`, `purrbot.site/api/img`… | Se reemplazaron por fuentes vivas: `nekobot.xyz`, `api.purrbot.site/v2`, `nekos.best`, `e621.net`, `wallhaven.cc`, `randomuser.me`, `pollinations`. |
| **Extras muertos** | `getRandom()` se usaba en 184 sitios y ya no existe en Node 24. | `lib/compat.js` lo repone sobre `Array`, `String` y `Buffer`. |

---

## Requisitos

- **Node.js >= 20** (`engines` en `package.json`). Probado en 20 y 24.
- **git**
- **FFmpeg** — stickers, audio y vídeo.
- **ImageMagick** — stickers y edición de imagen.
- Ambos binarios tienen que estar en el `PATH`.

```bash
node -v
ffmpeg -version
magick -version
```

---

## Instalación

> Usa **npm**, no yarn. `legacy-peer-deps` y `overrides` viven en `.npmrc` y `package.json`, y yarn no los lee.

### Termux

```bash
termux-setup-storage
pkg update && pkg upgrade
pkg install -y git nodejs ffmpeg imagemagick
git clone https://github.com/Beerus-zv/GataBot-MD && cd GataBot-MD
npm install
npm start
```

Instalador automático (clona esta bifurcación, no el original):

```bash
pkg install -y bash wget && wget -O - https://raw.githubusercontent.com/Beerus-zv/GataBot-MD/master/gata.sh | bash
```

### Windows

```powershell
git clone https://github.com/Beerus-zv/GataBot-MD; cd GataBot-MD
npm install
npm start
```

FFmpeg y ImageMagick tienen que estar en el `PATH`. Si `ffmpeg -version` no responde en una consola nueva, el bot arranca pero los stickers y el audio fallan.

### Linux / servidor

```bash
sudo apt install -y git ffmpeg imagemagick
git clone https://github.com/Beerus-zv/GataBot-MD && cd GataBot-MD
npm install
npm start
```

---

## Vincular el bot

```bash
npm start                     # arranca y usa la sesión guardada, si existe
npm run qr                    # fuerza el QR en consola
npm run code                  # pide el código de 8 dígitos
npm run code -- +573001234567 # idem, con el número en la línea
```

Las formas de dar el número, el orden de prioridad y la recuperación de una sesión caducada están en [`PAIRING.md`](./PAIRING.md).

La sesión se guarda en `GataBotSession/`. Para empezar de cero:

```bash
rm -rf GataBotSession && npm run qr
```

---

## Configuración

Todo en `config.js`.

| Ajuste | Para qué |
| --- | --- |
| `global.owner` | Números con control total. Formato `['573001234567', 'nombre', true]`. |
| `global.botNumberCode` | Número para vincular por código sin pasarlo por consola. |
| `global.namebot` / `global.author` | Nombre y firma del bot. |
| `global.APIs` | Endpoints externos. Cada clave es un objeto `{url, key}`; los plugins leen `APIs.<clave>.url`. |
| `global.openai_key` | Opcional y vacío por defecto: se añade a mano. Con clave, los comandos de IA y de voz usan OpenAI; sin clave usan `pollinations` como respaldo. |

---

## Comprobar que todo sigue en pie

No hay teléfono en estas pruebas: el handler real corre con un socket falso y se capturan las respuestas.

```bash
npm test             # sintaxis de los 330+ plugins
npm run verify       # test + dependencias + todos los imports
npm run test:menu    # el menú en 8 combinaciones de dispositivo y fallo de medios
npm run probe -- .menu
```

| Herramienta | Qué mide |
| --- | --- |
| `tools/audit-commands.mjs` | Que 30 comandos de todos los módulos respondan. |
| `tools/test-menu.mjs` | Que `.menu` llegue como texto en cada tipo de cliente. |
| `tools/import-smoke.mjs` | Que cada `import` de cada plugin resuelva. |
| `tools/dep-audit.mjs` | Dependencias declaradas y usadas. |
| `tools/audit-hosts.mjs` | Barre todos los hosts de los plugins y marca muertos. |
| `tools/recheck-hosts.mjs` | Repite el barrido con `GET` y User-Agent real, para separar muertos de falsos positivos por `HEAD`. |
| `tools/audit-api-keys.mjs` | Claves `APIs.<x>` usadas que no existen en `config.js` (una clave inexistente se convierte en `undefined` dentro de la URL y mata el comando). |
| `tools/probe-command.mjs` | Un comando concreto a través del handler. `PROBE_REGISTERED=1`, `PROBE_PREMIUM=1`, `PROBE_FULL=1`. |

---

## Limitaciones conocidas

- `.stickerpack` **no descarga**: `api.akuari.my.id` responde 503 y getstickerpack.com está detrás de Cloudflare. El comando avisa y ofrece `.s` (imagen citada → sticker).
- Los comandos de vídeo 18+ usan `e621.net`, no los ficheros originales de `top4top.io` (ese host ya no existe). La categoría es equivalente, el fichero no es el mismo.
- `.toanime` tarda unos 6 segundos la primera vez: es generación por imagen en `pollinations`, con caché después.
- `api.lolhuman.xyz` rechaza la clave que viene en `config.js`. Los comandos que dependen de ella (`marker-ephoto360`, `descargas-igstalk`, `descargas-ighistorias`, `descargas-pptiktok`) no funcionan. Necesitan una clave propia.
- Los textos de `plugins/_content.js` y las imágenes del menú apuntan al repositorio original; si upstream los mueve, se rompen.

---

## Actualizar

```bash
cd GataBot-MD
git pull origin master
npm install
```

`database.json` y `GataBotSession/` no están versionados, así que un `pull` no los toca. Si prefieres el instalador, `update.sh` en este repositorio apunta a esta bifurcación — mueve `database.json` a `$HOME`, reemplaza el código y lo devuelve.

No uses el instalador ni el actualizador del proyecto original: clonan y reemplazan con **upstream**, lo que borra todos los arreglos de arriba.

---

## Créditos

- Proyecto original y código base: [**GataNina-Li**](https://github.com/GataNina-Li) — [GataBot-MD](https://github.com/GataNina-Li/GataBot-MD).
- Colaboradores de upstream: [contributors](https://github.com/GataNina-Li/GataBot-MD/graphs/contributors).
- Base de plugins de la comunidad: [BrunoSobrino](https://github.com/BrunoSobrino), [elrebelde21](https://github.com/elrebelde21) y el resto de autores citados en la cabecera de cada plugin.
- Mantenimiento de esta bifurcación: [Beerus-zv](https://github.com/Beerus-zv).

Soporte de esta bifurcación: los issues de [este repositorio](https://github.com/Beerus-zv/GataBot-MD/issues). No escribas al soporte del proyecto original por problemas de esta copia.

---

## Licencia y términos

[`LICENSE`](./LICENSE) · [`terms.md`](./terms.md) — los del proyecto original, sin cambios.

> El proyecto original mantiene su propio canal de novedades y su propia política de soporte. Esta bifurcación no habla en su nombre.
