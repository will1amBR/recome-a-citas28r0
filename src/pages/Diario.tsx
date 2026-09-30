import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaCard,
  MilestoneBadge,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import {
  MOCK_CALENDAR_DAYS,
  MOCK_MONTHLY_MIRROR,
  MOCK_LAST_EPISODE,
  DayCalendarStatus,
} from '@/lib/mockData'
import { useRecomecaStore } from '@/lib/recomecaStore'
import {
  Calendar as CalendarIcon,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Receipt,
  Eye,
  Cigarette,
  Users,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Diario() {
  const { techniqueMetrics, habits, cigaretteLogs, episodeLogs } = useRecomecaStore()

  // Converte o Record de dias mockados em array ordenado
  const calendarDaysList = React.useMemo(() => {
    return Object.values(MOCK_CALENDAR_DAYS).sort((a, b) => a.date.localeCompare(b.date))
  }, [])

  const [selectedDay, setSelectedDay] = React.useState<DayCalendarStatus | null>(
    calendarDaysList[calendarDaysList.length - 1] || null,
  )

  // Encontra hábito de cigarro/tabaco para enriquecer dados do mês
  const tobaccoHabit = habits.find(
    (h) =>
      h.name.toLowerCase().includes('cigarro') ||
      h.name.toLowerCase().includes('tabaco') ||
      (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey)),
  )

  const monthlyPacks = tobaccoHabit?.thisMonthPacks ?? MOCK_MONTHLY_MIRROR.monthlyPacksTotal ?? 9
  const previousMonthPacks =
    tobaccoHabit?.previousMonthPacks ?? MOCK_MONTHLY_MIRROR.previousMonthPacksTotal ?? 12
  const packsDifference = previousMonthPacks - monthlyPacks
  const monthlyCigarettes = monthlyPacks * 20

  // Métricas de momentos em que mais fuma (alimentado por logs reais + mock enriquecido)
  const momentsAnalysis = React.useMemo(() => {
    const baseMoments = [...(MOCK_MONTHLY_MIRROR.topCigaretteMoments || [])]
    const countsMap: Record<string, number> = {}

    // inicializa com base
    baseMoments.forEach((m) => {
      countsMap[m.context] = (countsMap[m.context] || 0) + m.count
    })

    // soma logs recentes da store
    cigaretteLogs.forEach((log) => {
      countsMap[log.context] = (countsMap[log.context] || 0) + log.quantity
    })

    const total = Object.values(countsMap).reduce((a, b) => a + b, 0)
    const sorted = Object.entries(countsMap)
      .map(([context, count]) => ({
        context,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      top: sorted.slice(0, 5),
      highlightMoment: sorted[0]?.context || 'Depois do almoço',
      totalTracked: total,
    }
  }, [cigaretteLogs])

  // Último episódio (ou o salvo na store)
  const latestEpisode = episodeLogs[0] || MOCK_LAST_EPISODE

  const getDayStatusColor = (status: DayCalendarStatus['status']) => {
    switch (status) {
      case 'limpo':
        return 'bg-[#7FBFA8] text-white'
      case 'reducao':
        return 'bg-[#4CAF7D] text-white'
      case 'recaida':
        return 'bg-[#E8A84C] text-white'
      case 'dificil':
        return 'bg-[#D96C68] text-white'
      default:
        return 'bg-[#FDFAF5] dark:bg-[#1C2420] text-[#6A7A72] dark:text-[#A0B0A7] border border-[#E1E8E2] dark:border-[#2D3A34]'
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Diário & Espelho do Mês"
        subtitle="Consciência sem culpa. Veja seus dias, suas técnicas e seu caminho."
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. ESPELHO DO MÊS (CONSCIÊNCIA FINANCEIRA, HORAS E CIGARROS)
           ============================================================= */}
        <section aria-label="Espelho do Mês" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7FBFA8]" />
              Espelho do Mês • {MOCK_MONTHLY_MIRROR.monthName} {MOCK_MONTHLY_MIRROR.year}
            </h2>
            <span className="text-xs font-semibold text-[#4CAF7D] dark:text-[#8FCCAE]">
              {MOCK_MONTHLY_MIRROR.cleanDaysCount} dias livres
            </span>
          </div>

          <RecomecaCard variant="highlight" padding="lg" className="space-y-4">
            {/* Comparação gentil */}
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/20 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-[#4CAF7D] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2F4A3E] dark:text-[#8FCCAE] space-y-1">
                <p className="font-bold">{MOCK_MONTHLY_MIRROR.gentleComparisonMessage}</p>
                <p className="text-[#6A7A72] dark:text-[#A0B0A7]">
                  Sem pressão e sem metas inalcançáveis. Cada escolha feita no presente constrói a
                  sua paz.
                </p>
              </div>
            </div>

            {/* Grid de Métricas Principais */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Total Gasto no Mês
                </span>
                <span className="text-lg font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block mt-0.5">
                  R$ {MOCK_MONTHLY_MIRROR.totalSpent.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#4CAF7D] block">
                  vs R$ {MOCK_MONTHLY_MIRROR.previousMonthSpent.toFixed(2)} mês anterior
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Tempo no Hábito
                </span>
                <span className="text-lg font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block mt-0.5">
                  {MOCK_MONTHLY_MIRROR.totalHoursSpent} horas
                </span>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                  em todo o mês
                </span>
              </div>
            </div>

            {/* =========================================================
                TOTAL DE CIGARROS/MAÇOS DO MÊS E COMPARAÇÃO GENTIL
               ========================================================= */}
            <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                  <Cigarette className="w-4 h-4 text-[#7FBFA8]" />
                  Consumo de Cigarro & Maços no Mês
                </span>
                <span className="text-[11px] font-semibold text-[#4CAF7D]">20 cig. = 1 maço</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                  <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                    Total deste mês
                  </span>
                  <span className="text-base font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    {monthlyPacks} maços (~{monthlyCigarettes} cig.)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                  <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                    Mês anterior
                  </span>
                  <span className="text-base font-bold tabular-nums text-[#6A7A72] dark:text-[#A0B0A7] block">
                    {previousMonthPacks} maços
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#2F4A3E] dark:text-[#8FCCAE] font-semibold text-center pt-1">
                {packsDifference > 0
                  ? `🌿 ${packsDifference} maços a menos que o mês passado. Cada cigarro que você não fumou conta.`
                  : '🌿 Cada cigarro que você não fumou conta. O progresso é construído um dia de cada vez.'}
              </p>
            </div>

            {/* =========================================================
                NOVO: EM QUAIS MOMENTOS VOCÊ MAIS FUMA (SEM JULGAMENTO)
               ========================================================= */}
            <div className="p-3.5 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Padrão de Autoconhecimento
                  </span>
                  <h3 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                    Momentos em que você mais fuma
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#4CAF7D]">sem julgamento</span>
              </div>

              {/* Destaque acolhedor */}
              <div className="p-2.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
                <span>
                  💡 Você costuma fumar mais{' '}
                  <strong>{momentsAnalysis.highlightMoment.toLowerCase()}</strong>. Saber disso te
                  ajuda a se planejar com carinho antes da vontade bater.
                </span>
              </div>

              {/* Barrinhas por contexto */}
              <div className="space-y-2 pt-1">
                {momentsAnalysis.top.map((item) => (
                  <div key={item.context} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] truncate max-w-[220px]">
                        {item.context}
                      </span>
                      <span className="tabular-nums font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                        {item.percentage}% ({item.count} cig.)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E1E8E2] dark:bg-[#2D3A34] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7FBFA8] transition-all"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================
                NOVO: MÉTRICAS DE OUTRAS SUBSTÂNCIAS (DURAÇÃO, DIVISÃO, QUANTIDADE)
               ========================================================= */}
            <div className="p-3.5 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Outras Substâncias • Ritmo e Contexto
                  </span>
                  <h3 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#7FBFA8]" />
                    Duração típica e contexto social
                  </h3>
                </div>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  consciência leve
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      Cocaína / estimulantes
                    </span>
                    <span className="text-[10px] text-[#4CAF7D] font-bold">1 registro</span>
                  </div>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    • Compra típica: <strong>1g</strong>
                  </p>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    • Duração típica: <strong>numa noite</strong>
                  </p>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#7FBFA8]" />
                    <span>Costuma dividir quando usa</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">Álcool</span>
                    <span className="text-[10px] text-[#4CAF7D] font-bold">2 registros</span>
                  </div>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    • Tipo preferido: <strong>chope / cerveja</strong>
                  </p>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    • Duração típica: <strong>3 a 4 horas em saídas</strong>
                  </p>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#7FBFA8]" />
                    <span>Uso predominantemente social</span>
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] italic">
                Tom acolhedor: entender o tempo de uso e a companhia ajuda você a escolher seus
                ambientes com calma.
              </p>
            </div>

            {/* O que funcionou nas fissuras (métricas das técnicas alimentadas pelas ferramentas) */}
            <div className="space-y-2 pt-2 border-t border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  O que funcionou nas fissuras
                </span>
                <span className="text-[11px] text-[#4CAF7D] dark:text-[#8FCCAE] font-medium">
                  Taxa de alívio
                </span>
              </div>

              <div className="space-y-2">
                {techniqueMetrics.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {item.name}
                      </span>
                      <span className="font-bold tabular-nums text-[#4CAF7D] dark:text-[#8FCCAE]">
                        {item.percentagePassed}% alívio ({item.passedWithoutUsingCount} de{' '}
                        {item.count})
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#E1E8E2] dark:bg-[#2D3A34] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7FBFA8] transition-all"
                        style={{ width: `${item.percentagePassed}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex justify-end">
                <Link
                  to="/trocar"
                  className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
                >
                  Praticar mais técnicas no Kit →
                </Link>
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. CALENDÁRIO VISUAL DO MÊS
           ============================================================= */}
        <section aria-label="Calendário do Mês" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#7FBFA8]" />
              Calendário do Mês
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">Toque em um dia</span>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3">
            {/* Grid dos dias registrados */}
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
              {calendarDaysList.map((day) => {
                const isSelected = selectedDay?.date === day.date
                const dayNumber = day.date.split('-')[2]
                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all touch-target relative min-h-[52px]',
                      getDayStatusColor(day.status),
                      isSelected && 'ring-2 ring-[#2F4A3E] dark:ring-[#E8EFE9] scale-105 z-10',
                    )}
                  >
                    <span className="text-[10px] opacity-75">Dia</span>
                    <span className="text-sm font-bold leading-tight">{dayNumber}</span>
                  </button>
                )
              })}
            </div>

            {/* Legenda simples */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#7FBFA8]" />
                <span>Dia livre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4CAF7D]" />
                <span>Na meta de redução</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E8A84C]" />
                <span>Episódio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D96C68]" />
                <span>Dia difícil / superado</span>
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. DETALHE DO DIA SELECIONADO
           ============================================================= */}
        {selectedDay && (
          <section aria-label="Detalhes do dia selecionado" className="space-y-2 animate-fade-in">
            <RecomecaCard
              variant="default"
              padding="lg"
              className="space-y-3 border-l-4 border-l-[#7FBFA8]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                    Detalhes do dia
                  </span>
                  <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    {selectedDay.date}
                  </h3>
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    selectedDay.status === 'limpo'
                      ? 'bg-[#E8F3EC] text-[#4CAF7D]'
                      : selectedDay.status === 'recaida'
                        ? 'bg-[#F4EDE2] text-[#E8A84C]'
                        : selectedDay.status === 'reducao'
                          ? 'bg-[#E8F3EC] text-[#7FBFA8]'
                          : 'bg-[#FBEBEA] text-[#D96C68]',
                  )}
                >
                  {selectedDay.status === 'limpo'
                    ? 'Dia livre'
                    : selectedDay.status === 'recaida'
                      ? 'Houve episódio'
                      : selectedDay.status === 'reducao'
                        ? 'Na meta de redução'
                        : 'Dia desafiador'}
                </span>
              </div>

              <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
                {selectedDay.label}
              </p>

              {selectedDay.notes && (
                <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs space-y-1">
                  <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] font-bold uppercase block">
                    Notas do dia
                  </span>
                  <p className="text-[#2F4A3E] dark:text-[#E8EFE9] italic leading-relaxed">
                    &ldquo;{selectedDay.notes}&rdquo;
                  </p>
                </div>
              )}

              {selectedDay.spentAmount && (
                <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs">
                  <span className="text-[#6A7A72] dark:text-[#A0B0A7]">Gasto anotado:</span>
                  <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                    R$ {selectedDay.spentAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </RecomecaCard>
          </section>
        )}

        {/* =============================================================
            4. HISTÓRICO DE EPISÓDIOS (RECIBO E APRENDIZADOS ANTERIORES)
           ============================================================= */}
        <section aria-label="Histórico de episódios" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Último Episódio Registrado
            </h2>
            <Link to="/registrar" className="text-xs font-semibold text-[#4CAF7D] hover:underline">
              Novo registro +
            </Link>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  {latestEpisode.date} • {latestEpisode.time}
                </span>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {latestEpisode.substanceName}
                </h3>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7]">
                Humor: {latestEpisode.mood}
              </span>
            </div>

            {latestEpisode.amountDescription && (
              <div className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-semibold">
                Consumo: {latestEpisode.amountDescription}
              </div>
            )}

            {latestEpisode.freeText && (
              <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] italic leading-relaxed">
                &ldquo;{latestEpisode.freeText}&rdquo;
              </p>
            )}

            {/* Detalhes de substância (compra, duração, divisão) */}
            {latestEpisode.details && (
              <div className="p-2.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 grid grid-cols-2 gap-2 text-[11px] text-[#2F4A3E] dark:text-[#8FCCAE]">
                {latestEpisode.details.boughtAmount && (
                  <div>
                    <span className="opacity-75 block">Comprou:</span>
                    <strong>{latestEpisode.details.boughtAmount}</strong>
                  </div>
                )}
                {latestEpisode.details.usageDuration && (
                  <div>
                    <span className="opacity-75 block">Duração:</span>
                    <strong>{latestEpisode.details.usageDuration}</strong>
                  </div>
                )}
                {latestEpisode.details.sharedWithOthers && (
                  <div>
                    <span className="opacity-75 block">Dividiu:</span>
                    <strong>
                      {latestEpisode.details.sharedWithOthers === 'sim'
                        ? 'Sim, dividiu'
                        : latestEpisode.details.sharedWithOthers === 'sozinho'
                          ? 'Estava só'
                          : latestEpisode.details.sharedWithOthers}
                    </strong>
                  </div>
                )}
                {latestEpisode.details.alcoholUnits && (
                  <div>
                    <span className="opacity-75 block">Doses / unidades:</span>
                    <strong>{latestEpisode.details.alcoholUnits}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Recibo acoplado */}
            {latestEpisode.receipt && (
              <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#7FBFA8]" />
                    Recibo registrado
                  </span>
                  <span className="tabular-nums">
                    R$ {latestEpisode.receipt.spentAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  <span>Permanência: {latestEpisode.receipt.durationMinutes} min</span>
                  <span>Itens: {latestEpisode.receipt.itemsConsumed.join(', ')}</span>
                </div>
              </div>
            )}

            <div className="pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
              <span>Gatilho: {latestEpisode.triggers.join(', ') || 'Não especificado'}</span>
              <span className="text-[#7FBFA8] dark:text-[#8FCCAE] font-semibold">
                Registrado com honestidade
              </span>
            </div>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
