import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  MoodSelector,
  MilestoneBadge,
  ProgressBar,
  ScreenHeader,
  LegalNoticeFooter,
  CigaretteQuickLogModal,
} from '@/components/recomeca'
import {
  MOCK_USER,
  DAILY_INSPIRATION_PHRASES,
  TrackedHabit,
  CravingEpisode,
  CRAVING_PROTOCOLS,
} from '@/lib/mockData'
import { useRecomecaStore } from '@/lib/recomecaStore'
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Heart,
  Shuffle,
  PenLine,
  ChevronRight,
  Coffee,
  Plus,
  Minus,
  Clock,
  Trash2,
  HelpCircle,
  Activity,
  Cigarette,
  ShieldCheck,
  CalendarDays,
  Smile,
  Zap,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Hoje() {
  const navigate = useNavigate()
  const {
    habits,
    activeHabitId,
    setActiveHabitId,
    goodActions,
    goodActionsStreakDays,
    updateCigarettes,
    logCigaretteWithDetails,
    removeLastCigaretteLog,
    cigaretteLogs,
    scheduleTasks,
    todayCompletedTaskIds,
    toggleTaskCompletionToday,
    recordCheckinDone,
    recordTechniqueCompletion,
    recordHonestEpisode,
    lastToastMessage,
    clearToast,
    userGreetingName,
    isDemoUser,
  } = useRecomecaStore()

  // Vício atualmente ativo para check-in e registros em /hoje
  const activeHabit = React.useMemo(() => {
    return habits.find((h) => h.id === activeHabitId) || habits[0]
  }, [habits, activeHabitId])

  // Estado do Modal Rápido de Cigarro
  const [isCigaretteModalOpen, setIsCigaretteModalOpen] = React.useState<boolean>(false)
  const [activeCigaretteHabitId, setActiveCigaretteHabitId] =
    React.useState<string>('habit-cigarro')

  // Mensagem diária acolhedora sorteada
  const [phraseIndex, setPhraseIndex] = React.useState<number>(0)

  // Estado do Check-in diário
  const [checkinMood, setCheckinMood] = React.useState<string>('bem')
  const [usedToday, setUsedToday] = React.useState<'nao' | 'sim' | 'reduzido'>('nao')
  const [usedAmountInput, setUsedAmountInput] = React.useState<string>('')
  const [feltCraving, setFeltCraving] = React.useState<'nao' | 'sim'>('nao')
  const [cravingsList, setCravingsList] = React.useState<CravingEpisode[]>([
    {
      id: 'crav-1',
      time: '16:30',
      dayOrPeriod: 'Hoje à tarde',
      whatBefore: 'Reunião tensa e cansaço',
      whatAfter: 'Tomei água, respirei fundo por 5 min e a onda baixou',
      intensity: 'moderada',
    },
  ])
  const [generalNotes, setGeneralNotes] = React.useState<string>('')
  const [checkinSaved, setCheckinSaved] = React.useState<boolean>(false)

  // Modal / Gaveta rápida de técnica ao indicar fissura no check-in
  const [quickKitOpen, setQuickKitOpen] = React.useState<boolean>(false)
  const [quickTechniqueSelected, setQuickTechniqueSelected] =
    React.useState<string>('regra-15-minutos')

  const handleAddCraving = () => {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes(),
    ).padStart(2, '0')}`
    setCravingsList((prev) => [
      ...prev,
      {
        id: `crav-${Date.now()}`,
        time: currentTime,
        dayOrPeriod: 'Hoje',
        whatBefore: '',
        whatAfter: '',
        intensity: 'leve',
      },
    ])
  }

  const handleUpdateCraving = (id: string, field: keyof CravingEpisode, value: string) => {
    setCravingsList((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleRemoveCraving = (id: string) => {
    setCravingsList((prev) => prev.filter((c) => c.id !== id))
  }

  const handleNextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % DAILY_INSPIRATION_PHRASES.length)
  }

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckinSaved(true)
    if (usedToday === 'sim' && activeHabit) {
      recordHonestEpisode(activeHabit.name, undefined, {
        amountDescription: usedAmountInput || 'Episódio anotado no check-in',
        mood: checkinMood,
        freeText: generalNotes,
      })
    }
    recordCheckinDone()
  }

  // Identifica hábitos do tipo tabaco / cigarro
  const cigaretteHabits = habits.filter(
    (h) =>
      h.name.toLowerCase().includes('cigarro') ||
      h.name.toLowerCase().includes('tabaco') ||
      (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey)),
  )

  // Hábitos de redução não tabaco (ex: café)
  const otherReductionHabits = habits.filter(
    (h) =>
      h.goalType === 'reduzir' &&
      !h.name.toLowerCase().includes('cigarro') &&
      !h.name.toLowerCase().includes('tabaco') &&
      !(h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey)),
  )

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* Toast flutuante de reforço gentil */}
      {lastToastMessage && (
        <aside
          aria-label="Reforço positivo gentil"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm p-3 rounded-2xl bg-[#2F4A3E] text-white dark:bg-[#E8F3EC] dark:text-[#1C2420] shadow-xl flex items-center justify-between gap-2 border border-white/20 animate-fade-in"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <Heart className="w-4 h-4 text-[#7FBFA8] dark:text-[#4CAF7D] shrink-0" />
            <span>{lastToastMessage}</span>
          </div>
          <button
            type="button"
            onClick={clearToast}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Fechar
          </button>
        </aside>
      )}

      {/* Aviso acolhedor se estiver navegando em demonstração */}
      {isDemoUser && (
        <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-[#FDFAF5] dark:bg-[#202723] border border-[#7FBFA8]/40 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#E8A84C]/20 text-[#E8A84C] font-bold text-[10px] uppercase">
              Demonstração
            </span>
            <span className="text-[#6A7A72] dark:text-[#A0B0A7]">Camila (usuária de exemplo)</span>
          </div>
          <Link
            to="/login"
            className="font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline text-[11px]"
          >
            Salvar meus dados →
          </Link>
        </div>
      )}

      {/* Header Mobile Leve */}
      <ScreenHeader
        title={`Olá, ${userGreetingName || MOCK_USER.preferredGreeting}`}
        subtitle="Um dia de cada vez. Seu progresso continua seguro."
        rightAction={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleNextPhrase}
              aria-label="Ver outra frase de incentivo"
              className="w-9 h-9 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center hover:bg-[#7FBFA8]/20 transition-colors touch-target"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <Link
              to="/perfil"
              title="Meu perfil e configurações"
              className="w-9 h-9 rounded-2xl bg-[#7FBFA8] text-white flex items-center justify-center font-bold text-xs"
            >
              {(userGreetingName || 'C').charAt(0).toUpperCase()}
            </Link>
          </div>
        }
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            SELETOR RÁPIDO DE VÍCIO EM /hoje QUANDO HOUVER MAIS DE UM
           ============================================================= */}
        {habits.length > 1 && activeHabit && (
          <section
            aria-label="Seleção rápida do vício para o registro de hoje"
            className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Registrando agora para qual vício?
              </span>
              <span className="text-[11px] font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                Ativo: {activeHabit.name}
              </span>
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
            <p className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
              Selecione para direcionar seu check-in, contadores e atalhos de troca.
            </p>
          </section>
        )}

        {/* =============================================================
            1. MENSAGEM DO DIA (Gentil e acolhedora)
           ============================================================= */}
        <section
          aria-label="Mensagem de incentivo"
          className="p-4 rounded-2xl bg-[#E8F3EC]/80 dark:bg-[#2A3831]/80 border border-[#7FBFA8]/30 text-xs sm:text-sm font-semibold text-[#2F4A3E] dark:text-[#8FCCAE] flex items-start gap-3 transition-all"
        >
          <Heart className="w-5 h-5 text-[#4CAF7D] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="leading-relaxed">
              &ldquo;{DAILY_INSPIRATION_PHRASES[phraseIndex]}&rdquo;
            </p>
            <span className="text-[11px] font-normal text-[#6A7A72] dark:text-[#A0B0A7] mt-1 block">
              Toque no brilho acima para outra reflexão.
            </span>
          </div>
        </section>

        {/* =============================================================
            2. CARD "PLANO DO DIA: CRONOGRAMA DE AÇÕES SAUDÁVEIS"
           ============================================================= */}
        <section aria-label="Plano do dia e cronograma de tarefas">
          <RecomecaCard
            variant="highlight"
            padding="lg"
            className="space-y-3.5 border-l-4 border-l-[#7FBFA8]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#7FBFA8] text-white flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Plano do Dia • Ações & Dopamina Boa
                  </h2>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    Pequenas tarefas que aliviam a mente e geram recompensa
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] tabular-nums">
                  {todayCompletedTaskIds.length} de {scheduleTasks.length} feitas
                </span>
              </div>
            </div>

            {/* Barra de progresso calma */}
            <ProgressBar
              value={
                scheduleTasks.length > 0
                  ? Math.round((todayCompletedTaskIds.length / scheduleTasks.length) * 100)
                  : 0
              }
              size="sm"
              label={`${todayCompletedTaskIds.length} de ${scheduleTasks.length} feitas hoje`}
              showPercentage
              helperText={
                todayCompletedTaskIds.length >= 3
                  ? feltCraving === 'sim'
                    ? 'A vontade veio e você respondeu com ação. Isso é força.'
                    : 'Você usou o dia a seu favor hoje. Sensação de tudo em ordem faz bem.'
                  : todayCompletedTaskIds.length > 0
                    ? 'Um passo por dia já conta. A recompensa da casa em ordem acalma a mente.'
                    : 'Um passo por dia já conta. Essas atividades dão preguiça, mas a recompensa chega.'
              }
            />

            {/* Mini lista de 3 tarefas rápidas para marcar direto de /hoje */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Sugestões para agora:
              </span>
              <div className="space-y-1.5">
                {scheduleTasks.slice(0, 3).map((task) => {
                  const isDone = todayCompletedTaskIds.includes(task.id)
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskCompletionToday(task.id)}
                      className={cn(
                        'p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all touch-target select-none',
                        isDone
                          ? 'bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border-[#7FBFA8]'
                          : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all',
                            isDone
                              ? 'bg-[#4CAF7D] text-white shadow-xs'
                              : 'border-2 border-[#7FBFA8] bg-white dark:bg-[#242E29]',
                          )}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span
                          className={cn(
                            'font-semibold truncate',
                            isDone
                              ? 'line-through text-[#6A7A72] dark:text-[#A0B0A7]'
                              : 'text-[#2F4A3E] dark:text-[#E8EFE9]',
                          )}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#4CAF7D] font-medium shrink-0 ml-2">
                        {isDone ? 'Concluída' : 'Tocar'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reforço acolhedor pós-3 tarefas */}
            {todayCompletedTaskIds.length >= 3 && (
              <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#4CAF7D]/40 space-y-1 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                  <Sparkles className="w-4 h-4 text-[#4CAF7D]" />
                  <span>
                    {feltCraving === 'sim'
                      ? 'A vontade veio e você respondeu com ação. Isso é força.'
                      : 'Você usou o dia a seu favor hoje.'}
                  </span>
                </div>
                <p className="text-[11px] text-[#2F4A3E]/90 dark:text-[#E8EFE9]/90 leading-relaxed">
                  Hoje você cuidou da casa e de você. É assim que se constrói um recomeço.
                </p>
              </div>
            )}

            {/* CTA para o cronograma completo em /plano */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#7FBFA8]/20">
              <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                Sem cobrança por dia vazio
              </span>
              <Link
                to="/plano"
                className="text-[#4CAF7D] dark:text-[#8FCCAE] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Ver cronograma completo ({scheduleTasks.length} tarefas)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. CARD "BOAS AÇÕES DE HOJE" COM CONTADOR DE DIAS SEGUIDOS
           ============================================================= */}
        <section aria-label="Boas ações de hoje">
          <RecomecaCard variant="highlight" padding="lg" className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Boas ações de hoje
                  </h2>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    Tudo o que você fez por si hoje
                  </span>
                </div>
              </div>

              {/* Contador gentil de dias seguidos cuidando de si */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30">
                <Heart className="w-3.5 h-3.5 text-[#4CAF7D]" />
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE]">
                  você cuidou de você {goodActionsStreakDays} dias seguidos
                </span>
              </div>
            </div>

            {/* Lista de boas ações do dia */}
            {goodActions.length > 0 ? (
              <div className="space-y-2">
                {goodActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-[#4CAF7D] shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block truncate">
                          {action.title}
                        </span>
                        <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                          &ldquo;{action.message}&rdquo;
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] tabular-nums shrink-0 ml-2">
                      {action.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] text-center text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Sem problema. Amanhã é outro dia. Cada minuto é uma nova chance de escolha gentil.
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1">
              <span>Tom sempre de convite • Sem cobrança</span>
              <Link
                to="/trocar"
                className="text-[#7FBFA8] dark:text-[#8FCCAE] font-bold hover:underline flex items-center gap-1"
              >
                <span>Fazer uma boa ação agora</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. MARCADOR DE CIGARROS (PARA VÍCIOS TABACO / CIGARRO)
           ============================================================= */}
        {cigaretteHabits.length > 0 && (
          <section aria-label="Marcador diário de cigarros e maços" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-[#7FBFA8]" />
                <span>Cigarros de Hoje</span>
              </h2>
              <span className="text-xs text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold">
                20 cigarros = 1 maço
              </span>
            </div>

            {cigaretteHabits.map((habit) => {
              const count = habit.cigarettesToday ?? 0
              const packs = (count / 20).toFixed(1).replace('.', ',')
              const weekCount = habit.cigarettesWeek ?? count
              const weekPacks = (weekCount / 20).toFixed(1).replace('.', ',')
              const dailyGoal = habit.dailyLimit ?? 6
              const isWithinGoal = count <= dailyGoal

              return (
                <RecomecaCard
                  key={habit.id}
                  variant="default"
                  padding="lg"
                  className="space-y-4 border-l-4 border-l-[#7FBFA8]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                        Contador de consumo diário • {habit.name}
                      </span>
                      <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        Marcador de hoje
                      </h3>
                    </div>
                    {habit.goalType === 'reduzir' && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE]">
                        Meta: até {dailyGoal} cigarros
                      </span>
                    )}
                  </div>

                  {/* Mostrador gigante em cigarros e maços com botões grandes +1 / -1 */}
                  <div className="p-4 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      {/* Botão Menos 1 */}
                      <button
                        type="button"
                        onClick={() => removeLastCigaretteLog(habit.id)}
                        disabled={count <= 0}
                        aria-label="Diminuir 1 cigarro ou desfazer último"
                        className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 touch-target shadow-sm',
                          count > 0
                            ? 'bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] hover:bg-[#7FBFA8]/20 border-[#7FBFA8]/40'
                            : 'bg-[#F4F7F2] dark:bg-[#202723] text-[#6A7A72]/40 border-transparent cursor-not-allowed',
                        )}
                      >
                        <Minus className="w-6 h-6 stroke-[3px]" />
                      </button>

                      {/* Contagem em destaque duplo: Cigarros E Maços */}
                      <div className="text-center flex-1 min-w-0">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-4xl min-[360px]:text-5xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                            {count}
                          </span>
                          <span className="text-xs min-[360px]:text-sm font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                            {count === 1 ? 'cigarro' : 'cigarros'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#7FBFA8] dark:text-[#8FCCAE] block mt-0.5">
                          (~{packs} {count >= 20 ? 'maços' : 'maço'})
                        </span>
                      </div>

                      {/* Botão Mais 1 (Abre modal rápido de horário + contexto) */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCigaretteHabitId(habit.id)
                          setIsCigaretteModalOpen(true)
                        }}
                        aria-label="Registrar cigarro com horário e motivo"
                        className="w-14 h-14 rounded-2xl bg-[#7FBFA8] hover:bg-[#6DA98F] text-white flex items-center justify-center transition-all active:scale-95 touch-target shadow-md"
                      >
                        <Plus className="w-6 h-6 stroke-[3px]" />
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCigaretteHabitId(habit.id)
                          setIsCigaretteModalOpen(true)
                        }}
                        className="text-xs font-bold text-[#4CAF7D] hover:underline inline-flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Toque no +1 para horário e momento (2 toques)</span>
                      </button>
                    </div>

                    {/* Últimos cigarros registrados hoje com horário e contexto */}
                    {cigaretteLogs.length > 0 && (
                      <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#6A7A72] dark:text-[#A0B0A7]">
                          <span>Momentos registrados hoje:</span>
                          <Link to="/diario" className="text-[#4CAF7D] hover:underline">
                            Ver métricas no Diário →
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {cigaretteLogs.slice(0, 5).map((cig) => (
                            <span
                              key={cig.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[11px] text-[#2F4A3E] dark:text-[#E8EFE9]"
                            >
                              <Clock className="w-3 h-3 text-[#7FBFA8]" />
                              <strong className="tabular-nums">{cig.timestamp}</strong>
                              <span>•</span>
                              <span>{cig.context}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total da semana e comparação amigável */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] text-center text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-[#242E29]">
                        <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                          Total na semana
                        </span>
                        <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9] text-sm tabular-nums">
                          {weekCount} cig. (~{weekPacks} maço)
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-[#242E29]">
                        <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                          Status da meta diária
                        </span>
                        <span
                          className={cn(
                            'font-bold text-xs',
                            isWithinGoal ? 'text-[#4CAF7D]' : 'text-[#E8A84C]',
                          )}
                        >
                          {isWithinGoal
                            ? `Hoje até ${dailyGoal} cigarros`
                            : 'Passou da meta? Sem culpa'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progresso em relação à meta do dia */}
                  {habit.goalType === 'reduzir' && (
                    <div className="pt-1">
                      <ProgressBar
                        value={Math.min(100, Math.round((count / dailyGoal) * 100))}
                        size="sm"
                        label={`Meta: ${count} de ${dailyGoal} cigarros hoje`}
                        showPercentage
                        helperText={
                          isWithinGoal
                            ? 'Dentro da meta combinada com calma. Cada cigarro não fumado conta.'
                            : 'Passou da meta? Sem problema. Amanhã é outro dia para recomeçar com calma.'
                        }
                      />
                    </div>
                  )}
                </RecomecaCard>
              )
            })}
          </section>
        )}

        {/* =============================================================
            4. SEUS CONTADORES DE DIAS LIVRES
           ============================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Seus Contadores
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              {habits.length} em acompanhamento
            </span>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => {
              const isReduction = habit.goalType === 'reduzir'

              return (
                <RecomecaCard
                  key={habit.id}
                  variant="highlight"
                  padding="lg"
                  className="space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                        {isReduction ? 'Meta de Redução' : 'Contador Livre'}
                      </span>
                      <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {habit.name}
                      </h3>
                    </div>

                    <MilestoneBadge
                      days={habit.milestoneGoalDays}
                      label={`Marco ${habit.milestoneGoalDays}d`}
                      size="sm"
                    />
                  </div>

                  <div className="py-2 text-center">
                    <div className="flex flex-wrap items-baseline justify-center gap-1.5 min-[360px]:gap-2">
                      <span className="text-5xl min-[360px]:text-6xl sm:text-7xl font-bold tabular-nums tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {habit.currentStreakDays}
                      </span>
                      <span className="text-xs min-[360px]:text-sm sm:text-base font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                        dias limpos agora
                      </span>
                    </div>

                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-1">
                      {isReduction
                        ? 'Mantendo a meta diária sob controle'
                        : 'Cada dia é uma nova conquista sua'}
                    </p>
                  </div>

                  {/* Histórico que NÃO zera tudo: Melhor sequência */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20">
                    <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] text-center min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                        Melhor Sequência
                      </span>
                      <span className="text-base min-[360px]:text-lg font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block truncate">
                        {habit.bestStreakDays} dias
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] text-center min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                        Dias Livres no Mês
                      </span>
                      <span className="text-base min-[360px]:text-lg font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block truncate">
                        {habit.cleanDaysThisMonth} dias
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <ProgressBar
                      value={Math.min(
                        100,
                        Math.round((habit.currentStreakDays / habit.milestoneGoalDays) * 100),
                      )}
                      size="md"
                      label={`Próximo marco: ${habit.milestoneGoalDays} dias`}
                      showPercentage
                      helperText="Em média, um novo hábito se consolida por volta dos 66 dias. Você já está caminhando."
                    />
                  </div>
                </RecomecaCard>
              )
            })}
          </div>
        </section>

        {/* =============================================================
            5. OUTRAS METAS DE REDUÇÃO (EX: CAFÉ)
           ============================================================= */}
        {otherReductionHabits.map((reductionHabit) => {
          return (
            <section key={reductionHabit.id} className="space-y-2">
              <RecomecaCard variant="default" padding="md" className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                        Meta do dia: {reductionHabit.name}
                      </h3>
                      <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] truncate">
                        Hoje até {reductionHabit.dailyLimit} {reductionHabit.unit || 'unidades'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#FDFAF5] dark:bg-[#1C2420] p-1 rounded-xl border border-[#E1E8E2] dark:border-[#2D3A34] shrink-0 ml-auto">
                    <button
                      type="button"
                      onClick={() => updateCigarettes(reductionHabit.id, -1)}
                      aria-label="Diminuir uma unidade"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-7 text-center font-bold tabular-nums text-sm">
                      {reductionHabit.dailyCurrent ?? 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCigarettes(reductionHabit.id, 1)}
                      aria-label="Adicionar uma unidade"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <ProgressBar
                  value={Math.min(
                    100,
                    Math.round(
                      ((reductionHabit.dailyCurrent ?? 1) / (reductionHabit.dailyLimit || 1)) * 100,
                    ),
                  )}
                  size="sm"
                  label={`${reductionHabit.dailyCurrent ?? 1} de ${reductionHabit.dailyLimit} ${reductionHabit.unit}`}
                  showPercentage
                  helperText={
                    (reductionHabit.dailyCurrent ?? 1) <= (reductionHabit.dailyLimit || 2)
                      ? 'Dentro da meta combinada com calma.'
                      : 'Passou um pouco da meta? Seja gentil com você. Amanhã é outro dia.'
                  }
                />
              </RecomecaCard>
            </section>
          )
        })}

        {/* =============================================================
            6. CHECK-IN DIÁRIO (COM KIT RÁPIDO EM 1 TOQUE QUANDO HÁ FISSURA)
           ============================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Check-in de Hoje
              </h2>
              {activeHabit && (
                <p className="text-xs text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold">
                  Registro focado em: <strong>{activeHabit.name}</strong>
                  {activeHabit.dailyGoalCustom ? ` (meta: ${activeHabit.dailyGoalCustom})` : ''}
                </p>
              )}
            </div>
            <span className="text-xs text-[#4CAF7D] dark:text-[#5DBF8C] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Tudo opcional • Sem cobrança
            </span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-5">
            {checkinSaved ? (
              <div className="py-4 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#4CAF7D]/20 text-[#4CAF7D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Check-in de hoje guardado com carinho
                  </h3>
                  <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto">
                    Feito. Você escolheu você. Esse minutinho diário alimenta suas boas ações e suas
                    métricas no Diário.
                  </p>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckinSaved(false)}
                    className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] underline"
                  >
                    Editar respostas
                  </button>
                  <Link
                    to="/diario"
                    className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] underline"
                  >
                    Ver métricas no Diário
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveCheckin} className="space-y-5">
                <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 flex items-start gap-2.5 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
                  <HelpCircle className="w-4 h-4 text-[#7FBFA8] shrink-0 mt-0.5" />
                  <span>
                    Responda só o que quiser. Nenhuma pergunta é obrigatória — salvar nunca é
                    bloqueado.
                  </span>
                </div>

                {/* Pergunta 1: Humor */}
                <div className="space-y-1.5">
                  <MoodSelector
                    value={checkinMood}
                    onChange={(m) => setCheckinMood(m)}
                    label="1. Como você está se sentindo hoje? (opcional)"
                  />
                </div>

                {/* Pergunta 2: Consumo */}
                <div className="space-y-2 text-left pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      2. Como foi o consumo de {activeHabit ? activeHabit.name : 'substância'} hoje?
                      (opcional)
                    </label>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      Sem julgamento
                    </span>
                  </div>
                  {activeHabit && (
                    <span className="text-[11px] text-[#4CAF7D] dark:text-[#8FCCAE] font-medium block">
                      Meta do dia cadastrada:{' '}
                      {activeHabit.dailyGoalCustom ||
                        (activeHabit.dailyLimit
                          ? `até ${activeHabit.dailyLimit} ${activeHabit.unit || ''}`
                          : 'não definida')}
                    </span>
                  )}
                  <div className="grid grid-cols-3 gap-1.5 min-[380px]:gap-2">
                    <button
                      type="button"
                      onClick={() => setUsedToday('nao')}
                      className={cn(
                        'py-2.5 px-1.5 min-[380px]:px-2 rounded-xl text-[11px] min-[380px]:text-xs font-bold border transition-all touch-target text-center leading-tight',
                        usedToday === 'nao'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Não usei
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsedToday('reduzido')}
                      className={cn(
                        'py-2.5 px-1.5 min-[380px]:px-2 rounded-xl text-[11px] min-[380px]:text-xs font-bold border transition-all touch-target text-center leading-tight',
                        usedToday === 'reduzido'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Na meta
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsedToday('sim')}
                      className={cn(
                        'py-2.5 px-1.5 min-[380px]:px-2 rounded-xl text-[11px] min-[380px]:text-xs font-bold border transition-all touch-target text-center leading-tight',
                        usedToday === 'sim'
                          ? 'bg-[#E8A84C] text-white border-transparent shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Houve episódio
                    </button>
                  </div>

                  {usedToday === 'sim' && (
                    <div className="pt-1.5 animate-fade-in space-y-2">
                      <input
                        type="text"
                        placeholder="Quanto usou aproximadamente? (ex: 2 cigarros, 1 dose...)"
                        value={usedAmountInput}
                        onChange={(e) => setUsedAmountInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                      />
                    </div>
                  )}
                </div>

                {/* Pergunta 3: FISSURA RICA COM KIT RÁPIDO EM 1 TOQUE */}
                <div className="space-y-3 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      3. Bateu fissura ou vontade forte hoje? (opcional)
                    </label>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      Mapeia horários
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFeltCraving('nao')}
                      className={cn(
                        'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target',
                        feltCraving === 'nao'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Não senti fissura
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeltCraving('sim')}
                      className={cn(
                        'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target',
                        feltCraving === 'sim'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Sim, bateu fissura
                    </button>
                  </div>

                  {/* =========================================================
                      KIT RÁPIDO ACESSÍVEL EM 1 TOQUE QUANDO INDICA FISSURA
                     ========================================================= */}
                  {feltCraving === 'sim' && (
                    <div className="space-y-3 pt-2 animate-fade-in">
                      <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-[#4CAF7D]" />
                            Kit rápido de fissura (1 toque)
                          </span>
                          <span className="text-[10px] font-semibold text-[#4CAF7D] bg-white/60 dark:bg-[#1C2420] px-2 py-0.5 rounded-full">
                            Alívio imediato
                          </span>
                        </div>

                        <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                          A vontade sobe e desce em minutos. Escolha uma técnica em 1 toque agora:
                        </p>

                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            {
                              id: 'regra-15-minutos',
                              label: '15 Minutos',
                              sub: 'Esperar com calma',
                            },
                            { id: 'navegar-onda', label: 'Surfar a onda', sub: 'Respiração 4s/6s' },
                            { id: 'checagem-halt', label: 'HALT', sub: 'Fome/Raiva/Sono' },
                          ].map((item) => (
                            <Link
                              key={item.id}
                              to="/trocar"
                              className="p-2.5 rounded-xl bg-white dark:bg-[#1C2420] border border-[#7FBFA8]/40 hover:border-[#7FBFA8] text-center transition-all touch-target flex flex-col justify-between"
                            >
                              <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-[#4CAF7D] font-medium block truncate">
                                {item.sub}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                          <Link
                            to="/trocar"
                            className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] hover:underline flex items-center gap-1"
                          >
                            <span>Ver todas as 6 técnicas guiadas</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to="/trocar"
                            className="text-[11px] font-semibold text-[#4CAF7D] dark:text-[#8FCCAE] hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Biblioteca de sons (ruído marrom, chuva...)</span>
                          </Link>
                        </div>
                      </div>

                      {/* Lista opcional de episódios de fissura */}
                      <div className="space-y-3">
                        {cravingsList.map((craving, idx) => (
                          <div
                            key={craving.id}
                            className="p-3.5 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-3 relative"
                          >
                            <div className="flex items-center justify-between border-b border-[#E1E8E2] dark:border-[#2D3A34] pb-2">
                              <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                                Episódio de fissura #{idx + 1}
                              </span>
                              {cravingsList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCraving(craving.id)}
                                  className="text-xs text-[#D96C68] hover:underline flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  remover
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                                  Qual horário? (opcional)
                                </label>
                                <input
                                  type="time"
                                  value={craving.time || ''}
                                  onChange={(e) =>
                                    handleUpdateCraving(craving.id, 'time', e.target.value)
                                  }
                                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                                  Que dia / período?
                                </label>
                                <input
                                  type="text"
                                  placeholder="Ex.: Hoje tarde"
                                  value={craving.dayOrPeriod || ''}
                                  onChange={(e) =>
                                    handleUpdateCraving(craving.id, 'dayOrPeriod', e.target.value)
                                  }
                                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                                O que estava acontecendo antes? (opcional)
                              </label>
                              <input
                                type="text"
                                placeholder="Ex.: Pressão no trabalho, vi alguém usando..."
                                value={craving.whatBefore || ''}
                                onChange={(e) =>
                                  handleUpdateCraving(craving.id, 'whatBefore', e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                                E depois, o que aconteceu? (opcional)
                              </label>
                              <input
                                type="text"
                                placeholder="Ex.: Respirei fundo, tomei água e a onda baixou..."
                                value={craving.whatAfter || ''}
                                onChange={(e) =>
                                  handleUpdateCraving(craving.id, 'whatAfter', e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddCraving}
                          className="w-full py-2 px-3 rounded-xl border border-dashed border-[#7FBFA8] text-xs font-semibold text-[#2F4A3E] dark:text-[#8FCCAE] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] flex items-center justify-center gap-1.5 transition-colors touch-target"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar outra fissura no dia</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pergunta 4: Notas livres */}
                <div className="space-y-1.5 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center justify-between">
                    <span>4. Alguma reflexão ou nota para você mesmo?</span>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] font-normal">
                      opcional
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="Escreva como você se sente hoje se tiver vontade..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                </div>

                <RecomecaButton variant="primary" size="md" fullWidth type="submit">
                  Guardar check-in de hoje
                </RecomecaButton>
              </form>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            7. CARD "RECOMEÇAR FAZ PARTE" (SE MARCOU QUE USOU HOJE)
           ============================================================= */}
        {usedToday === 'sim' && (
          <section className="space-y-3 animate-fade-in">
            <RecomecaCard
              variant="default"
              padding="lg"
              className="border-l-4 border-l-[#E8A84C] space-y-4"
            >
              <div className="flex items-center gap-2 text-[#2F4A3E] dark:text-[#E8EFE9] font-bold text-base">
                <Heart className="w-5 h-5 text-[#E8A84C]" />
                <span>Recomeçar faz parte do caminho</span>
              </div>

              <p className="text-xs sm:text-sm text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                Tropeçar não apaga nada do que você já conquistou. Sua melhor sequência continua
                registrada com orgulho e hoje é apenas um dia a mais de aprendizado. Sem culpa.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link to="/registrar" className="flex-1">
                  <RecomecaButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<PenLine className="w-4 h-4" />}
                  >
                    Registrar o que aconteceu
                  </RecomecaButton>
                </Link>
                <Link to="/trocar" className="flex-1">
                  <RecomecaButton
                    variant="secondary"
                    size="sm"
                    fullWidth
                    leftIcon={<Shuffle className="w-4 h-4" />}
                  >
                    Trocar de hábito agora
                  </RecomecaButton>
                </Link>
              </div>
            </RecomecaCard>
          </section>
        )}

        {/* =============================================================
            8. ACESSO RÁPIDO: TROCA DE HÁBITO E TÉCNICAS
           ============================================================= */}
        <section className="pt-2">
          <Link
            to="/trocar"
            className="flex items-center justify-between p-4 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 hover:border-[#7FBFA8] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7FBFA8] text-white flex items-center justify-center">
                <Shuffle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Bateu a vontade agora?
                </span>
                <span className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Timer de 15 minutos, respiração e 6 técnicas guiadas
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6A7A72] group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Aviso legal obrigatório */}
        <LegalNoticeFooter />
      </div>

      {/* MODAL RÁPIDO PARA MARCAR CIGARRO COM HORÁRIO E CONTEXTO */}
      <CigaretteQuickLogModal
        open={isCigaretteModalOpen}
        onOpenChange={setIsCigaretteModalOpen}
        currentCount={cigaretteHabits[0]?.cigarettesToday ?? 0}
        dailyGoal={cigaretteHabits[0]?.dailyLimit ?? 6}
        onConfirm={({ timestamp, context, quantity, note }) => {
          logCigaretteWithDetails({
            habitId: activeCigaretteHabitId,
            timestamp,
            context,
            quantity,
            note,
          })
        }}
      />
    </div>
  )
}
