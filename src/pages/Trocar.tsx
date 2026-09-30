import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  ScreenHeader,
  LegalNoticeFooter,
  SoundLibraryModal,
} from '@/components/recomeca'
import {
  CRAVING_PROTOCOLS,
  SWAP_ACTIVITIES_BY_TIME,
  ActivityTimeCategory,
  CravingTechniqueProtocol,
  SwapActivityItem,
  MOCK_LAST_EPISODE,
} from '@/lib/mockData'
import { ambientAudio, SOUND_DEFINITIONS } from '@/lib/ambientSound'
import { useRecomecaStore } from '@/lib/recomecaStore'
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
  ArrowRight,
  ShieldCheck,
  Film,
  Zap,
  HelpCircle,
  Clock,
  Compass,
  TreePine,
  Dumbbell,
  Sparkle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const {
    habits,
    activeHabitId,
    setActiveHabitId,
    episodeLogs,
    userRiskSituations,
    scheduleTasks,
    toggleTaskCompletionToday,
    todayCompletedTaskIds,
    recordTechniqueCompletion,
    recordActivityCompletion,
  } = useRecomecaStore()

  // 15 minutes timer (900 seconds)
  const TOTAL_SECONDS = 15 * 60
  const [secondsLeft, setSecondsLeft] = React.useState<number>(TOTAL_SECONDS)
  const [isTimerRunning, setIsTimerRunning] = React.useState<boolean>(false)

  // Respiração Guiada (ciclo de 10s: 4s inspirar, 6s expirar)
  const [breathPhase, setBreathPhase] = React.useState<'inspire' | 'expire'>('inspire')
  const [breathCount, setBreathCount] = React.useState<number>(4)
  const [isBreathActive, setIsBreathActive] = React.useState<boolean>(true)

  // Som ambiente de fundo relaxante e modal da biblioteca de sons
  const [isMusicPlaying, setIsMusicPlaying] = React.useState<boolean>(ambientAudio.getIsPlaying())
  const [isSoundModalOpen, setIsSoundModalOpen] = React.useState<boolean>(false)
  const [currentSoundId, setCurrentSoundId] = React.useState(ambientAudio.getCurrentSoundId())

  React.useEffect(() => {
    const unsub = ambientAudio.subscribe(() => {
      setIsMusicPlaying(ambientAudio.getIsPlaying())
      setCurrentSoundId(ambientAudio.getCurrentSoundId())
    })
    return unsub
  }, [])

  // Técnica selecionada no Kit de Técnicas
  const [selectedProtocolId, setSelectedProtocolId] = React.useState<string>('navegar-onda')

  // Passos concluídos da técnica ativa
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, number[]>>({
    'navegar-onda': [1],
  })

  // Checagem HALT interativa (Fome, Raiva, Solitude, Cansaço)
  const [haltAnswers, setHaltAnswers] = React.useState<Record<string, boolean>>({})

  // Estado da técnica 5-4-3-2-1
  const [groundingInputs, setGroundingInputs] = React.useState({
    see: 'A caneca na mesa, o tom da parede',
    feel: 'Pés firmes no chão, camiseta nos ombros',
    hear: 'Barulho da rua ao longe',
    smellTaste: 'Gole de água fresca',
  })

  // Estado da técnica Dar o play no filme até o fim
  const [movieCompletedFinal, setMovieCompletedFinal] = React.useState<'calmo' | 'pesado' | null>(
    'calmo',
  )

  // Estado da Ação Oposta
  const [oppositeActionsChecked, setOppositeActionsChecked] = React.useState<
    Record<number, boolean>
  >({
    1: true,
  })

  // Registro de conclusão da técnica guiada
  const [techniqueOutcomeState, setTechniqueOutcomeState] = React.useState<{
    protocolId: string
    status: 'passou' | 'usou' | null
    recorded: boolean
  }>({
    protocolId: '',
    status: null,
    recorded: false,
  })

  // Categoria de tempo das atividades
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

  const handleStopMusic = () => {
    ambientAudio.pause()
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

  const filteredActivities = React.useMemo(() => {
    return SWAP_ACTIVITIES_BY_TIME.filter((a) => a.category === selectedTimeCategory)
  }, [selectedTimeCategory])

  const selectedProtocol = React.useMemo(() => {
    return CRAVING_PROTOCOLS.find((p) => p.id === selectedProtocolId) || CRAVING_PROTOCOLS[0]
  }, [selectedProtocolId])

  // Vício atualmente ativo para contextualização
  const activeHabit = React.useMemo(() => {
    return habits.find((h) => h.id === activeHabitId) || habits[0]
  }, [habits, activeHabitId])

  // Último episódio do vício ativo específico
  const habitLastEpisode = React.useMemo(() => {
    if (!activeHabit) return episodeLogs[0] || MOCK_LAST_EPISODE

    const found = episodeLogs.find((ep) => {
      const epSub = ep.substanceName.toLowerCase()
      const habName = activeHabit.name.toLowerCase()
      const habKey = activeHabit.substanceKey?.toLowerCase() || ''
      return (
        epSub.includes(habName) || habName.includes(epSub) || (habKey && epSub.includes(habKey))
      )
    })

    if (found) return found

    // Se o vício ativo for cigarro/tabaco e não tiver log específico, cria um baseado em dados conhecidos
    const isCig =
      activeHabit.name.toLowerCase().includes('cigarro') ||
      activeHabit.name.toLowerCase().includes('tabaco')
    if (isCig) {
      return {
        id: 'ep-cig-last',
        date: '2025-05-08',
        time: '18:40',
        substanceName: activeHabit.name,
        amountDescription: '3 cigarros após dia tenso de trabalho',
        mood: 'dificil',
        triggers: ['estresse', 'cansaço', 'fim de expediente'],
        freeText:
          'Dia longo com muitas reuniões seguidas. Fumei 3 cigarros seguidos na calçada antes de ir para o ponto de ônibus.',
        whatHappenedAfter:
          'Tosse leve à noite, cheiro forte nas roupas e garganta seca ao acordar.',
        receipt: {
          spentAmount: 13.5,
          arrivalTime: '18:30',
          departureTime: '18:55',
          durationMinutes: 25,
          itemsConsumed: ['1 maço comprado na banca'],
        },
      }
    }

    // Se for café
    const isCoffee = activeHabit.name.toLowerCase().includes('café')
    if (isCoffee) {
      return {
        id: 'ep-cafe-last',
        date: '2025-05-10',
        time: '16:15',
        substanceName: activeHabit.name,
        amountDescription: '4 xícaras de café expresso',
        mood: 'dificil',
        triggers: ['prazo apertado', 'sono'],
        freeText: 'Tomei café além da conta para tentar manter o foco numa entrega.',
        whatHappenedAfter: 'Coração acelerado, dificuldade para pegar no sono até as 2h da manhã.',
        receipt: {
          spentAmount: 22.0,
          arrivalTime: '14:00',
          departureTime: '16:30',
          durationMinutes: 150,
          itemsConsumed: ['3 expressos na cafeteria'],
        },
      }
    }

    // Fallback: MOCK_LAST_EPISODE
    return episodeLogs[0] || MOCK_LAST_EPISODE
  }, [activeHabit, episodeLogs])

  const handleCompleteActivity = (activity: SwapActivityItem) => {
    setCompletedActivity(activity)
    setSavedOutcome(null)
  }

  const handleConfirmActivityOutcome = (outcome: 'passou' | 'usou') => {
    if (!completedActivity) return
    setSavedOutcome(outcome)
    recordActivityCompletion(completedActivity.title, outcome)
  }

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const current = prev[selectedProtocol.id] || []
      const next = current.includes(stepNumber)
        ? current.filter((s) => s !== stepNumber)
        : [...current, stepNumber]
      return { ...prev, [selectedProtocol.id]: next }
    })
  }

  const handleFinishTechnique = (outcome: 'passou' | 'usou') => {
    recordTechniqueCompletion(selectedProtocol.id, selectedProtocol.title, outcome)
    setTechniqueOutcomeState({
      protocolId: selectedProtocol.id,
      status: outcome,
      recorded: true,
    })
  }

  const currentTechniqueStepsDone = completedSteps[selectedProtocol.id] || []
  const allStepsCompleted = selectedProtocol.steps.every((s) =>
    currentTechniqueStepsDone.includes(s.number),
  )

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Métodos de Fissura & Troca"
        subtitle="Cada técnica é uma ferramenta interativa. Diga como a onda terminou e alimente seu Espelho do Mês."
        backHref="/hoje"
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            SELETOR DE VÍCIO ATIVO E CONTADOR CONTEXTUALIZADO
           ============================================================= */}
        {habits.length > 0 && activeHabit && (
          <section
            aria-label="Contexto do vício atual para lidar com a vontade"
            className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-3"
          >
            {/* Seletor rápido se tiver mais de um vício */}
            {habits.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                    Lidando com a vontade de qual hábito agora?
                  </span>
                  <span className="text-[10px] text-[#4CAF7D] font-semibold">1 toque</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {habits.map((h) => {
                    const isSelected = h.id === activeHabit.id
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setActiveHabitId(h.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-bold transition-all touch-target',
                          isSelected
                            ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] shadow-sm'
                            : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                        )}
                      >
                        {h.name}
                        {isSelected && ' ✓'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Contador contextualizado do vício ativo */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#1C2420] border border-[#7FBFA8]/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Seu progresso atual com {activeHabit.name}
                </span>
                <p className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-snug">
                  Você está há{' '}
                  <span className="text-[#4CAF7D] dark:text-[#8FCCAE] tabular-nums">
                    {activeHabit.currentStreakDays}{' '}
                    {activeHabit.currentStreakDays === 1 ? 'dia' : 'dias'}
                  </span>{' '}
                  sem {activeHabit.name.toLowerCase()}
                </p>
                <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Melhor sequência: {activeHabit.bestStreakDays} dias •{' '}
                  {activeHabit.cleanDaysThisMonth} dias livres no mês
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#8FCCAE] block">
                  {activeHabit.dailyGoalCustom ||
                    (activeHabit.goalType === 'parar' ? 'Parar de vez' : 'Reduzir')}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =============================================================
            0. SITUAÇÕES DE RISCO & AÇÕES FÍSICAS DO PLANO (LÓGICA DO DIEGO)
            Ação concreta na hora da vontade: parque, academia, caminhada, tarefas
           ============================================================= */}
        <section
          aria-label="Situações de risco e ações físicas imediatas"
          className="p-4 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border-2 border-[#7FBFA8] space-y-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4CAF7D] dark:text-[#8FCCAE] block">
                  Ação concreta na hora da vontade
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {userRiskSituations && userRiskSituations.length > 0
                    ? `Você costuma usar quando: ${userRiskSituations[0]}. A onda de agora lembra essa?`
                    : 'A onda de agora veio por estresse, pressão ou cansaço?'}
                </h2>
              </div>
            </div>
            <Link
              to="/plano"
              className="text-[10px] font-bold text-[#4CAF7D] hover:underline shrink-0"
            >
              Ver plano completo →
            </Link>
          </div>

          <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
            Se for o caso (como o Diego antes de ir ao bar), fazer uma ação física agora desvia a
            mente e quebra o piloto automático em minutos. Escolha uma abaixo antes das técnicas:
          </p>

          {/* 3 Ações Físicas prioritárias do Plano */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'task-parque',
                title: 'Ir ao parque ou caminhada rápida',
                desc: '15 min ao ar livre. Reseta a visão e gasta o impulso.',
                icon: TreePine,
              },
              {
                id: 'task-academia',
                title: 'Academia ou exercício em casa',
                desc: 'Dopamina saudável real no lugar da substância.',
                icon: Dumbbell,
              },
              {
                id: 'task-louca',
                title: 'Lavar a louça ou arrumar 1 cômodo',
                desc: 'A preguiça passa e a casa limpa alivia a mente.',
                icon: Sparkle,
              },
            ].map((action) => {
              const isDone = todayCompletedTaskIds.includes(action.id)
              const IconComp = action.icon
              return (
                <div
                  key={action.id}
                  onClick={() => toggleTaskCompletionToday(action.id)}
                  className={cn(
                    'p-3 rounded-xl border flex flex-col justify-between min-h-[92px] cursor-pointer transition-all touch-target select-none',
                    isDone
                      ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8]'
                      : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        <IconComp className="w-3.5 h-3.5 text-[#4CAF7D]" />
                        <span className="line-clamp-1">{action.title}</span>
                      </div>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF7D] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] line-clamp-2 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-bold mt-2 pt-1 border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 block',
                      isDone ? 'text-[#4CAF7D]' : 'text-[#6A7A72]',
                    )}
                  >
                    {isDone ? '✓ Marcado no seu Plano' : 'Tocar para fazer'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* =============================================================
            1. BANNER DE ORIENTAÇÃO GENTIL
           ============================================================= */}
        <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7FBFA8] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Ferramentas práticas guiadas passo a passo
            </p>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Marque os passos à medida que fizer. Ao concluir, marque &ldquo;terminei esta
              técnica&rdquo; para registrar uma boa ação por você e gerar métricas de alívio no
              Diário.
            </p>
          </div>
        </div>

        {/* =============================================================
            2. KIT DE TÉCNICAS PARA A FISSURA COMO FERRAMENTAS PRÁTICAS
           ============================================================= */}
        <section className="space-y-3" aria-label="Kit de técnicas terapêuticas para a fissura">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Ferramentas Práticas de Fissura
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                6 métodos terapêuticos com passos guiados e conclusão registrável
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#4CAF7D] dark:text-[#5DBF8C] px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831]">
              Interativo
            </span>
          </div>

          {/* Grid de seleção das 6 técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CRAVING_PROTOCOLS.map((protocol) => {
              const isSelected = protocol.id === selectedProtocolId
              const isDone = completedSteps[protocol.id]?.length === protocol.steps.length
              return (
                <button
                  key={protocol.id}
                  type="button"
                  onClick={() => {
                    setSelectedProtocolId(protocol.id)
                    setTechniqueOutcomeState({ protocolId: '', status: null, recorded: false })
                  }}
                  className={cn(
                    'p-3 rounded-2xl text-left border transition-all touch-target flex flex-col justify-between min-h-[98px]',
                    isSelected
                      ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] shadow-sm ring-1 ring-[#7FBFA8]'
                      : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/60',
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] block leading-tight">
                        {protocol.timeLabel}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF7D]" />}
                    </div>
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

          {/* Card Detalhado do Protocolo Selecionado como FERRAMENTA INTERATIVA */}
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
                {currentTechniqueStepsDone.length} de {selectedProtocol.steps.length} passos
              </span>
            </div>

            <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
              {selectedProtocol.summary}
            </p>

            {/* Passos interativos: tocar para marcar como concluído */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Passos guiados (toque para marcar)
              </span>

              {selectedProtocol.steps.map((step) => {
                const isStepChecked = currentTechniqueStepsDone.includes(step.number)
                return (
                  <div
                    key={step.number}
                    onClick={() => toggleStep(step.number)}
                    className={cn(
                      'p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all touch-target select-none',
                      isStepChecked
                        ? 'bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border-[#7FBFA8]'
                        : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/50',
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        isStepChecked
                          ? 'bg-[#4CAF7D] text-white shadow-sm'
                          : 'bg-[#7FBFA8] text-white',
                      )}
                    >
                      {isStepChecked ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={cn(
                            'text-xs font-bold leading-snug',
                            isStepChecked
                              ? 'text-[#2F4A3E] dark:text-[#8FCCAE]'
                              : 'text-[#2F4A3E] dark:text-[#E8EFE9]',
                          )}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] shrink-0">
                          {isStepChecked ? 'Concluído' : 'Tocar'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Interatividades específicas por técnica */}
            {/* 1. HALT */}
            {selectedProtocol.id === 'checagem-halt' && (
              <div className="p-3.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-2.5">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Identificou algum destes agora? Toque para ver o que fazer:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      key: 'fome',
                      label: 'Fome (comida/água)',
                      action: 'Coma uma fruta ou tome 1 copo de água gelada devagar',
                    },
                    {
                      key: 'raiva',
                      label: 'Raiva / Estresse',
                      action: 'Lave o rosto com água fria e respire 5 vezes antes de responder',
                    },
                    {
                      key: 'solitude',
                      label: 'Solidão / Isolamento',
                      action: 'Mande um áudio rápido para um amigo ou vá para perto de pessoas',
                    },
                    {
                      key: 'cansaco',
                      label: 'Cansaço físico',
                      action: 'Deite 10 min de olhos fechados sem olhar telas',
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

            {/* 2. 5-4-3-2-1 */}
            {selectedProtocol.id === 'aterrissagem-54321' && (
              <div className="p-3.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-2">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Ancoragem sensorial no agora (seus sentidos):
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#7FBFA8]/20 text-[#2F4A3E] dark:text-[#8FCCAE] font-bold flex items-center justify-center shrink-0">
                      5
                    </span>
                    <input
                      type="text"
                      aria-label="5 coisas que você vê"
                      value={groundingInputs.see}
                      onChange={(e) => setGroundingInputs((g) => ({ ...g, see: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E1E8E2] dark:border-[#2D3A34] bg-white dark:bg-[#242E29] text-xs"
                      placeholder="5 coisas que você VÊ agora"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#7FBFA8]/20 text-[#2F4A3E] dark:text-[#8FCCAE] font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <input
                      type="text"
                      aria-label="4 coisas que você sente no corpo"
                      value={groundingInputs.feel}
                      onChange={(e) => setGroundingInputs((g) => ({ ...g, feel: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E1E8E2] dark:border-[#2D3A34] bg-white dark:bg-[#242E29] text-xs"
                      placeholder="4 coisas que você SENTE no corpo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Dar o play no filme até o fim */}
            {selectedProtocol.id === 'assistir-filme-fim' && (
              <div className="p-3.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-2 text-xs">
                <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Qual final você escolhe para amanhã de manhã?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovieCompletedFinal('calmo')}
                    className={cn(
                      'p-2.5 rounded-xl text-left border transition-all touch-target',
                      movieCompletedFinal === 'calmo'
                        ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#4CAF7D] text-[#2F4A3E] dark:text-[#8FCCAE]'
                        : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72]',
                    )}
                  >
                    <span className="font-bold block">Final 1: Acordar leve</span>
                    <span className="text-[11px] block mt-0.5 opacity-90">
                      Cabeça tranquila e orgulho de ter passado a onda.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovieCompletedFinal('pesado')}
                    className={cn(
                      'p-2.5 rounded-xl text-left border transition-all touch-target',
                      movieCompletedFinal === 'pesado'
                        ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] text-[#2F4A3E] dark:text-[#8FCCAE]'
                        : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72]',
                    )}
                  >
                    <span className="font-bold block">Final 2: O impulso</span>
                    <span className="text-[11px] block mt-0.5 opacity-90">
                      Lembrar sem drama do cansaço e do dinheiro gasto.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Dica de reforço gentil */}
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/20 flex items-center gap-2 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
              <Sparkles className="w-4 h-4 text-[#7FBFA8] shrink-0" />
              <span>{selectedProtocol.gentleReminder}</span>
            </div>

            {/* =========================================================
                BLOCO DE CONCLUSÃO REGISTRÁVEL: ALIMENTA O ESPELHO DO MÊS
               ========================================================= */}
            <div className="p-4 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Terminei esta técnica
                </span>
                <span className="text-[11px] font-semibold text-[#4CAF7D] dark:text-[#8FCCAE]">
                  Alimenta o Espelho do Mês
                </span>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Praticou os passos? Registre como a fissura terminou desta vez. Sem cobrança e sem
                julgamento.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFinishTechnique('passou')}
                  className={cn(
                    'p-3 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 touch-target',
                    techniqueOutcomeState.status === 'passou'
                      ? 'bg-[#4CAF7D] text-white border-transparent shadow-sm'
                      : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                  )}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] group-hover:scale-110" />
                  <span>Passou sem usar</span>
                  <span className="text-[10px] font-normal opacity-85">
                    A onda baixou com calma
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishTechnique('usou')}
                  className={cn(
                    'p-3 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 touch-target',
                    techniqueOutcomeState.status === 'usou'
                      ? 'bg-[#E8A84C] text-white border-transparent shadow-sm'
                      : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#E8A84C]',
                  )}
                >
                  <Clock className="w-4 h-4 text-[#E8A84C]" />
                  <span>Houve uso depois</span>
                  <span className="text-[10px] font-normal opacity-85">Registrado sem culpa</span>
                </button>
              </div>

              {techniqueOutcomeState.recorded && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#1C2420] border border-[#7FBFA8]/40 space-y-1 animate-fade-in text-center">
                  <p className="text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                    ✓ Feito. Você escolheu você.
                  </p>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    Esta técnica foi somada às suas boas ações de hoje e atualizou a taxa de alívio
                    no seu Espelho do Mês.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Link
                      to="/hoje"
                      className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] hover:underline"
                    >
                      Ver Boas Ações em /hoje
                    </Link>
                    <span className="text-[#6A7A72]">•</span>
                    <Link
                      to="/diario"
                      className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] hover:underline"
                    >
                      Ver Espelho do Mês
                    </Link>
                  </div>
                </div>
              )}
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
              <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] text-xs text-[#2F4A3E] dark:text-[#8FCCAE] space-y-2 animate-fade-in">
                <p className="font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF7D]" />
                  Você esperou os 15 minutos com coragem.
                </p>
                <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Toque para registrar a conclusão desta técnica e alimentar seu Espelho do Mês:
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFinishTechnique('passou')}
                    className="px-3 py-1.5 rounded-xl bg-[#4CAF7D] text-white text-xs font-bold"
                  >
                    Passou sem usar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinishTechnique('usou')}
                    className="px-3 py-1.5 rounded-xl bg-[#E8A84C] text-white text-xs font-bold"
                  >
                    Usei depois
                  </button>
                </div>
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. RESPIRAÇÃO GUIADA COM BIBLIOTECA DE SONS SINTETIZADOS
           ============================================================= */}
        <section className="space-y-2" aria-label="Respiração guiada de acolhimento">
          <RecomecaCard
            variant="default"
            padding="lg"
            className="space-y-4 text-center relative overflow-hidden"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                <Wind className="w-4 h-4 text-[#7FBFA8]" />
                <span>Navegar na onda: Respiração (4s / 6s)</span>
              </div>

              {/* Controles de som integrados: tocar/parar + abrir biblioteca */}
              <div className="flex items-center gap-1.5 ml-auto">
                {isMusicPlaying && (
                  <button
                    type="button"
                    onClick={handleStopMusic}
                    aria-label="Parar som ambiente agora"
                    className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#2F4A3E] dark:bg-[#E8EFE9] text-white dark:text-[#1C2420] transition-all touch-target"
                  >
                    ■ Parar som
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleMusic}
                  aria-label={
                    isMusicPlaying
                      ? 'Desligar som ambiente calmante'
                      : 'Ligar som ambiente calmante'
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
                      <span className="font-bold">
                        {SOUND_DEFINITIONS[currentSoundId]?.name || 'Som ativo'}
                      </span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#6A7A72]" />
                      <span>Ouvir som ambiente</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSoundModalOpen(true)}
                  aria-label="Abrir biblioteca de sons para trocar ruídos e frequências"
                  className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] hover:bg-[#7FBFA8] hover:text-white transition-colors touch-target"
                >
                  7 sons
                </button>
              </div>
            </div>

            {/* Convite gentil automático para o momento de respiração */}
            <div className="p-2.5 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] flex flex-wrap items-center justify-between gap-2 text-left">
              <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-[#7FBFA8] shrink-0" />
                <span>
                  Que tal ouvir o <strong>oceano & baleias</strong> ou <strong>chuva</strong> para
                  acompanhar sua respiração?
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  ambientAudio.play('ocean')
                }}
                className="text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE] underline hover:opacity-85 shrink-0"
              >
                Tocar oceano agora
              </button>
            </div>

            {/* Animação circular */}
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

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsBreathActive((a) => !a)}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline touch-target"
              >
                {isBreathActive ? 'Pausar animação de respiração' : 'Retomar respiração guiada'}
              </button>

              <span className="text-xs text-[#6A7A72]/40 hidden sm:inline">•</span>

              <button
                type="button"
                onClick={() => setIsSoundModalOpen(true)}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline flex items-center gap-1 touch-target"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Escolher outro som (marrom, lofi, frequências...)</span>
              </button>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            5. ATIVIDADES DA ONDA (TROCA POR TEMPO / ENERGIA)
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

              {/* Registro do desfecho da onda */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-2">
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Como a onda terminou desta vez? (alimenta suas métricas no Diário)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmActivityOutcome('passou')}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold border transition-all text-center',
                      savedOutcome === 'passou'
                        ? 'bg-[#4CAF7D] text-white border-transparent'
                        : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                    )}
                  >
                    Passou sem usar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmActivityOutcome('usou')}
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
                      ? '✓ Guardado no seu histórico e nas Boas Ações: esta técnica funcionou hoje!'
                      : '✓ Registrado com respeito e sem culpa. Cada escolha conta.'}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Link to="/hoje">
                  <RecomecaButton variant="secondary" size="sm">
                    Ir para /hoje
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
            6. CARTÃO "LEMBRA DO QUE ACONTECEU EM [DATA]?" CONTEXTUALIZADO PELO VÍCIO ATIVO
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
                <span>
                  Lembra do que aconteceu em {habitLastEpisode.date}? (
                  {habitLastEpisode.substanceName})
                </span>
              </div>
              <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                Último episódio deste vício
              </span>
            </div>

            {habitLastEpisode.amountDescription && (
              <p className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Consumo: {habitLastEpisode.amountDescription}
              </p>
            )}

            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] italic leading-relaxed">
              &ldquo;{habitLastEpisode.freeText}&rdquo;
            </p>

            {habitLastEpisode.receipt?.spentAmount !== undefined && (
              <div className="p-2.5 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs">
                <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                  Gasto registrado na ocasião:
                </span>
                <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                  R$ {habitLastEpisode.receipt.spentAmount.toFixed(2)}
                </span>
              </div>
            )}

            <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
              Consequência anotada:{' '}
              <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                {habitLastEpisode.whatHappenedAfter}
              </span>
            </p>

            <p className="text-[11px] text-[#7FBFA8] dark:text-[#8FCCAE] font-semibold pt-1">
              Você já passou por isso e sabe que a paz do dia seguinte com{' '}
              {activeHabit.name.toLowerCase()} vale muito mais.
            </p>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>

      {/* Modal da Biblioteca de Sons (7 sons sintetizados) */}
      <SoundLibraryModal
        open={isSoundModalOpen}
        onOpenChange={setIsSoundModalOpen}
        context="respiracao"
      />
    </div>
  )
}
