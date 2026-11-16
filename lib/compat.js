/**
 * Compatibilidad con las APIs que el árbol de plugins da por hechas.
 *
 * 40 plugins llaman `.getRandom()` sobre un array o sobre un string (184 usos) y
 * el resto del proyecto nunca la definió, así que esas líneas lanzaban
 * "getRandom is not a function" en cuanto se evaluaba el módulo: no fallaba el
 * comando, fallaba la carga del plugin completo. rpg-navidad.js, comandos+18,
 * rpg-shop y compañía ni siquiera llegaban a registrarse.
 *
 * No enumerable a propósito: estos métodos no deben aparecer en `for...in`,
 * `Object.keys` ni en la serialización de un array.
 */
const define = (proto, name, value) => {
  if (Object.prototype.hasOwnProperty.call(proto, name)) return
  Object.defineProperty(proto, name, {value, writable: true, configurable: true, enumerable: false})
}

// pick() de un array vacío es undefined, igual que arr[Math.floor(...)] sobre [].
define(Array.prototype, 'getRandom', function getRandom() {
  if (!this.length) return undefined
  return this[Math.floor(Math.random() * this.length)]
})

// Algunos plugins aplican getRandom() sobre redesMenu/canales, que ya son el
// elemento elegido, no la lista. Un string es una colección de un solo valor:
// devolverse a sí mismo mantiene la intención sin cambiar el dato.
define(String.prototype, 'getRandom', function getRandom() {
  return String(this)
})

// Mismo caso para los Buffers: gataVidMenu, img y compañía son imágenes ya
// cargadas en memoria, y el código las trata como una lista de una.
define(Buffer.prototype, 'getRandom', function getRandom() {
  return this
})
