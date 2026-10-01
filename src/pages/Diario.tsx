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
  TrendingDown,
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
  Copy,
  Check,
  BarChart3,
  CalendarRange,
  Activity,
  Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Diario() {
  const { techniqueMetrics, habits, cigaretteLogs, episodeLogs, isDemoUser, sleepCheckins } =
    useRecomecaStore()

  // Cálculo de dinheiro economizado transparente
  const totalSavedMoney = React.useMemo(() => {
    const mainHabit = habits[0]
    const cleanDays = mainHabit?.currentStreakDays || 19
    const avgDailyCost = 18.5 // estimativa diária de gasto evitado
    return cleanDays * avgDailyCost
  }, [habits])

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

  // Alternância entre visão Mensal e Semanal
  const [reportView, setReportView] = React.useState<'mensal' | 'semanal'>('mensal')

  // Estado de cópia do resumo para médico/terapeuta
  const [copiedSummary, setCopiedSummary] = React.useState<boolean>(false)

  // 1. Dados das últimas 4 semanas (comparação semana a semana)
  const weeklyData = React.useMemo(() => {
    return [
      {
        weekLabel: 'Semana 4 (Esta semana)',
        dates: '08/05 a 15/05',
        cleanDays: 6,
        totalDays: 7,
        consumptionSummary: '4 cigarros, 1 café/dia',
        spent: 0.0,
        trend: 'positivo',
        comparisonText: 'Mais dias livres que a semana anterior. Ritmo consistente.',
      },
      {
        weekLabel: 'Semana 3',
        dates: '01/05 a 07/05',
        cleanDays: 6,
        totalDays: 7,
        consumptionSummary: '19 cigarros na semana, 2 cafés/dia',
        spent: 0.0,
        trend: 'positivo',
        comparisonText: '1 dia com episódio anotado sem culpa, retomada no dia seguinte.',
      },
      {
        weekLabel: 'Semana 2',
        dates: '24/04 a 30/04',
        cleanDays: 7,
        totalDays: 7,
        consumptionSummary: '24 cigarros na semana',
        spent: 0.0,
        trend: 'positivo',
        comparisonText: 'Semana 100% de dias limpos em álcool.',
      },
      {
        weekLabel: 'Semana 1',
        dates: '17/04 a 23/04',
        cleanDays: 5,
        totalDays: 7,
        consumptionSummary: '3 chopes em saída, 32 cigarros',
        spent: 114.5,
        trend: 'neutro',
        comparisonText: 'Semana de início do acompanhamento consciente.',
      },
    ]
  }, [])

  // 2. Relatório de fissuras mais rico: períodos do dia (manhã, tarde, noite, madrugada)
  const cravingDayPeriods = React.useMemo(() => {
    return [
      {
        period: 'Manhã',
        range: '06h - 12h',
        count: 4,
        percentage: 14,
        peakReason: 'Com o primeiro café',
      },
      {
        period: 'Tarde',
        range: '12h - 18h',
        count: 12,
        percentage: 43,
        peakReason: 'Depois do almoço e pausas',
      },
      {
        period: 'Noite',
        range: '18h - 00h',
        count: 10,
        percentage: 36,
        peakReason: 'Transição trabalho / casa',
      },
      {
        period: 'Madrugada',
        range: '00h - 06h',
        count: 2,
        percentage: 7,
        peakReason: 'Insônia ocasional',
      },
    ]
  }, [])

  const totalCravingsMonth = cravingDayPeriods.reduce((acc, p) => acc + p.count, 0)

  // 3. Tendência gentil do mês baseada nos dados
  const monthlyTrend = React.useMemo(() => {
    const isCleanHigh = MOCK_MONTHLY_MIRROR.cleanDaysCount >= 20
    const spentReduced = MOCK_MONTHLY_MIRROR.totalSpent < MOCK_MONTHLY_MIRROR.previousMonthSpent

    if (isCleanHigh && spentReduced) {
      return {
        type: 'progresso',
        phrase:
          'Este mês você registrou menos episódios que o passado. Cada registro é um passo de autoconhecimento.',
        subtext: 'Seus dias livres aumentaram e seu gasto diminuiu R$ 45,50 com tranquilidade.',
      }
    } else if (isCleanHigh) {
      return {
        type: 'estavel',
        phrase:
          'Um mês de ritmo seguro. Você manteve a maior parte dos seus dias livres e seguiu cuidando de você.',
        subtext: 'A constância é mais importante que a velocidade.',
      }
    } else {
      return {
        type: 'acolhimento',
        phrase: 'Foi um mês mais difícil. Registrar já é cuidar de você.',
        subtext: 'Recomeçar faz parte do caminho. Seus passos anteriores continuam com você.',
      }
    }
  }, [])

  // 4. Gerar resumo copiável para levar ao médico ou terapeuta
  const generateDoctorSummary = () => {
    const sleepSummaryText =
      sleepCheckins.length > 0
        ? sleepCheckins
            .slice(0, 3)
            .map(
              (s) =>
                `• Semana ${s.semana_ref}: Sono ${s.resposta === 'bem' ? 'bom' : s.resposta === 'mais_ou_menos' ? 'mais ou menos' : s.resposta === 'dificil' ? 'difícil' : 'pior que o normal'}${s.nota ? ` ("${s.nota}")` : ''}`,
            )
            .join('\n')
        : '• Nenhum registro recente de sono anotado.'

    const lines = [
      `--- RECOMEÇA • RESUMO DE ACOMPANHAMENTO ---`,
      `Período: ${MOCK_MONTHLY_MIRROR.monthName} de ${MOCK_MONTHLY_MIRROR.year}`,
      `Aviso: Registro pessoal de autocuidado. Não substitui consulta médica.`,
      ``,
      `SÍNTESE DO MÊS:`,
      `• Dias livres no mês: ${MOCK_MONTHLY_MIRROR.cleanDaysCount} dias`,
      `• Dias com episódios registrados: ${MOCK_MONTHLY_MIRROR.relapseDaysCount} dia(s)`,
      `• Gasto total com substâncias no mês: R$ ${MOCK_MONTHLY_MIRROR.totalSpent.toFixed(2)} (mês anterior: R$ ${MOCK_MONTHLY_MIRROR.previousMonthSpent.toFixed(2)})`,
      `• Total economizado estimado: R$ ${totalSavedMoney.toFixed(2)}`,
      ``,
      `HISTÓRICO RECENTE DE SONO (Últimas semanas):`,
      sleepSummaryText,
      ``,
      `HÁBITOS EM ACOMPANHAMENTO:`,
      ...habits.map((h) => {
        const metaStr = h.dailyGoalCustom ? ` | Meta: ${h.dailyGoalCustom}` : ''
        return `• ${h.name} (${h.goalType === 'parar' ? 'Parar' : 'Reduzir'}): ${h.currentStreakDays} dias limpos atuais, melhor sequência ${h.bestStreakDays} dias${metaStr}`
      }),
      ``,
      `PADRÃO DE FISSURAS (TOTAL: ${totalCravingsMonth}):`,
      ...cravingDayPeriods.map(
        (p) =>
          `• ${p.period} (${p.range}): ${p.count} fissuras (${p.percentage}%) - Gatilho: ${p.peakReason}`,
      ),
      ``,
      `EFICÁCIA DAS TÉCNICAS PRATICADAS:`,
      ...techniqueMetrics
        .slice(0, 4)
        .map(
          (t) =>
            `• ${t.name}: ${t.percentagePassed}% de alívio sem uso (${t.passedWithoutUsingCount} de ${t.count})`,
        ),
      ``,
      `ÚLTIMO EPISÓDIO REGISTRADO:`,
      `• Data: ${latestEpisode.date} às ${latestEpisode.time} (${latestEpisode.substanceName})`,
      `• Quantidade: ${latestEpisode.amountDescription || 'Não detalhada'}`,
      `• Gatilhos anotados: ${latestEpisode.triggers.join(', ') || 'Nenhum'}`,
      `• Consequência: ${latestEpisode.whatHappenedAfter}`,
      `-----------------------------------------`,
    ]
    return lines.join('\n')
  }

  const handleCopyDoctorSummary = async () => {
    const text = generateDoctorSummary()
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 3000)
    } catch {
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 3000)
    }
  }

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
        {/* Aviso de modo demonstração quando aplicável */}
        {isDemoUser && (
          <div className="p-3 rounded-2xl bg-[#FDFAF5] dark:bg-[#202723] border border-[#7FBFA8]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#E8A84C]/20 text-[#E8A84C] font-bold text-[10px] uppercase">
                Demonstração
              </span>
              <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                Visualizando dados de exemplo da usuária Camila
              </span>
            </div>
            <Link
              to="/login"
              className="font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
            >
              Entrar / Salvar meus dados →
            </Link>
          </div>
        )}

        {/* =============================================================
            SELETOR DE VISÃO: MENSAL vs SEMANAL
           ============================================================= */}
        <section aria-label="Seletor de visão de período" className="space-y-2">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30">
            <button
              type="button"
              onClick={() => setReportView('mensal')}
              className={cn(
                'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target flex items-center justify-center gap-1.5',
                reportView === 'mensal'
                  ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-sm'
                  : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#7FBFA8]" />
              <span>Espelho Mensal</span>
            </button>
            <button
              type="button"
              onClick={() => setReportView('semanal')}
              className={cn(
                'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target flex items-center justify-center gap-1.5',
                reportView === 'semanal'
                  ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-sm'
                  : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
              )}
            >
              <CalendarRange className="w-3.5 h-3.5 text-[#7FBFA8]" />
              <span>Visão Semanal (4 sem.)</span>
            </button>
          </div>
        </section>

        {/* =============================================================
            TENDÊNCIA GENTIL DO PERÍODO
           ============================================================= */}
        <section aria-label="Tendência gentil">
          <div className="p-4 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Tendência do Período
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-snug">
                {monthlyTrend.phrase}
              </p>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                {monthlyTrend.subtext}
              </p>
            </div>
          </div>
        </section>

        {/* =============================================================
            VISÃO SEMANAL (ÚLTIMAS 4 SEMANAS COM COMPARAÇÃO SEMANA A SEMANA)
           ============================================================= */}
        {reportView === 'semanal' && (
          <section
            aria-label="Visão semanal das últimas 4 semanas"
            className="space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                  <CalendarRange className="w-4 h-4 text-[#7FBFA8]" />
                  Comparação Semana a Semana
                </h2>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Últimas 4 semanas com consumo, dias limpos e gastos
                </p>
              </div>
              <span className="text-xs font-semibold text-[#4CAF7D]">4 semanas</span>
            </div>

            <div className="space-y-3">
              {weeklyData.map((week, idx) => (
                <RecomecaCard
                  key={week.weekLabel}
                  variant="default"
                  padding="md"
                  className={cn(
                    'space-y-2.5 border-l-4',
                    idx === 0 ? 'border-l-[#4CAF7D]' : 'border-l-[#7FBFA8]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {week.weekLabel}
                      </h3>
                      <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        {week.dates}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#8FCCAE]">
                      {week.cleanDays} de {week.totalDays} dias limpos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Consumo registrado
                      </span>
                      <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block truncate">
                        {week.consumptionSummary}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Gasto na semana
                      </span>
                      <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                        R$ {week.spent.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2F4A3E] dark:text-[#8FCCAE] font-medium leading-relaxed pt-0.5">
                    💡 {week.comparisonText}
                  </p>
                </RecomecaCard>
              ))}
            </div>
          </section>
        )}

        {/* =============================================================
            MÉTRICAS POR VÍCIO (PARA CADA SUBSTÂNCIA ATIVA)
           ============================================================= */}
        <section aria-label="Métricas detalhadas por vício ativo" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#7FBFA8]" />
              Métricas por Vício Ativo
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              {habits.length} substâncias
            </span>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => {
              const isTobacco =
                habit.name.toLowerCase().includes('cigarro') ||
                habit.name.toLowerCase().includes('tabaco')
              const isAlcohol = habit.name.toLowerCase().includes('álcool')
              const isCoffee = habit.name.toLowerCase().includes('café')

              const monthlyConsumption = isTobacco
                ? `${monthlyPacks} maços (~${monthlyCigarettes} cigarros)`
                : isAlcohol
                  ? '1 episódio registrado no mês'
                  : isCoffee
                    ? '1 a 2 xícaras/dia (na meta)'
                    : 'Acompanhamento sob controle'

              const habitSpent = isAlcohol ? 114.5 : isTobacco ? monthlyPacks * 13.0 : 0.0

              const comparisonText = isTobacco
                ? '3 maços a menos que o mês passado. Ritmo consistente.'
                : isAlcohol
                  ? 'R$ 45,50 a menos gastos que no mês anterior.'
                  : 'Consumo dentro do limite planejado com calma.'

              return (
                <RecomecaCard
                  key={habit.id}
                  variant="default"
                  padding="md"
                  className="space-y-3 border-l-4 border-l-[#7FBFA8]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                        {habit.category} • {habit.goalType === 'parar' ? 'Parar' : 'Reduzir'}
                      </span>
                      <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {habit.name}
                      </h3>
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#8FCCAE]">
                      {habit.dailyGoalCustom || 'Meta livre'}
                    </span>
                  </div>

                  {/* 4 indicadores do vício */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Dias limpos agora
                      </span>
                      <span className="text-base font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {habit.currentStreakDays}d
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Melhor sequência
                      </span>
                      <span className="text-base font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {habit.bestStreakDays}d
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Dias livres no mês
                      </span>
                      <span className="text-base font-bold tabular-nums text-[#4CAF7D]">
                        {habit.cleanDaysThisMonth}d
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block uppercase font-bold">
                        Gasto estimado
                      </span>
                      <span className="text-base font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                        R$ {habitSpent.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Consumo do mês e comparação */}
                  <div className="p-2.5 rounded-xl bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border border-[#7FBFA8]/30 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6A7A72] dark:text-[#A0B0A7]">Consumo no mês:</span>
                      <strong className="text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {monthlyConsumption}
                      </strong>
                    </div>
                    <p className="text-[11px] text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold pt-0.5">
                      ✓ {comparisonText}
                    </p>
                  </div>
                </RecomecaCard>
              )
            })}
          </div>
        </section>

        {/* =============================================================
            RELATÓRIO DE FISSURAS MAIS RICO (HORÁRIOS, GRÁFICO CSS, TÉCNICAS E TAXA)
           ============================================================= */}
        <section aria-label="Relatório rico de fissuras" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#7FBFA8]" />
                Relatório de Fissuras & Técnicas
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                {totalCravingsMonth} fissuras mapeadas este mês
              </p>
            </div>
            <span className="text-xs font-semibold text-[#4CAF7D]">Horários & Alívio</span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            {/* Gráfico de barras simples em CSS puro para períodos do dia */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Em quais períodos do dia as fissuras acontecem:
              </span>

              <div className="space-y-2.5 pt-1">
                {cravingDayPeriods.map((period) => (
                  <div key={period.period} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {period.period}{' '}
                        <span className="text-[11px] font-normal text-[#6A7A72] dark:text-[#A0B0A7]">
                          ({period.range})
                        </span>
                      </span>
                      <span className="tabular-nums font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                        {period.count} fissuras ({period.percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#E1E8E2] dark:bg-[#2D3A34] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7FBFA8] transition-all"
                        style={{ width: `${Math.min(100, period.percentage * 2)}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                      Gatilho comum: {period.peakReason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Técnicas usadas e taxa de "onda passou sem usar" */}
            <div className="space-y-2.5 pt-3 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Técnicas usadas e taxa &ldquo;onda passou sem usar&rdquo;:
                </span>
                <span className="text-[10px] text-[#4CAF7D] font-bold">Eficácia real</span>
              </div>

              <div className="space-y-2">
                {techniqueMetrics.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] truncate max-w-[200px]">
                        {tech.name}
                      </span>
                      <span className="font-bold tabular-nums text-[#4CAF7D] dark:text-[#8FCCAE]">
                        {tech.percentagePassed}% alívio
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#E1E8E2] dark:bg-[#2D3A34] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4CAF7D] transition-all"
                        style={{ width: `${tech.percentagePassed}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      <span>{tech.passedWithoutUsingCount} passaram sem usar</span>
                      <span>
                        {tech.usedAfterCount} uso após • Total: {tech.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            RELATÓRIO DE GASTOS (TOTAL POR VÍCIO, COMPARAÇÃO, NEUTRO SEM MORALIZAR)
           ============================================================= */}
        <section aria-label="Relatório neutro de gastos" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#7FBFA8]" />
              Relatório Financeiro do Mês
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">Número neutro</span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-3">
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Total gasto no mês
                </span>
                <span className="text-xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                  R$ {MOCK_MONTHLY_MIRROR.totalSpent.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Mês anterior
                </span>
                <span className="text-sm font-bold tabular-nums text-[#6A7A72] dark:text-[#A0B0A7]">
                  R$ {MOCK_MONTHLY_MIRROR.previousMonthSpent.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total do mês por vício */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Detalhamento por substância no mês:
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] flex items-center justify-between">
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">Álcool</span>
                  <span className="tabular-nums font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    R$ 114,50 (1 episódio anotado)
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] flex items-center justify-between">
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">Cigarro</span>
                  <span className="tabular-nums font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    R$ 117,00 (9 maços no mês)
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] flex items-center justify-between">
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">Café</span>
                  <span className="tabular-nums font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    R$ 0,00 (consumo doméstico)
                  </span>
                </div>
              </div>
            </div>

            {/* Comparação neutra sem moralizar nem dizer o que faria com o dinheiro */}
            <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
              <span>
                Comparação: <strong>R$ 45,50 a menos</strong> em relação ao mês anterior. Os dados
                ficam guardados exclusivamente no seu dispositivo para você acompanhar sua evolução.
              </span>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            EXPORTAR / COMPARTILHAR RESUMO DO MÊS (TEXTO COPIÁVEL PARA MÉDICO/TERAPEUTA)
           ============================================================= */}
        <section aria-label="Exportar resumo para médico ou terapeuta" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#7FBFA8]" />
                Relatório para o Médico / Terapeuta
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Gera um texto resumo completo para você copiar e levar para sua consulta
              </p>
            </div>
            <span className="text-xs font-semibold text-[#4CAF7D]">Texto copiável</span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-3">
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Resumo do Mês ({MOCK_MONTHLY_MIRROR.monthName})
                </span>
                <button
                  type="button"
                  onClick={handleCopyDoctorSummary}
                  className="px-3 py-1.5 rounded-xl bg-[#7FBFA8] hover:bg-[#6DA98F] text-white font-bold text-xs flex items-center gap-1.5 transition-all touch-target"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-2.5 rounded-lg bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[11px] text-[#2F4A3E] dark:text-[#E8EFE9] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {generateDoctorSummary()}
              </pre>

              <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1">
                Cole no WhatsApp do seu profissional de confiança ou leve impresso/anotado. Sem
                julgamentos e sem expor dados desnecessários.
              </p>
            </div>
          </RecomecaCard>
        </section>

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

              {/* CARD DE DINHEIRO ECONOMIZADO */}
              <div className="col-span-2 p-3.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#4CAF7D]/40 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4CAF7D] dark:text-[#8FCCAE]">
                    Dinheiro Economizado
                  </span>
                  <span className="text-xs font-bold text-[#4CAF7D] bg-white dark:bg-[#1C2420] px-2 py-0.5 rounded-full">
                    Recurso protegido
                  </span>
                </div>
                <div className="text-xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9] tabular-nums">
                  R$ {totalSavedMoney.toFixed(2)}
                </div>
                <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Calculado pela média diária dos seus registros × dias limpos desde o início. Uma
                  estimativa honesta para você ver o valor voltando para sua vida.
                  {totalSavedMoney >= 100 && (
                    <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block mt-0.5">
                      💡 Dá para cerca de {Math.floor(totalSavedMoney / 35)} meses de streaming ou
                      momentos de lazer com quem você ama.
                    </span>
                  )}
                </p>
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
