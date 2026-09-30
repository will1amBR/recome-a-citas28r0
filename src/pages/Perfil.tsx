import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { MOCK_USER, MOCK_TRACKED_HABITS } from '@/lib/mockData'
import {
  User,
  Moon,
  Sun,
  ShieldCheck,
  HeartHandshake,
  Lock,
  FileText,
  Activity,
  Heart,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Perfil() {
  const { contact } = useRecomecaStore()

  // Controle de tema claro/escuro
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    return document.documentElement.classList.contains('dark')
  })

  const toggleTheme = () => {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Suas preferências, dados de apoio e privacidade protegida."
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. CABEÇALHO DO PERFIL FICTÍCIO
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="highlight" padding="lg" className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] text-[#2F4A3E] dark:text-[#1C2420] font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm">
              {MOCK_USER.name.charAt(0)}
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                {MOCK_USER.name}
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Membro desde {MOCK_USER.sinceYear} • ID Anônimo: {MOCK_USER.anonymousId}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4CAF7D] pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                Espaço individual protegido
              </span>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. HÁBITOS EM ACOMPANHAMENTO
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Hábitos em Acompanhamento
            </h3>
            <Link to="/onboarding" className="text-xs font-semibold text-[#7FBFA8] hover:underline">
              Editar
            </Link>
          </div>

          <div className="space-y-2">
            {MOCK_TRACKED_HABITS.map((habit) => (
              <RecomecaCard
                key={habit.id}
                variant="default"
                padding="md"
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                      {habit.name}
                    </h4>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                      {habit.goalType === 'parar'
                        ? 'Objetivo: Parar de vez'
                        : 'Objetivo: Reduzir aos poucos'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    {habit.currentStreakDays} dias
                  </span>
                  <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Melhor: {habit.bestStreakDays}d
                  </span>
                </div>
              </RecomecaCard>
            ))}
          </div>
        </section>

        {/* =============================================================
            3. CONTATO DE EMERGÊNCIA CONFIGURADO
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Contato de Emergência Atual
            </h3>
            <Link to="/onboarding" className="text-xs font-semibold text-[#7FBFA8] hover:underline">
              Editar
            </Link>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                    {contact.name || 'Contato não configurado'}
                  </h4>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                    {contact.displayPhone || contact.phone || 'Sem telefone'}
                  </span>
                </div>
              </div>

              {contact.hasConsent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] border border-[#4CAF7D]/30 shrink-0">
                  Avisado
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34] leading-relaxed">
              O botão SOS e a tela de Apoio acionam diretamente este contato para ligação e
              conversa.
            </p>
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. PREFERÊNCIAS VISUAIS (TEMA CLARO / ESCURO)
           ============================================================= */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
            Aparência
          </h3>

          <RecomecaCard
            variant="default"
            padding="md"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Modo Escuro (Dark Mode)
                </h4>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Tons suaves e confortáveis para a noite
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar modo claro e escuro"
              className={cn(
                'w-12 h-7 rounded-full p-1 transition-colors touch-target focus-visible:outline-2 focus-visible:outline-[#7FBFA8]',
                isDarkMode ? 'bg-[#7FBFA8]' : 'bg-[#C4CFC8]',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-white transition-transform',
                  isDarkMode ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </RecomecaCard>
        </section>

        {/* =============================================================
            5. PRIVACIDADE E TERMOS (LGPD)
           ============================================================= */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
            Privacidade e Legal
          </h3>

          <RecomecaCard
            variant="default"
            padding="sm"
            className="divide-y divide-[#E1E8E2] dark:divide-[#2D3A34]"
          >
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#7FBFA8]" />
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Proteção de Dados de Saúde (LGPD)
                </span>
              </div>
              <span className="text-[10px] text-[#4CAF7D] font-bold">Ativo</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#7FBFA8]" />
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Notificações neutras e discretas
                </span>
              </div>
              <span className="text-[10px] text-[#4CAF7D] font-bold">Sim</span>
            </div>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
