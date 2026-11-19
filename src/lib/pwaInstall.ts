/* Registro do Service Worker e utilidades de instalação PWA do Recomeça.
   Mantido simples e gentil: nada de notificações agressivas ou banners de
   instalação forçados — o convite vive em /perfil → Privacidade. */

export interface InstallPromptState {
  canInstall: boolean
  isInstalled: boolean
  promptInstall: () => Promise<void>
}

let deferredPrompt: { prompt: () => Promise<void> } | null = null
const listeners = new Set<() => void>()

export function registerServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  // Só registra em builds de produção (evita cachear durante o desenvolvimento)
  if (!import.meta.env.PROD) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sem service worker o app continua funcionando normal, apenas sem offline.
    })
  })

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as unknown as { prompt: () => Promise<void> }
    listeners.forEach((fn) => fn())
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    listeners.forEach((fn) => fn())
  })
}

function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false
  // iOS Safari: modo standalone; Android/Chrome: related app
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari específico
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export function getInstallPromptState(): InstallPromptState {
  return {
    canInstall: !!deferredPrompt,
    isInstalled: detectInstalled(),
    async promptInstall() {
      if (!deferredPrompt) return
      await deferredPrompt.prompt()
      deferredPrompt = null
      listeners.forEach((fn) => fn())
    },
  }
}

export function subscribeToInstallChanges(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
