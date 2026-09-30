import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  ProgressBar,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { DailyScheduleTask, DayTaskCategory } from '@/lib/mockData'
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Zap,
  Heart,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Plano() {
  const navigate = useNavigate()
  const {
    scheduleTasks,
    taskCompletionLogs,
    todayCompletedTaskIds,
    toggleTaskCompletionToday,
    addCustomScheduleTask,
    removeScheduleTask,
    resetScheduleTasksToDefault,
    habits,
    activeHabitId,
  } = useRecomecaStore()

  // Aba ativa: 'hoje' ou 'semana'
  const [activeTab, setActiveTab] = React.useState<'hoje' | 'semana'>('hoje')

  // Filtro de categoria de tarefa ('todas' | 'casa' | 'corpo' | 'mente' | 'conexao')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('todas')

  // Estado do formulário de nova tarefa customizada
  const [isAddingTask, setIsAddingTask] = React.useState<boolean>(false)
  const [newTitle, setNewTitle] = React.useState<string>('')
  const [newSubtitle, setNewSubtitle] = React.useState<string>('')
  const [newCategory, setNewCategory] = React.useState<DayTaskCategory>('casa')
  const [newIsPhysical, setNewIsPhysical] = React.useState<boolean>(true)

  // Mensagem instantânea de reforço ao marcar uma tarefa
  const [recentCelebration, setRecentCelebration] = React.useState<string | null>(null)

  // Hábitos ativos
  const activeHabit = React.useMemo(() => {
    return habits.find((h) => h.id === activeHabitId) || habits[0]
  }, [habits, activeHabitId])

  const isAlcoholUser = React.useMemo(() => {
    return habits.some(
      (h) =>
        h.name.toLowerCase().includes('álcool') ||
        h.name.toLowerCase().includes('alcool') ||
        h.substanceKey === 'alcool',
    )
  }, [habits])

  // Contagem do dia
  const totalTasks = scheduleTasks.length
  const completedCount = todayCompletedTaskIds.length
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  // Tarefas filtradas por categoria
  const filteredTasks = React.useMemo(() => {
    if (selectedCategory === 'todas') return scheduleTasks
    return scheduleTasks.filter((t) => t.category === selectedCategory)
  }, [scheduleTasks, selectedCategory])

  // Lógica de toggle com feedback gentil
  const handleToggle = (taskId: string) => {
    const res = toggleTaskCompletionToday(taskId)
    if (res.completed) {
      setRecentCelebration(res.message)
      setTimeout(() => setRecentCelebration(null), 4500)
    }
  }

  // Criar nova tarefa
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addCustomScheduleTask({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory,
      isPhysicalAlternativeToCravings: newIsPhysical,
    })
    setNewTitle('')
    setNewSubtitle('')
    setIsAddingTask(false)
  }

  // Estatísticas da semana (últimos 7 dias)
  const weekStats = React.useMemo(() => {
    const today = new Date()
    const days: { dateStr: string; label: string; count: number }[] = []
    const weekTaskCounts: Record<
      string,
      { title: string; count: number; category: DayTaskCategory }
    > = {}

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      const dayNum = d.getDate()
      const label = `${dayName}, ${dayNum}`

      const dayLogs = taskCompletionLogs.filter((l) => l.date === dateStr)
      days.push({
        dateStr,
        label,
        count: dayLogs.length,
      })

      dayLogs.forEach((log) => {
        const existing = weekTaskCounts[log.taskId]
        const taskObj = scheduleTasks.find((t) => t.id === log.taskId)
        if (existing) {
          existing.count += 1
        } else {
          weekTaskCounts[log.taskId] = {
            title: log.taskTitle || taskObj?.title || 'Hábito saudável',
            count: 1,
            category: taskObj?.category || 'corpo',
          }
        }
      })
    }

    const topHabits = Object.entries(weekTaskCounts)
      .map(([taskId, data]) => ({ taskId, ...data }))
      .sort((a, b) => b.count - a.count)

    const totalCompletionsThisWeek = days.reduce((acc, d) => acc + d.count, 0)

    return {
      days,
      topHabits,
      totalCompletionsThisWeek,
    }
  }, [taskCompletionLogs, scheduleTasks])

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* Toast flutuante de reforço imediato */}
      {recentCelebration && (
        <aside
          aria-label="Reforço de recompensa"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm p-3.5 rounded-2xl bg-[#2F4A3E] text-white dark:bg-[#E8F3EC] dark:text-[#1C2420] shadow-xl flex items-center justify-between gap-2 border border-white/20 animate-fade-in"
        >
          <div className="flex items-center gap-2 text-xs font-bold min-w-0">
            <Sparkles className="w-4 h-4 text-[#7FBFA8] dark:text-[#4CAF7D] shrink-0" />
            <span className="truncate">{recentCelebration}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentCelebration(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100 shrink-0"
          >
            Fechar
          </button>
        </aside>
      )}

      <ScreenHeader
        title="Plano do Dia & Rotina"
        subtitle="Ações simples que geram dopamina saudável, tiram o peso mental e ocupam o lugar do vício."
        backHref="/hoje"
        rightAction={
          <button
            type="button"
            onClick={() => setIsAddingTask((v) => !v)}
            aria-label="Adicionar tarefa customizada"
            className="w-9 h-9 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center hover:bg-[#7FBFA8]/20 transition-colors touch-target"
          >
            <Plus className="w-4 h-4" />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            SELETOR DE ABAS: PLANO DO DIA vs. SEMANA / ROTINA
           ============================================================= */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border border-[#7FBFA8]/30">
          <button
            type="button"
            onClick={() => setActiveTab('hoje')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target text-center flex items-center justify-center gap-1.5',
              activeTab === 'hoje'
                ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#8FCCAE] shadow-sm'
                : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tarefas de Hoje</span>
            <span className="text-[10px] tabular-nums font-semibold opacity-75">
              ({completedCount}/{totalTasks})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('semana')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target text-center flex items-center justify-center gap-1.5',
              activeTab === 'semana'
                ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#8FCCAE] shadow-sm'
                : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semana & Hábitos</span>
          </button>
        </div>

        {/* =============================================================
            CONTEXTO COM O VÍCIO: SUGESTÃO CONTEXTUAL (EX: ÁLCOOL / BAR)
           ============================================================= */}
        {isAlcoholUser && (
          <aside
            aria-label="Sugestão contextual para momentos de vontade de beber"
            className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1 min-w-0 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Na hora da vontade de ir beber: que tal o parque ou a academia?
                </span>
              </div>
              <p className="text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Essas atividades dão preguiça, mas a recompensa chega: lavar o chão, caminhar no
                parque ou malhar geram dopamina real e aliviam a ansiedade sem a ressaca de amanhã.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('corpo')}
                  className="text-[11px] font-bold text-[#4CAF7D] dark:text-[#8FCCAE] underline hover:opacity-80"
                >
                  Ver tarefas físicas do plano →
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* =============================================================
            ABA 1: PLANO DO DIA (TAREFAS DIÁRIAS)
           ============================================================= */}
        {activeTab === 'hoje' && (
          <div className="space-y-5 animate-fade-in">
            {/* Card de Progresso Calmo do Dia */}
            <RecomecaCard variant="highlight" padding="lg" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Cronograma de autocuidado
                  </span>
                  <h2 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Progresso de hoje
                  </h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-white dark:bg-[#1C2420] border border-[#7FBFA8]/40">
                  <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] tabular-nums">
                    {completedCount} de {totalTasks} feitas hoje
                  </span>
                </div>
              </div>

              <ProgressBar
                value={progressPercent}
                size="md"
                label={`${completedCount} de ${totalTasks} concluídas`}
                showPercentage
                helperText={
                  completedCount >= 3
                    ? 'Você usou o dia a seu favor hoje. Sensação de tudo em ordem faz bem.'
                    : completedCount > 0
                      ? 'Um passo por dia já conta. A preguiça é normal, a recompensa chega depois.'
                      : 'Um passo por dia já conta. Escolha uma tarefa pequena para começar com calma.'
                }
              />

              {/* Cartão de fechamento gentil quando conclui 3+ ou mais tarefas */}
              {completedCount >= 3 && (
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#1C2420]/80 border border-[#4CAF7D]/40 space-y-1 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Hoje você cuidou da casa e de você.</span>
                  </div>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                    É assim que se constrói um recomeço sólido: ocupando o tempo com ações reais que
                    deixam você leve ao deitar a cabeça no travesseiro.
                  </p>
                </div>
              )}
            </RecomecaCard>

            {/* Filtros de Categoria */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  Filtrar tarefas
                </span>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Toque grande • Fácil de marcar
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'todas', label: 'Todas as tarefas' },
                  { id: 'casa', label: '🏠 Casa e limpeza' },
                  { id: 'corpo', label: '🏃 Corpo e movimento' },
                  { id: 'mente', label: '🧠 Mente e descanso' },
                  { id: 'conexao', label: '🤝 Conexão' },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all touch-target',
                        isSelected
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] shadow-sm'
                          : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                      )}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Formulário para Adicionar Tarefa Customizada */}
            {isAddingTask && (
              <form
                onSubmit={handleCreateTask}
                className="p-4 rounded-2xl bg-white dark:bg-[#1C2420] border-2 border-dashed border-[#7FBFA8] space-y-3.5 animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-[#E1E8E2] dark:border-[#2D3A34] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Adicionar sua própria tarefa
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-xs text-[#6A7A72] hover:underline"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    O que você quer fazer hoje?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dar banho no cachorro, regar as plantas, 20 min de leitura..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                    Subtítulo ou dica rápida (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: No fim da tarde, sem pressa"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                      Categoria
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as DayTaskCategory)}
                      className="w-full px-2.5 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    >
                      <option value="casa">Casa e limpeza</option>
                      <option value="corpo">Corpo e movimento</option>
                      <option value="mente">Mente e descanso</option>
                      <option value="conexao">Conexão humana</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                      É ação física contra a vontade?
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewIsPhysical((v) => !v)}
                      className={cn(
                        'w-full py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center',
                        newIsPhysical
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] text-[#4CAF7D]'
                          : 'bg-[#FDFAF5] dark:bg-[#242E29] border-[#E1E8E2] text-[#6A7A72]',
                      )}
                    >
                      {newIsPhysical ? '✓ Sim, é física' : 'Não'}
                    </button>
                  </div>
                </div>

                <RecomecaButton variant="primary" size="sm" fullWidth type="submit">
                  Salvar tarefa no meu plano
                </RecomecaButton>
              </form>
            )}

            {/* Lista de Tarefas do Plano com Checkbox Grande e Toque Confortável */}
            <div className="space-y-2.5">
              {filteredTasks.map((task) => {
                const isCompleted = todayCompletedTaskIds.includes(task.id)

                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggle(task.id)}
                    className={cn(
                      'p-3.5 rounded-2xl border transition-all cursor-pointer touch-target select-none flex items-start gap-3.5',
                      isCompleted
                        ? 'bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border-[#7FBFA8]'
                        : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/60 shadow-sm',
                    )}
                  >
                    {/* Checkbox grande fácil de tocar (>= 44px de área de toque) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggle(task.id)
                      }}
                      aria-label={`Marcar tarefa ${task.title} como ${isCompleted ? 'não feita' : 'feita'}`}
                      className={cn(
                        'w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all touch-target mt-0.5',
                        isCompleted
                          ? 'bg-[#4CAF7D] text-white shadow-sm scale-95'
                          : 'bg-white dark:bg-[#242E29] border-2 border-[#7FBFA8] text-transparent hover:border-[#4CAF7D]',
                      )}
                    >
                      <Check className={cn('w-5 h-5 stroke-[3px]', isCompleted && 'text-white')} />
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={cn(
                              'text-sm font-bold leading-snug',
                              isCompleted
                                ? 'line-through text-[#6A7A72] dark:text-[#A0B0A7]'
                                : 'text-[#2F4A3E] dark:text-[#E8EFE9]',
                            )}
                          >
                            {task.title}
                          </h3>
                          {task.subtitle && (
                            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                              {task.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Botão de remover tarefa (se for customizada ou se quiser limpar) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeScheduleTask(task.id)
                          }}
                          aria-label={`Remover tarefa ${task.title}`}
                          className="w-7 h-7 rounded-lg text-[#6A7A72]/60 hover:text-[#D96C68] hover:bg-[#D96C68]/10 flex items-center justify-center transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mensagem de conexão com a dopamina e recompensa */}
                      <p className="text-[11px] text-[#2F4A3E]/85 dark:text-[#E8EFE9]/85 leading-relaxed pt-0.5">
                        <span className="font-semibold text-[#4CAF7D] dark:text-[#8FCCAE]">
                          Por que vale a pena:{' '}
                        </span>
                        {task.dopamineRewardTip}
                      </p>

                      {/* Mensagem de reforço quando concluída */}
                      {isCompleted && (
                        <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{task.completedTodayMessage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Ações inferiores de gerenciamento */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsAddingTask(true)}
                className="font-bold text-[#4CAF7D] dark:text-[#8FCCAE] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar outra tarefa à sua rotina</span>
              </button>

              <button
                type="button"
                onClick={resetScheduleTasksToDefault}
                className="text-[#6A7A72] dark:text-[#A0B0A7] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar tarefas padrão</span>
              </button>
            </div>
          </div>
        )}

        {/* =============================================================
            ABA 2: SEMANA & ROTINA SIMPLES
           ============================================================= */}
        {activeTab === 'semana' && (
          <div className="space-y-5 animate-fade-in">
            {/* Visão dos últimos 7 dias */}
            <RecomecaCard variant="default" padding="lg" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Visão da Semana
                  </span>
                  <h2 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Seu ritmo nos últimos 7 dias
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#8FCCAE]">
                  {weekStats.totalCompletionsThisWeek} tarefas feitas
                </span>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Aqui você vê como suas escolhas saudáveis se distribuíram pela semana. Sem cobrança
                por dias vazios — cada dia que você fez algo já conta.
              </p>

              {/* Grid dos 7 dias com barras suaves */}
              <div className="grid grid-cols-7 gap-1.5 pt-2 text-center">
                {weekStats.days.map((day, idx) => {
                  const isToday = idx === 6
                  const hasTasks = day.count > 0

                  return (
                    <div
                      key={day.dateStr}
                      className={cn(
                        'p-2 rounded-xl flex flex-col items-center justify-between min-h-[82px] border transition-all',
                        isToday
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8]'
                          : hasTasks
                            ? 'bg-white dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34]'
                            : 'bg-[#F4F7F2]/60 dark:bg-[#202723]/60 border-transparent text-[#6A7A72]/50',
                      )}
                    >
                      <span className="text-[10px] font-bold block truncate w-full">
                        {day.label.split(',')[0]}
                      </span>
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold my-1',
                          hasTasks
                            ? 'bg-[#4CAF7D] text-white shadow-xs'
                            : 'bg-black/5 dark:bg-white/5 text-[#6A7A72]',
                        )}
                      >
                        {day.count}
                      </div>
                      <span className="text-[9px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        {isToday ? 'Hoje' : `${day.count} fei.`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </RecomecaCard>

            {/* Hábitos mais completados e convite gentil para repetir */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#7FBFA8]" />
                  <span>Hábitos mais completados</span>
                </h3>
                <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Tom sempre de convite
                </span>
              </div>

              {weekStats.topHabits.length > 0 ? (
                <div className="space-y-2.5">
                  {weekStats.topHabits.map((item) => (
                    <RecomecaCard
                      key={item.taskId}
                      variant="default"
                      padding="md"
                      className="space-y-2 border-l-4 border-l-[#7FBFA8]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                          {item.title}
                        </h4>
                        <span className="text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE] bg-[#E8F3EC] dark:bg-[#2A3831] px-2 py-0.5 rounded-full">
                          {item.count}x essa semana
                        </span>
                      </div>

                      {/* Convite para transformar em rotina */}
                      <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                        Você completou &ldquo;{item.title}&rdquo; {item.count} vezes nesta semana.{' '}
                        <strong>Quer deixar como rotina?</strong> Fazer isso no mesmo horário ajuda
                        o cérebro a antecipar a dopamina boa em vez da vontade de usar.
                      </p>
                    </RecomecaCard>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1C2420] text-center text-xs text-[#6A7A72] dark:text-[#A0B0A7] space-y-2">
                  <p>Nenhuma tarefa marcada ainda nesta semana.</p>
                  <p>Sem problema nenhum. O primeiro passo pode ser hoje com uma tarefa simples.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hoje')}
                    className="text-xs font-bold text-[#4CAF7D] underline"
                  >
                    Ver tarefas de hoje
                  </button>
                </div>
              )}
            </div>

            {/* Acesso rápido a métodos de troca e alívio */}
            <div className="p-4 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-2">
              <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Quer conectar suas tarefas à hora da fissura?
              </span>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Quando bater a vontade forte, abrir o aplicativo e escolher uma tarefa física do
                plano (parque, academia, lavar louça) desvia o piloto automático em minutos.
              </p>
              <div className="pt-1">
                <Link
                  to="/trocar"
                  className="text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE] hover:underline flex items-center gap-1"
                >
                  <span>Abrir tela Bateu a vontade? (/trocar)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Aviso legal obrigatório */}
        <LegalNoticeFooter />
      </div>
    </div>
  )
}
