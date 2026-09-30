import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import {
  CRAVING_PROTOCOLS,
  SWAP_ACTIVITIES_BY_TIME,
  ActivityTimeCategory,
  CravingTechniqueProtocol,
  SwapActivityItem,
  MOCK_LAST_EPISODE,
} from '@/lib/mockData'
import { ambientAudio } from '@/lib/ambientSound'
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
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Film,
  Zap,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapeamento de ícones dinâmicos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Droplets,
  Coffee,
  Sparkles,
  Phone,
  Activity,
  Wind,
  Eye,
  Music,
  Film,
  Zap,
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

  // Som ambiente de fundo relaxante
  const [isMusicPlaying, setIsMusicPlaying] = React.useState<boolean>(false)

  // Técnica selecionada no Kit de Técnicas
  const [selectedProtocolId, setSelectedProtocolId] = React.useState<string>('navegar-onda')

  // Checagem HALT interativa (Fome, Raiva, Solitude, Cansaço)
  const [haltAnswers, setHaltAnswers] = React.useState<Record<string, boolean>>({})

  // Categoria de tempo das atividades ('2min' | '10min' | '30min')
  const [selectedTimeCategory, setSelectedTimeCategory] =
    React.useState<ActivityTimeCategory>('2min')

  // Atividade marcada como feita
  const [completedActivity, setCompletedActivity] = React.useState<SwapActivityItem | null>(null)
  const [savedOutcome, setSavedOutcome] = React.useState<'passou' | 'usou' | null>(null)

  // Pausa o áudio ao desmontar
  React.useEffect(() => {
    return () => {
      ambientAudio.pause()
    }
  }, [])

  const handleToggleMusic = () => {
    const nextState = ambientAudio.toggle()
    setIsMusicPlaying(nextState)
  }

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

  const timerProgressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100

  // Atividades filtradas por categoria de tempo
  const filteredActivities = React.useMemo(() => {
    return SWAP_ACTIVITIES_BY_TIME.filter((a) => a.category === selectedTimeCategory)
  }, [selectedTimeCategory])

  const selectedProtocol = React.useMemo(() => {
    return CRAVING_PROTOCOLS.find((p) => p.id === selectedProtocolId) || CRAVING_PROTOCOLS[0]
  }, [selectedProtocolId])

  const handleCompleteActivity = (activity: SwapActivityItem) => {
    setCompletedActivity(activity)
    setSavedOutcome(null)
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Troca de Hábito e Fissura"
        subtitle="A vontade é como uma onda. Escolha uma técnica ou outra atividade para o seu tempo."
        backHref="/hoje"
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. BANNER DE ORIENTAÇÃO GENTIL
           ============================================================= */}
        <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7FBFA8] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Escolha uma técnica para agora
            </p>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Todas funcionam e são baseadas em evidências. A melhor é a que você conseguir fazer
              agora, com calma e sem cobrança.
            </p>
          </div>
        </div>

        {/* =============================================================
            2. KIT DE TÉCNICAS PARA A FISSURA (TCC, DBT, PREVENÇÃO DE RECAÍDA)
           ============================================================= */}
        <section className="space-y-3" aria-label="Kit de técnicas terapêuticas para a fissura">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Kit de Técnicas para a Fissura
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                6 protocolos terapêuticos rápidos em passos gentis
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#4CAF7D] dark:text-[#5DBF8C] px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831]">
              Base clínica
            </span>
          </div>

          {/* Grid de seleção das 6 técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CRAVING_PROTOCOLS.map((protocol) => {
              const isSelected = protocol.id === selectedProtocolId
              return (
                <button
                  key={protocol.id}
                  type="button"
                  onClick={() => setSelectedProtocolId(protocol.id)}
                  className={cn(
                    'p-3 rounded-2xl text-left border transition-all touch-target flex flex-col justify-between min-h-[96px]',
                    isSelected
                      ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] shadow-sm ring-1 ring-[#7FBFA8]'
                      : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/60',
                  )}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] block leading-tight">
                      {protocol.timeLabel}
                    </span>
                    <h3 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-snug line-clamp-2">
                      {protocol.title}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium pt-1 block truncate',
                      isSelected
                        ? 'text-[#4CAF7D] dark:text-[#8FCCAE]'
                        : 'text-[#6A7A72] dark:text-[#A0B0A7]',
                    )}
                  >
                    {protocol.subtitle}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Card Detalhado do Protocolo Selecionado */}
          <RecomecaCard
            variant="default"
            padding="lg"
            className="space-y-4 border-l-4 border-l-[#7FBFA8]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E1E8E2] dark:border-[#2D3A34] pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  {selectedProtocol.approach} • {selectedProtocol.timeLabel}
                </span>
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {selectedProtocol.title}
                </h3>
              </div>
              <span className="text-xs font-medium text-[#4CAF7D] dark:text-[#8FCCAE] bg-[#E8F3EC] dark:bg-[#2A3831] px-2.5 py-1 rounded-full">
                {selectedProtocol.subtitle}
              </span>
            </div>

            <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
              {selectedProtocol.summary}
            </p>

            {/* Passos do protocolo */}
            <div className="space-y-2.5 pt-1">
              {selectedProtocol.steps.map((step) => (
                <div
                  key={step.number}
                  className="p-3 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#7FBFA8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.number}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interatividade específica por técnica */}
            {/* Caso 1: Checagem HALT interativa */}
            {selectedProtocol.id === 'checagem-halt' && (
              <div className="p-3.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-2.5">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Identificou algum destes agora? Toque para ver o que fazer:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      key: 'fome',
                      label: 'Estou com fome',
                      action: 'Coma uma fruta ou tome 1 copo d’água gelada',
                    },
                    {
                      key: 'raiva',
                      label: 'Estou com raiva / tensão',
                      action: 'Lave o rosto com água fria e respire 5 vezes',
                    },
                    {
                      key: 'solitude',
                      label: 'Estou sozinho(a)',
                      action: 'Mande um áudio rápido ou vá para onde tem pessoas',
                    },
                    {
                      key: 'cansaco',
                      label: 'Estou com cansaço',
                      action: 'Deite 10 min de olhos fechados sem olhar o celular',
                    },
                  ].map((item) => {
                    const active = !!haltAnswers[item.key]
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setHaltAnswers((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                        }
                        className={cn(
                          'p-2.5 rounded-xl text-left border transition-all text-xs touch-target flex flex-col justify-between',
                          active
                            ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] text-[#2F4A3E] dark:text-[#8FCCAE]'
                            : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7]',
                        )}
                      >
                        <span className="font-bold flex items-center justify-between">
                          <span>{item.label}</span>
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF7D]" />}
                        </span>
                        {active && (
                          <span className="text-[11px] font-medium text-[#2F4A3E] dark:text-[#E8EFE9] mt-1.5 pt-1 border-t border-[#7FBFA8]/20 block">
                            💡 Micro-ação: {item.action}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Dica de reforço gentil */}
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/20 flex items-center gap-2 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
              <Sparkles className="w-4 h-4 text-[#7FBFA8] shrink-0" />
              <span>{selectedProtocol.gentleReminder}</span>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. TIMER CIRCULAR DE 15 MINUTOS ("Regra dos 15 minutos")
           ============================================================= */}
        <section className="space-y-2" aria-label="Timer de 15 minutos">
          <RecomecaCard
            variant="highlight"
            padding="lg"
            className="text-center space-y-4 relative overflow-hidden"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Técnica prática: Regra dos 15 minutos
              </span>
              <h2 className="text-xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Espere 15 minutos com calma
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto">
                Quando o timer acabar, você decide com liberdade. Se ainda quiser, registre o que
                sentiu sem culpa.
              </p>
            </div>

            {/* Mostrador do Relógio com Anel de Progresso SVG */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#E1E8E2] dark:stroke-[#2D3A34]"
                  strokeWidth="6"
                  fill="transparent"
                />
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
                    ? '15 minutos concluídos!'
                    : isTimerRunning
                      ? 'A onda está baixando...'
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
            </div>

            {secondsLeft === 0 && (
              <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] text-xs text-[#2F4A3E] dark:text-[#8FCCAE] space-y-1 animate-fade-in">
                <p className="font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D]" />
                  Você esperou os 15 minutos.
                </p>
                <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Como está a intensidade agora? Se quiser, registre seu check-in em /hoje ou
                  escolha outra atividade abaixo.
                </p>
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. RESPIRAÇÃO GUIADA COM MÚSICA DE FUNDO RELAXANTE (Surfar a onda)
           ============================================================= */}
        <section className="space-y-2" aria-label="Respiração guiada de acolhimento">
          <RecomecaCard
            variant="default"
            padding="lg"
            className="space-y-4 text-center relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                <Wind className="w-4 h-4 text-[#7FBFA8]" />
                <span>Navegar na onda: Respiração (4s / 6s)</span>
              </div>

              {/* Botão de música relaxante */}
              <button
                type="button"
                onClick={handleToggleMusic}
                aria-label={
                  isMusicPlaying
                    ? 'Desligar música de fundo relaxante'
                    : 'Ligar música de fundo relaxante'
                }
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all touch-target',
                  isMusicPlaying
                    ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] text-[#2F4A3E] dark:text-[#8FCCAE] shadow-sm animate-pulse'
                    : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]',
                )}
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#4CAF7D]" />
                    <span>Música tocando</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#6A7A72]" />
                    <span>Música relaxante</span>
                  </>
                )}
              </button>
            </div>

            {/* Aviso gentil sobre o som relaxante */}
            <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/20 flex items-center justify-between text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              <span className="flex items-center gap-1.5 text-left">
                <Music className="w-3.5 h-3.5 text-[#7FBFA8] shrink-0" />
                <span>
                  {isMusicPlaying
                    ? 'Som ambiente suave de ondas e acordes calmantes ativo.'
                    : 'Toque para ouvir um som relaxante sem fones altos.'}
                </span>
              </span>
              <span className="text-[10px] font-semibold text-[#7FBFA8] shrink-0">
                {isMusicPlaying ? 'Volume suave' : 'Sem autoplay'}
              </span>
            </div>

            {/* Animação circular que expande e contrai */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div
                className={cn(
                  'w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out',
                  'bg-gradient-to-br from-[#7FBFA8]/20 to-[#4CAF7D]/20 border-2 border-[#7FBFA8]/50 shadow-sm',
                  breathPhase === 'inspire'
                    ? 'scale-125 bg-[#7FBFA8]/30 shadow-[0_0_30px_rgba(127,191,168,0.3)]'
                    : 'scale-90 bg-[#7FBFA8]/10',
                )}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    {breathCount}s
                  </span>
                  <span className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                    {breathPhase === 'inspire' ? 'inspire a onda...' : 'solte e quebre a onda...'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-4 max-w-xs leading-relaxed">
                {breathPhase === 'inspire'
                  ? 'Puxe o ar pelo nariz, notando a onda subir sem medo...'
                  : 'Solte o ar pela boca suavemente, vendo a onda quebrar na areia...'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => setIsBreathActive((a) => !a)}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
              >
                {isBreathActive ? 'Pausar animação de respiração' : 'Retomar respiração guiada'}
              </button>

              <span className="text-xs text-[#6A7A72]/40">•</span>

              <button
                type="button"
                onClick={handleToggleMusic}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
              >
                {isMusicPlaying ? 'Pausar música ambiente' : 'Ouvir som relaxante'}
              </button>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            5. INCENTIVOS PARA FAZER OUTRA ATIVIDADE (ORGANIZADAS POR TEMPO/ENERGIA)
           ============================================================= */}
        <section className="space-y-3" aria-label="Sugestões de troca por tempo e energia">
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Enquanto a onda passa, experimenta:
            </h2>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              Sugestões organizadas pelo tempo e pela energia que você tem agora. Toque para marcar
              quando fizer.
            </p>
          </div>

          {/* Chips de filtro por tempo */}
          <div className="grid grid-cols-3 gap-1.5 min-[380px]:gap-2">
            {[
              { id: '2min' as ActivityTimeCategory, label: '2 minutos', hint: 'Imediato' },
              { id: '10min' as ActivityTimeCategory, label: '10 minutos', hint: 'Quebra de onda' },
              { id: '30min' as ActivityTimeCategory, label: '30 min ou +', hint: 'Novo rumo' },
            ].map((tab) => {
              const active = selectedTimeCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTimeCategory(tab.id)}
                  className={cn(
                    'py-2 px-1.5 rounded-xl text-center border transition-all touch-target',
                    active
                      ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                      : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                  )}
                >
                  <span className="block text-xs font-bold leading-tight">{tab.label}</span>
                  <span className="block text-[10px] opacity-85 leading-tight">{tab.hint}</span>
                </button>
              )
            })}
          </div>

          {/* Lista de cards da categoria selecionada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredActivities.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Sparkles
              const isSelected = completedActivity?.id === item.id
              return (
                <RecomecaCard
                  key={item.id}
                  variant="default"
                  padding="md"
                  className={cn(
                    'space-y-2.5 transition-all cursor-pointer group border',
                    isSelected
                      ? 'border-[#7FBFA8] bg-[#E8F3EC]/50 dark:bg-[#2A3831]/50'
                      : 'hover:border-[#7FBFA8]/60',
                  )}
                  onClick={() => handleCompleteActivity(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] px-2 py-0.5 rounded-full bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                        {item.durationLabel}
                      </span>
                      <span className="text-[10px] font-semibold text-[#4CAF7D] dark:text-[#8FCCAE] px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831]">
                        energia: {item.energy}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] group-hover:text-[#6DA98F] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-[#E1E8E2] dark:border-[#2D3A34] text-[11px]">
                    <span className="text-[#7FBFA8] dark:text-[#8FCCAE] font-semibold group-hover:underline">
                      {isSelected ? '✓ Selecionada' : 'Fazer esta atividade'}
                    </span>
                    <span className="text-[#6A7A72] dark:text-[#A0B0A7]">Toque para registrar</span>
                  </div>
                </RecomecaCard>
              )
            })}
          </div>

          {/* Banner de Reforço Positivo Gentil ao Marcar uma Atividade */}
          {completedActivity && (
            <div className="p-4 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4CAF7D] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Feito. Você escolheu você.
                  </h4>
                  <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                    Atividade escolhida: <strong>{completedActivity.title}</strong>
                  </p>
                </div>
              </div>

              {/* Registro opcional do desfecho da onda */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-2">
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Como a onda terminou desta vez? (alimenta suas métricas no Diário)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSavedOutcome('passou')}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold border transition-all text-center',
                      savedOutcome === 'passou'
                        ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent'
                        : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                    )}
                  >
                    Passou sem usar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavedOutcome('usou')}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold border transition-all text-center',
                      savedOutcome === 'usou'
                        ? 'bg-[#E8A84C] text-white border-transparent'
                        : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                    )}
                  >
                    Usei depois
                  </button>
                </div>

                {savedOutcome && (
                  <p className="text-[11px] text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold pt-1 text-center">
                    {savedOutcome === 'passou'
                      ? '✓ Guardado no seu histórico: esta técnica funcionou hoje!'
                      : '✓ Registrado com respeito e sem culpa. Cada dado ajuda a prever gatilhos.'}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Link to="/hoje">
                  <RecomecaButton variant="secondary" size="sm">
                    Ir para o check-in de hoje
                  </RecomecaButton>
                </Link>
                <Link to="/diario">
                  <RecomecaButton variant="primary" size="sm">
                    Ver métricas no Diário
                  </RecomecaButton>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* =============================================================
            6. CARTÃO "LEMBRA DO QUE ACONTECEU EM [DATA]?" (MOCK ÚLTIMO EPISÓDIO)
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
