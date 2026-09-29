import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { HABIT_SWAP_SUGGESTIONS, MOCK_LAST_EPISODE } from '@/lib/mockData'
import {
  Play,
  Pause,
  RotateCcw,
  Footprints,
  Droplets,
  Coffee,
  Sparkles,
  Phone,
  Activity,
  Wind,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapeamento dos ícones dinâmicos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Droplets,
  Coffee,
  Sparkles,
  Phone,
  Activity,
}

export default function Trocar() {
  // Timer de 15 minutos (900 segundos)
  const TOTAL_SECONDS = 15 * 60
  const [secondsLeft, setSecondsLeft] = React.useState<number>(TOTAL_SECONDS)
  const [isTimerRunning, setIsTimerRunning] = React.useState<boolean>(false)

  // Respiração Guiada (ciclo de 10s: 4s inspirar, 6s expirar)
  const [breathPhase, setBreathPhase] = React.useState<'inspire' | 'expire'>('inspire')
  const [breathCount, setBreathCount] = React.useState<number>(4)
  const [isBreathActive, setIsBreathActive] = React.useState<boolean>(true)

  // Timer principal de 15 min
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1)
      }, 1000)
    } else if (secondsLeft === 0) {
      setIsTimerRunning(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, secondsLeft])

  // Timer da respiração guiada (4s dentro, 6s fora)
  React.useEffect(() => {
    if (!isBreathActive) return
    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inspire') {
            setBreathPhase('expire')
            return 6
          } else {
            setBreathPhase('inspire')
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [breathPhase, isBreathActive])

  // Formatação do tempo mm:ss
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setSecondsLeft(TOTAL_SECONDS)
  }

  // Progresso do timer em porcentagem
  const timerProgressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Troca de Hábito"
        subtitle="A vontade passa, como uma onda no mar. Fique aqui com a gente."
        backHref="/hoje"
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. TIMER CIRCULAR DE 15 MINUTOS ("A vontade passa")
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard
            variant="highlight"
            padding="lg"
            className="text-center space-y-4 relative overflow-hidden"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Bateu a vontade?
              </span>
              <h2 className="text-xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Espere 15 minutos com calma
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto">
                Estudos mostram que o pico da fissura diminui intensamente após 10 a 15 minutos. Dê
                esse tempo ao seu corpo.
              </p>
            </div>
            {/* Mostrador do Relógio com Anel de Progresso SVG */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Trilha do anel */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#E1E8E2] dark:stroke-[#2D3A34]"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Progresso */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#7FBFA8] dark:stroke-[#8FCCAE] transition-all duration-500 ease-linear"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * timerProgressPercent) / 100}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold tabular-nums tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {formatTimer(secondsLeft)}
                </span>
                <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] mt-0.5">
                  {secondsLeft === 0
                    ? 'A onda passou!'
                    : isTimerRunning
                      ? 'Respirando junto...'
                      : 'Pronto para iniciar'}
                </span>
              </div>
            </div>
            {/* Controles do Timer */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs mx-auto">
              <RecomecaButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => setIsTimerRunning((r) => !r)}
                leftIcon={
                  isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />
                }
              >
                {isTimerRunning ? 'Pausar' : 'Começar 15 min'}
              </RecomecaButton>

              <button
                type="button"
                onClick={handleResetTimer}
                aria-label="Reiniciar timer para 15 minutos"
                className="w-12 h-12 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] text-[#6A7A72] dark:text-[#A0B0A7] border border-[#E1E8E2] dark:border-[#2D3A34] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] flex items-center justify-center transition-colors touch-target shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>{' '}
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. RESPIRAÇÃO GUIADA (4s dentro, 6s fora)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              <Wind className="w-4 h-4 text-[#7FBFA8]" />
              <span>Respiração Calmante (4s / 6s)</span>
            </div>

            {/* Animação circular que expande e contrai */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div
                className={cn(
                  'w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out',
                  'bg-gradient-to-br from-[#7FBFA8]/20 to-[#4CAF7D]/20 border-2 border-[#7FBFA8]/50 shadow-sm',
                  breathPhase === 'inspire'
                    ? 'scale-125 bg-[#7FBFA8]/30'
                    : 'scale-90 bg-[#7FBFA8]/10',
                )}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    {breathCount}s
                  </span>
                  <span className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                    {breathPhase === 'inspire' ? 'inspire...' : 'solte devagar...'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-4 max-w-xs leading-relaxed">
                {breathPhase === 'inspire'
                  ? 'Puxe o ar pelo nariz, enchendo a barriga devagar...'
                  : 'Solte o ar pela boca suavemente, relaxando os ombros...'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsBreathActive((a) => !a)}
              className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
            >
              {isBreathActive ? 'Pausar animação de respiração' : 'Retomar respiração guiada'}
            </button>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. SUGESTÕES EM CARDS (Caminhar, água, chá, banho, ligar...)
           ============================================================= */}
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Sugestões rápidas de troca
            </h2>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              Escolha uma para ocupar suas mãos e sua atenção nos próximos minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HABIT_SWAP_SUGGESTIONS.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Sparkles
              return (
                <RecomecaCard
                  key={item.id}
                  variant="default"
                  padding="md"
                  className="space-y-2 hover:border-[#7FBFA8] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] px-2 py-0.5 rounded-full bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      {item.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] group-hover:text-[#6DA98F] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </RecomecaCard>
              )
            })}
          </div>
        </section>

        {/* =============================================================
            4. CARTÃO "LEMBRA DO QUE ACONTECEU EM [DATA]?" (MOCK ÚLTIMO EPISÓDIO)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard
            variant="default"
            padding="lg"
            className="border-l-4 border-l-[#7FBFA8] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2F4A3E] dark:text-[#E8EFE9] font-bold text-sm">
                <History className="w-4 h-4 text-[#7FBFA8]" />
                <span>Lembra do que aconteceu em {MOCK_LAST_EPISODE.date}?</span>
              </div>
              <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                Seu último registro
              </span>
            </div>

            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] italic leading-relaxed">
              &ldquo;{MOCK_LAST_EPISODE.freeText}&rdquo;
            </p>

            <div className="p-2.5 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs">
              <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                Gasto registrado na ocasião:
              </span>
              <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                R$ {MOCK_LAST_EPISODE.receipt?.spentAmount.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
              Consequência anotada:{' '}
              <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                {MOCK_LAST_EPISODE.whatHappenedAfter}
              </span>
            </p>

            <p className="text-[11px] text-[#7FBFA8] dark:text-[#8FCCAE] font-semibold pt-1">
              Você já passou por isso e sabe que a paz do dia seguinte vale muito mais.
            </p>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
