/* Service Worker do Recomeça
   ------------------------------------------------------------------
   Objetivo: permitir abrir o app offline (landing e assets estáticos).
   REGRA FUNDAMENTAL: nunca cachear dados do usuário nem respostas do
   backend (PocketBase, API, auth). Tudo que vem do servidor de dados
   passa direto pela rede, sempre.
   ------------------------------------------------------------------ */
const CACHE_NAME = 'recomeca-static-v1'

// Apenas a landing (shell) e assets estáticos.
const PRECACHE_URLS = ['/', '/index.html', '/manifest.webmanifest', '/favicon.ico']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // NUNCA interceptar: backend PocketBase, APIs, auth e tudo cross-origin
  // que não seja a CDN de fontes. Dados do usuário sempre passam pela rede.
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.includes('pocketbase')) return

  // Navegação: tenta a rede primeiro (conteúdo fresco), cai para a shell
  // cacheada quando o aparelho está offline. Só a landing e rotas do app
  // (sem dados sensíveis) — nunca respostas de autenticação.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }

  // Assets estáticos do próprio domínio (JS, CSS, ícones, imagens locais):
  // cache-first, pois o nome do arquivo muda a cada build (hash do Vite).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
    }),
  )
})
