import * as React from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Sun, PenLine, BookOpen, HeartHandshake, User, PhoneCall, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavTab {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_TABS: NavTab[] = [
  { path: '/hoje', label: 'Hoje', icon: Sun },
  { path: '/plano', label: 'Plano', icon: Sparkles },
  { path: '/registrar', label: 'Registrar', icon: PenLine },
  { path: '/diario', label: 'Diário', icon: BookOpen },
  { path: '/apoio', label: 'Apoio', icon: HeartHandshake },
  { path: '/perfil', label: 'Perfil', icon: User },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  // O onboarding tem fluxo guiado próprio sem a barra inferior de abas
  const isOnboarding = currentPath.startsWith('/onboarding')
  const isSOS = currentPath === '/sos'
  const isLanding = currentPath === '/'

  return (
    <div className="min-h-screen bg-[#FDFAF5] dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* Container Mobile-first centrado em desktop (máximo ~28rem / 450px para telas internas, 720px para landing) */}
      <div
        className={cn(
          'w-full mx-auto flex-1 flex flex-col relative',
          isLanding ? 'max-w-[760px]' : 'max-w-[460px] shadow-sm bg-[#FDFAF5] dark:bg-[#1C2420]',
        )}
      >
        {/* Conteúdo Principal com padding inferior suficiente para não cobrir pela barra fixa */}
        <main
          className={cn(
            'flex-1 flex flex-col w-full min-w-0 overflow-x-hidden',
            !isOnboarding && !isLanding && 'pb-28', // Espaço para nav inferior + botão SOS
            isLanding && 'pb-24', // Espaço seguro para o rodapé da landing
            isOnboarding && 'pb-24',
          )}
        >
          <Outlet />
        </main>

        {/* -------------------------------------------------------------
            Botão SOS Flutuante Fixo (Visível em TODAS as telas, inclusive landing e onboarding)
            - Coral exclusivo (#E86A4C / dark #F07856)
            - Z-index alto (60)
            - Alvo de toque >= 44px
            - Na landing (sem bottom nav), fica colado próximo à borda inferior (bottom-4) para não cobrir o conteúdo central da viewport
            - Nas telas com bottom nav, fica em bottom-20 (acima das abas)
           ------------------------------------------------------------- */}
        {!isSOS && (
          <aside
            aria-label="Apoio emergencial"
            className={cn(
              'fixed z-[60] right-3 min-[400px]:right-4 sm:right-6 pointer-events-none',
              isLanding ? 'bottom-4 sm:bottom-6' : 'bottom-20',
            )}
          >
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => navigate('/sos')}
                aria-label="Preciso de ajuda agora. Abrir tela de emergência SOS."
                className={cn(
                  'group flex items-center gap-1.5 min-[360px]:gap-2 pl-3 pr-3.5 min-[380px]:pl-3.5 min-[380px]:pr-4 py-2.5 min-[380px]:py-3 rounded-full',
                  'bg-[#E86A4C] hover:bg-[#D95C3F] dark:bg-[#F07856] dark:hover:bg-[#FF8A6A]',
                  'text-white font-bold text-xs min-[380px]:text-sm tracking-tight',
                  'shadow-[0_8px_24px_rgba(232,106,76,0.38)] hover:shadow-[0_10px_28px_rgba(232,106,76,0.48)]',
                  'transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E86A4C]',
                  'touch-target cursor-pointer border border-white/20',
                )}
              >
                <div className="w-6 h-6 min-[380px]:w-7 min-[380px]:h-7 rounded-full bg-white/20 flex items-center justify-center animate-pulse shrink-0">
                  <PhoneCall
                    className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 text-white"
                    aria-hidden="true"
                  />
                </div>
                <span className="tabular-nums font-bold">SOS</span>
                <span className="inline text-[11px] min-[380px]:text-xs font-semibold opacity-95 whitespace-nowrap">
                  Preciso de ajuda
                </span>
              </button>
            </div>
          </aside>
        )}

        {/* -------------------------------------------------------------
            Barra Inferior Fixa com 5 Abas (Mobile-First)
            - Presente em todas as rotas internas, exceto Onboarding
           ------------------------------------------------------------- */}
        {!isOnboarding && !isLanding && (
          <nav
            aria-label="Navegação principal"
            className={cn(
              'fixed bottom-0 left-0 right-0 z-30',
              'bg-[#FDFAF5]/95 dark:bg-[#1C2420]/95 backdrop-blur-md',
              'border-t border-[#E1E8E2] dark:border-[#2D3A34]',
              'transition-colors',
            )}
          >
            <div className="max-w-[460px] mx-auto px-2 py-1.5 flex items-center justify-around">
              {NAV_TABS.map((tab) => {
                const isActive = currentPath === tab.path
                const Icon = tab.icon

                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl',
                      'transition-all duration-150 touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FBFA8]',
                      isActive
                        ? 'text-[#2F4A3E] dark:text-[#8FCCAE]'
                        : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E] dark:hover:text-[#E8EFE9]',
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-7 rounded-xl flex items-center justify-center transition-all',
                        isActive &&
                          'bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE]',
                      )}
                    >
                      <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.4px]')} />
                    </div>
                    <span
                      className={cn(
                        'text-[11px] tracking-tight mt-0.5 leading-none',
                        isActive ? 'font-bold' : 'font-medium',
                      )}
                    >
                      {tab.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
