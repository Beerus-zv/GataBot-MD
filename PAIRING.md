# Vincular por código (sin QR)

## Formas de dar el número

Orden de prioridad. La primera que tenga un número válido gana.

1. Argumento:
   ```
   npm run code -- +573001234567
   node index.js code +573001234567
   node index.js code --number=+573001234567
   ```
2. Variable de entorno:
   ```
   $env:BOT_NUMBER="+573001234567"; npm run code
   ```
3. `config.js` línea 45:
   ```js
   global.botNumberCode = '+573001234567'
   ```
4. Prompt de consola (último recurso): escribe o pega el número cuando aparezca.
   La línea la lee el proceso primario y la reenvía al worker por IPC, así que
   pegar funciona; antes el primario se comía la línea y la descartaba.

## Normalización aplicada

- Se descartan todo lo que no sea dígito: `+57 300 123-4567` → `573001234567`.
- Prefijo `00` se elimina.
- México: `521XXXXXXXXXX` (13 dígitos) → `52XXXXXXXXXX`.

## Flujo

1. Sesión sin registrar → el código pide número, pide `requestPairingCode`.
2. WhatsApp devuelve código de 8 dígitos, impreso como `XXXX-XXXX`.
3. WhatsApp → Dispositivos vinculados → Vincular con número de teléfono.
4. Introduce el código.

## Fallos conocidos

- `Sesión sin registrar detectada` al arrancar: `GataBotSession/creds.json`
  quedó de un emparejamiento a medias. Se borra solo y se pide número de nuevo.
- `No se pudo pedir el código`: el número no existe en WhatsApp o no tiene
  cuenta. Revisa el código de país.
- Sesión ya vinculada (`registered: true`): el modo código no pregunta nada,
  entra directo.
