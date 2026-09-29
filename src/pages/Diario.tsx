import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { MOCK_CALENDAR_DAYS, MOCK_MONTHLY_MIRROR, DayCalendarStatus } from '@/lib/mockData'
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  CalendarDays,
  Clock,
  DollarSign,
  AlertTriangle,
  Heart,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function Diario() {
  // Navegação de mês (base maio 2025)
  const [currentYear, setCurrentYear] = React.useState<number>(2025)
  const [currentMonthIndex, setCurrentMonthIndex] = React.useState<number>(4) // 4 = Maio

  // Dia atualmente selecionado no calendário
  const [selectedDateKey, setSelectedDateKey] = React.useState<string>('2025-05-15')

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonthIndex((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonthIndex((m) => m + 1)
    }
  }

  // Gera dias do mês (1 a 31 em maio)
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate()
  const firstDayWeekIndex = new Date(currentYear, currentMonthIndex, 1).getDay()

  const selectedDayData: DayCalendarStatus | undefined = MOCK_CALENDAR_DAYS[selectedDateKey]

  const getDayStatusColor = (status?: DayCalendarStatus['status']) => {
    switch (status) {
      case 'limpo':
        return 'bg-[#4CAF7D] text-white hover:bg-[#3d9668]'
      case 'reducao':
        return 'bg-[#7FBFA8] text-[#2F4A3E] hover:bg-[#6da98f]'
      case 'dificil':
        return 'bg-[#E8A84C] text-white hover:bg-[#d4943b]'
      case 'recaida':
        return 'bg-[#D96C68] text-white hover:bg-[#c25854]'
      default:
        return 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] hover:bg-[#E8F3EC]'
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Diário e Calendário"
        subtitle="Acompanhe sua caminhada sem culpa. Cada dia conta."
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. CALENDÁRIO MENSAL NAVEGÁVEL
           ============================================================= */}
        <section className="space-y-3">
          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            {/* Cabeçalho do Calendário */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
                className="w-9 h-9 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-center text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#E8F3EC] transition-colors touch-target"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="font-bold text-base text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Próximo mês"
                className="w-9 h-9 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-center text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#E8F3EC] transition-colors touch-target"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <span
                  key={d}
                  className="text-[11px] font-bold text-[#6A7A72] dark:text-[#A0B0A7] py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Grade de dias */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Espaços vazios no início do mês */}
              {Array.from({ length: firstDayWeekIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}

              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const dateKey = `${currentYear}-${(currentMonthIndex + 1)
                  .toString()
                  .padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
                const dayData = MOCK_CALENDAR_DAYS[dateKey]
                const isSelected = selectedDateKey === dateKey

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDateKey(dateKey)}
                    aria-label={`Dia ${dayNum} de ${MONTH_NAMES[currentMonthIndex]}: ${
                      dayData ? dayData.label : 'Sem anotações'
                    }`}
                    className={cn(
                      'h-10 rounded-xl text-xs font-bold tabular-nums transition-all flex flex-col items-center justify-center relative touch-target',
                      getDayStatusColor(dayData?.status),
                      isSelected &&
                        'ring-2 ring-[#2F4A3E] dark:ring-[#8FCCAE] ring-offset-2 ring-offset-[#FDFAF5] dark:ring-offset-[#1C2420] scale-105 z-10',
                    )}
                  >
                    <span>{dayNum}</span>
                    {dayData && (
                      <span className="w-1 h-1 rounded-full bg-white/70 absolute bottom-1" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legenda gentil das cores do design system */}
            <div className="pt-3 border-t border-[#E1E8E2] dark:border-[#2D3A34] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF7D]" />
                <span>Dia limpo</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7FBFA8]" />
                <span>Redução/Meta</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8A84C]" />
                <span>Dia difícil</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D96C68]" />
                <span>Episódio</span>
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. DETALHE DO DIA TOCADO NO CALENDÁRIO
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#7FBFA8]" />
              Detalhe do dia {selectedDateKey}
            </h2>
            <Link
              to="/registrar"
              className="text-xs font-semibold text-[#7FBFA8] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo registro
            </Link>
          </div>

          <RecomecaCard variant="highlight" padding="lg" className="space-y-3">
            {selectedDayData ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-bold text-white',
                      getDayStatusColor(selectedDayData.status),
                    )}
                  >
                    {selectedDayData.status === 'limpo' && 'Dia Limpo e Vitorioso'}
                    {selectedDayData.status === 'reducao' && 'Meta de Redução Mantida'}
                    {selectedDayData.status === 'dificil' && 'Dia Difícil Superado'}
                    {selectedDayData.status === 'recaida' && 'Episódio Registrado Sem Culpa'}
                  </span>
                  <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                    {selectedDateKey}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {selectedDayData.label}
                </p>

                {selectedDayData.notes && (
                  <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                    Anotação: {selectedDayData.notes}
                  </p>
                )}

                {selectedDayData.spentAmount !== undefined && (
                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs">
                    <span className="text-[#6A7A72] dark:text-[#A0B0A7]">Gasto no dia:</span>
                    <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                      R$ {selectedDayData.spentAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {selectedDayData.consequences && (
                  <div className="pt-2 border-t border-[#7FBFA8]/20 text-xs space-y-1">
                    <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                      Consequências anotadas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDayData.consequences.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#FDFAF5] dark:bg-[#1C2420] text-[#6A7A72] dark:text-[#A0B0A7] text-[11px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Nenhum registro específico para esta data. Um dia calmo sem episódios.
                </p>
                <Link to="/registrar">
                  <RecomecaButton variant="secondary" size="sm">
                    Adicionar nota para este dia
                  </RecomecaButton>
                </Link>
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. ESPELHO DO MÊS (TOTAL GASTO, HORAS, COMPARAÇÃO SEM CULPA)
           ============================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Espelho do Mês ({MOCK_MONTHLY_MIRROR.monthName})
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">Visão consciente</span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            {/* Métricas do Mês */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#F4F7F2] dark:bg-[#242E29] space-y-1">
                <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#7FBFA8]" />
                  Total Gasto
                </span>
                <span className="text-xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  R$ {MOCK_MONTHLY_MIRROR.totalSpent.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#4CAF7D] font-semibold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  R$ 45,50 a menos
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F7F2] dark:bg-[#242E29] space-y-1">
                <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                  Tempo em Episódios
                </span>
                <span className="text-xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  {MOCK_MONTHLY_MIRROR.totalHoursSpent} horas
                </span>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Em todo o mês
                </span>
              </div>
            </div>

            {/* Dias de recaída e dias limpos */}
            <div className="p-3 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6A7A72] dark:text-[#A0B0A7] block text-[11px]">
                  Balanço de dias no mês
                </span>
                <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {MOCK_MONTHLY_MIRROR.cleanDaysCount} dias limpos •{' '}
                  {MOCK_MONTHLY_MIRROR.relapseDaysCount} dia de episódio
                </span>
              </div>
              <span className="text-xs font-bold text-[#4CAF7D]">96% livre</span>
            </div>

            {/* Consequências registradas no mês */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Consequências que você identificou:
              </span>
              <div className="space-y-1">
                {MOCK_MONTHLY_MIRROR.recordedConsequences.map((cons, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs"
                  >
                    <span className="text-[#6A7A72] dark:text-[#A0B0A7]">{cons.label}</span>
                    <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                      {cons.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparação suave com o mês anterior */}
            <div className="p-3 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4CAF7D]">
                <Heart className="w-3.5 h-3.5" />
                <span>Comparação gentil</span>
              </div>
              <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                {MOCK_MONTHLY_MIRROR.gentleComparisonMessage}
              </p>
            </div>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
