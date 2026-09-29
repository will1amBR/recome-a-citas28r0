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
} from '@/components/recomeca'
import {
  MOCK_USER,
  MOCK_TRACKED_HABITS,
  DAILY_INSPIRATION_PHRASES,
  TrackedHabit,
} from '@/lib/mockData'
import {
  CalendarDays,
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Hoje() {
  const navigate = useNavigate()

  // Lista de hábitos acompanhados
  const [habits, setHabits] = React.useState<TrackedHabit[]>(MOCK_TRACKED_HABITS)

  // Mensagem diária acolhedora sorteada
  const [phraseIndex, setPhraseIndex] = React.useState<number>(0)

  // Estado do Check-in diário (3 toques)
  const [checkinMood, setCheckinMood] = React.useState<string>('bem')
  const [usedToday, setUsedToday] = React.useState<'nao' | 'sim' | 'reduzido'>('nao')
  const [usedAmountInput, setUsedAmountInput] = React.useState<string>('')
  const [feltCraving, setFeltCraving] = React.useState<'nao' | 'sim'>('nao')
  const [checkinSaved, setCheckinSaved] = React.useState<boolean>(false)

  // Controle de consumo do hábito de redução (ex: café)
  const reductionHabit = habits.find((h) => h.goalType === 'reduzir')
  const [reductionCount, setReductionCount] = React.useState<number>(
    reductionHabit?.dailyCurrent ?? 1,
  )

  const handleNextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % DAILY_INSPIRATION_PHRASES.length)
  }

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckinSaved(true)
  }

  const handleIncrementReduction = () => {
    setReductionCount((c) => c + 1)
  }

  const handleDecrementReduction = () => {
    setReductionCount((c) => Math.max(0, c - 1))
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* Header Mobile Leve */}
      <ScreenHeader
        title={`Olá, ${MOCK_USER.preferredGreeting}`}
        subtitle="Um dia de cada vez. Seu progresso continua seguro."
        rightAction={
          <button
            type="button"
            onClick={handleNextPhrase}
            aria-label="Ver outra frase de incentivo"
            className="w-9 h-9 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center hover:bg-[#7FBFA8]/20 transition-colors touch-target"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-6">
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
            2. CONTADOR GRANDE DE DIAS LIMPOS (Por substância)
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
                  {/* Topo do Card */}
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

                  {/* Número Gigante Mobile / Tablet */}
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

                  {/* Histórico que NÃO zera tudo: Melhor sequência e dias no mês */}
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

                  {/* Barra de Progresso até o próximo marco */}
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
            3. META DO DIA PARA QUEM REDUZ
           ============================================================= */}
        {reductionHabit && (
          <section className="space-y-2">
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
                    onClick={handleDecrementReduction}
                    aria-label="Diminuir uma unidade"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-7 text-center font-bold tabular-nums text-sm">
                    {reductionCount}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementReduction}
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
                  Math.round((reductionCount / (reductionHabit.dailyLimit || 1)) * 100),
                )}
                size="sm"
                label={`${reductionCount} de ${reductionHabit.dailyLimit} ${reductionHabit.unit}`}
                showPercentage
                helperText={
                  reductionCount <= (reductionHabit.dailyLimit || 2)
                    ? 'Dentro da meta combinada com calma.'
                    : 'Passou um pouco da meta? Seja gentil com você. Amanhã é outro dia.'
                }
              />
            </RecomecaCard>
          </section>
        )}

        {/* =============================================================
            4. CHECK-IN DIÁRIO EM 3 TOQUES
           ============================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Check-in de Hoje
            </h2>
            <span className="text-xs text-[#4CAF7D] dark:text-[#5DBF8C] font-semibold flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Rápido e discreto
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
                    Obrigado por tirar esse minutinho para olhar para você. Esse cuidado diário faz
                    toda a diferença.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckinSaved(false)}
                  className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] underline pt-1"
                >
                  Editar respostas
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveCheckin} className="space-y-5">
                {/* Toque 1: Como você está? */}
                <div className="space-y-1.5">
                  <MoodSelector
                    value={checkinMood}
                    onChange={(m) => setCheckinMood(m)}
                    label="1. Como você está se sentindo hoje?"
                  />
                </div>

                {/* Toque 2: Usou hoje? */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    2. Usou alguma substância hoje?
                  </label>
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
                      Episódio
                    </button>
                  </div>

                  {usedToday === 'sim' && (
                    <div className="pt-1 animate-fade-in">
                      <input
                        type="text"
                        placeholder="Quanto usou? (opcional, sem julgamento)"
                        value={usedAmountInput}
                        onChange={(e) => setUsedAmountInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                      />
                    </div>
                  )}
                </div>

                {/* Toque 3: Teve vontade? */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    3. Bateu vontade ou fissura em algum momento?
                  </label>
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
                      Não senti
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
                      Sim, bateu vontade
                    </button>
                  </div>
                </div>

                <RecomecaButton variant="primary" size="md" fullWidth type="submit">
                  Guardar check-in de hoje
                </RecomecaButton>
              </form>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            5. CARD "RECOMEÇAR FAZ PARTE" (SE MARCOU QUE USOU HOJE)
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
                registrada com orgulho (<strong>34 dias</strong>) e hoje é apenas um dia a mais de
                aprendizado.
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
            6. ACESSO RÁPIDO: TROCA DE HÁBITO
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
                  Timer de 15 minutos e respiração
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6A7A72] group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Aviso legal obrigatório */}
        <LegalNoticeFooter />
      </div>
    </div>
  )
}
