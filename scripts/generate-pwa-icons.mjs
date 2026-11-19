/* Gera os ícones PNG do PWA Recomeça a partir do mesmo desenho do public/icon.svg.
   Rodar: node scripts/generate-pwa-icons.mjs
   Resultado: public/icons/pwa-icon-192.png, public/icons/pwa-icon-512.png,
              public/icons/pwa-icon-maskable-512.png,
              public/apple-touch-icon.png (180x180)
   Sem imagens de substâncias: apenas a marca (R + broto de recomeço). */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0 ^ -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filtro none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Paleta Recomeça (mesmas cores do public/icon.svg)
const GRAD_FROM = [0x8f, 0xcc, 0xae] // #8FCCAE
const GRAD_TO = [0x7f, 0xbf, 0xa8] // #7FBFA8
const GLYPH = [0x2f, 0x4a, 0x3e] // #2F4A3E
const LEAF = [0xfd, 0xfa, 0xf5] // #FDFAF5
const LEAF_DIM = [0xfd, 0xfa, 0xf5, 0.85] // folha esquerda com opacity 0.85

// Desenha a marca Recomeça num canvas size x size.
// rounded=false gera fundo quadrado cheio (safe zone para ícone maskable);
// scale reduz o glifo para caber na zona segura do maskable.
function drawIcon(size, { rounded = true, scale = 1 } = {}) {
  const rgba = Buffer.alloc(size * size * 4)
  const S = (size / 512) * scale // coordenadas locais = espaço 512 do SVG
  const cornerR = rounded ? 96 * (size / 512) : 0

  function inRoundedRect(px, py) {
    if (!rounded) return true
    const r = cornerR
    const x = Math.min(Math.max(px, 0), size)
    const y = Math.min(Math.max(py, 0), size)
    if (x < r && y < r) return Math.hypot(x - r, y - r) <= r
    if (x > size - r && y < r) return Math.hypot(x - (size - r), y - r) <= r
    if (x < r && y > size - r) return Math.hypot(x - r, y - (size - r)) <= r
    if (x > size - r && y > size - r) return Math.hypot(x - (size - r), y - (size - r)) <= r
    return true
  }

  // Path do "R" do icon.svg: M170 390V160c0-10 8-18 18-18h96c52 0 90 36 90 84
  //   0 38-22 68-56 79l64 94c5 8-1 19-10 19h-36c-6 0-11-3-14-8l-59-88h-49v68
  //   c0 9-7 16-16 16h-12c-9 0-16-7-16-16z
  function inGlyph(px, py) {
    const x = px / S
    const y = py / S
    // Haste vertical: rect x 154..186, y 142..406 (com cantos arredondados do path)
    if (x >= 154 && x <= 186 && y >= 142 && y <= 406) return true
    // Cabeça do R: círculo aproximado centro (284, 226), raio ~92 — só a parte
    // que o path cobre (à direita da haste e dentro da altura do arco)
    if (Math.hypot(x - 284, y - 226) <= 92 && x >= 186 && y >= 142 && y <= 310) return true
    // Furo da pança: circle cx 272 cy 224 r 38 (fill #8FCCAE ~ cor do fundo)
    if (Math.hypot(x - 272, y - 224) <= 38) return 'hole'
    // Perna diagonal: do fim da pança (x~284..374, y~310) desce até y=406
    if (y >= 310 && y <= 406) {
      const t = (y - 310) / (406 - 310)
      // largura da perna vai afinando de ~44 a ~34 (h-36 do path)
      const halfW = 22 - t * 4
      const cx = 300 + t * 46
      if (Math.abs(x - cx) <= halfW) return true
    }
    return false
  }

  // Folhas do broto (paths 11 e 12 do icon.svg), aproximação por círculos
  function inSprout(px, py) {
    const x = px / S
    const y = py / S
    // talo central x 272..286, y 124..142
    if (x >= 268 && x <= 286 && y >= 124 && y <= 144) return true
    // folha direita: círculo centro (312, 168) raio 38 — parte acima do R
    if (Math.hypot(x - 308, y - 166) <= 40 && y <= 190) return 'right'
    // folha esquerda: círculo centro (236, 168) raio 38
    if (Math.hypot(x - 236, y - 166) <= 40 && y <= 190) return 'left'
    return false
  }

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const idx = (py * size + px) * 4
      let r, g, b, a
      const cx = px + 0.5
      const cy = py + 0.5
      if (!inRoundedRect(cx, cy)) {
        a = 0
        r = g = b = 0
      } else {
        a = 255
        // gradiente diagonal (0,0)->(1,1) do SVG
        const tx = cx / size
        const ty = cy / size
        const t = tx * 0.5 + ty * 0.5
        const base = [
          Math.round(GRAD_FROM[0] + (GRAD_TO[0] - GRAD_FROM[0]) * t),
          Math.round(GRAD_FROM[1] + (GRAD_TO[1] - GRAD_FROM[1]) * t),
          Math.round(GRAD_FROM[2] + (GRAD_TO[2] - GRAD_FROM[2]) * t),
        ]
        const glyph = inGlyph(cx, cy)
        const sprout = inSprout(cx, cy)
        if (glyph === 'hole') {
          ;[r, g, b] = base // o círculo da pança usa a cor clara do gradiente
        } else if (glyph) {
          ;[r, g, b] = GLYPH
        } else if (sprout === 'right') {
          ;[r, g, b] = LEAF
        } else if (sprout === 'left') {
          // folha esquerda com opacity 0.85 sobre o gradiente
          r = Math.round(base[0] * 0.15 + LEAF_DIM[0] * 0.85)
          g = Math.round(base[1] * 0.15 + LEAF_DIM[1] * 0.85)
          b = Math.round(base[2] * 0.15 + LEAF_DIM[2] * 0.85)
        } else {
          ;[r, g, b] = base
        }
      }
      rgba[idx] = r
      rgba[idx + 1] = g
      rgba[idx + 2] = b
      rgba[idx + 3] = a
    }
  }
  return encodePng(size, size, rgba)
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/pwa-icon-192.png', drawIcon(192))
writeFileSync('public/icons/pwa-icon-512.png', drawIcon(512))
writeFileSync(
  'public/icons/pwa-icon-maskable-512.png',
  drawIcon(512, { rounded: false, scale: 0.72 }),
)
writeFileSync('public/apple-touch-icon.png', drawIcon(180))
console.log('Ícones PWA gerados em public/icons/')
