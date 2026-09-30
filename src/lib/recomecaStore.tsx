import * as React from 'react'
import {
  TrackedHabit,
  GoodActionRecord,
  CravingTechniqueMetric,
  SupportContact,
  CigaretteLogItem,
  EpisodeLog,
  SubstanceDetails,
  DailyScheduleTask,
  DayTaskCompletionLog,
  DEFAULT_DAILY_SCHEDULE_TASKS,
  MOCK_TRACKED_HABITS,
  MOCK_MONTHLY_MIRROR,
  MOCK_CONTACT,
  MOCK_TODAY_CIGARETTES,
  MOCK_LAST_EPISODE,
} from '@/lib/mockData'

const STORAGE_KEY_ACTIONS = 'recomeca_good_actions_v1'
const STORAGE_KEY_HABITS = 'recomeca_habits_v1'
const STORAGE_KEY_TECHNIQUES = 'recomeca_technique_metrics_v1'
const STORAGE_KEY_CONTACT = 'recomeca_contact_v1'
const STORAGE_KEY_CIGARETTE_LOGS = 'recomeca_cigarette_logs_v1'
const STORAGE_KEY_EPISODES = 'recomeca_episodes_v1'
const STORAGE_KEY_ACTIVE_HABIT = 'recomeca_active_habit_v1'
const STORAGE_KEY_DAILY_TASKS = 'recomeca_daily_tasks_v1'
const STORAGE_KEY_TASK_LOGS = 'recomeca_task_logs_v1'
const STORAGE_KEY_RISK_SITUATIONS = 'recomeca_risk_situations_v1'

const INITIAL_GOOD_ACTIONS: GoodActionRecord[] = [
  {
    id: 'act-1',
    title: 'Completou a técnica Navegar na onda',
    timestamp: '09:15',
    type: 'tecnica',
    message: 'Feito. Você escolheu você.',
  },
  {
    id: 'act-2',
    title: 'Bebeu água gelada devagar',
    timestamp: '14:20',
    type: 'atividade',
    message: 'Cada escolha conta.',
  },
]

export interface RecomecaStore {
  habits: TrackedHabit[]
  goodActions: GoodActionRecord[]
  goodActionsStreakDays: number
  techniqueMetrics: CravingTechniqueMetric[]
  lastToastMessage: string | null
  contact: SupportContact
  cigaretteLogs: CigaretteLogItem[]
  episodeLogs: EpisodeLog[]
  // Plano do Dia e Rotina
  scheduleTasks: DailyScheduleTask[]
  taskCompletionLogs: DayTaskCompletionLog[]
  todayCompletedTaskIds: string[]
  toggleTaskCompletionToday: (taskId: string) => { completed: boolean; message: string }
  addCustomScheduleTask: (task: {
    title: string
    subtitle?: string
    category: DailyScheduleTask['category']
    isPhysicalAlternativeToCravings?: boolean
  }) => void
  removeScheduleTask: (taskId: string) => void
  resetScheduleTasksToDefault: () => void
  // Situações de Risco do Usuário
  userRiskSituations: string[]
  setUserRiskSituations: (situations: string[]) => void
  addUserRiskSituation: (situation: string) => void
  removeUserRiskSituation: (situation: string) => void
  // Ações de apoio e hábitos
  updateContact: (contact: Partial<SupportContact>) => void
  addGoodAction: (action: Omit<GoodActionRecord, 'id' | 'timestamp'>) => void
  recordTechniqueCompletion: (
    techniqueId: string,
    techniqueName: string,
    outcome: 'passou' | 'usou',
  ) => void
  recordActivityCompletion: (activityName: string, outcome: 'passou' | 'usou') => void
  activeHabitId: string
  setActiveHabitId: (id: string) => void
  updateHabitGoal: (habitId: string, goalCustom: string, numericLimit?: number) => void
  updateCigarettes: (habitId: string, delta: number) => void
  setCigarettesDirect: (habitId: string, count: number) => void
  logCigaretteWithDetails: (params: {
    habitId?: string
    timestamp?: string
    quantity?: number
    context: string
    note?: string
  }) => { count: number; limit: number; remaining: number; passed: boolean }
  removeLastCigaretteLog: (habitId?: string) => void
  recordCheckinDone: () => void
  recordHonestEpisode: (
    substanceName: string,
    cigarettesAmount?: number,
    fullEpisode?: Partial<EpisodeLog>,
  ) => void
  clearToast: () => void
}

const StoreContext = React.createContext<RecomecaStore | null>(null)

export function RecomecaProvider({ children }: { children: React.ReactNode }) {
  // Hábitos
  const [habits, setHabits] = React.useState<TrackedHabit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HABITS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MOCK_TRACKED_HABITS
  })

  // Boas ações de hoje
  const [goodActions, setGoodActions] = React.useState<GoodActionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIONS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_GOOD_ACTIONS
  })

  // Contador de dias seguidos com pelo menos uma boa ação
  const [goodActionsStreakDays] = React.useState<number>(4)

  // Métricas do Espelho do Mês
  const [techniqueMetrics, setTechniqueMetrics] = React.useState<CravingTechniqueMetric[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TECHNIQUES)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MOCK_MONTHLY_MIRROR.cravingTechniquesEffectiveness
  })

  // Contato de emergência/apoio pessoal
  const [contact, setContact] = React.useState<SupportContact>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTACT)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MOCK_CONTACT
  })

  // Logs individuais de cada cigarro registrado (horário + contexto)
  const [cigaretteLogs, setCigaretteLogs] = React.useState<CigaretteLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CIGARETTE_LOGS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MOCK_TODAY_CIGARETTES
  })

  // Histórico de episódios completos registrados
  const [episodeLogs, setEpisodeLogs] = React.useState<EpisodeLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EPISODES)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return [MOCK_LAST_EPISODE]
  })

  // Lista de tarefas do cronograma / Plano do Dia
  const [scheduleTasks, setScheduleTasks] = React.useState<DailyScheduleTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY_TASKS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return DEFAULT_DAILY_SCHEDULE_TASKS
  })

  // Logs de conclusão de tarefas por data
  const [taskCompletionLogs, setTaskCompletionLogs] = React.useState<DayTaskCompletionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASK_LOGS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    // Dados iniciais acolhedores para os últimos dias para ilustrar a visão semanal
    const todayStr = new Date().toISOString().slice(0, 10)
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const yesterdayStr = d.toISOString().slice(0, 10)
    d.setDate(d.getDate() - 1)
    const twoDaysAgoStr = d.toISOString().slice(0, 10)

    return [
      {
        date: twoDaysAgoStr,
        taskId: 'task-academia',
        taskTitle: 'Academia ou exercício físico em casa',
        completedAt: '18:10',
      },
      {
        date: twoDaysAgoStr,
        taskId: 'task-louca',
        taskTitle: 'Lavar a louça da pia',
        completedAt: '12:40',
      },
      {
        date: yesterdayStr,
        taskId: 'task-parque',
        taskTitle: 'Caminhada ao ar livre ou ir ao parque',
        completedAt: '17:30',
      },
      {
        date: yesterdayStr,
        taskId: 'task-louca',
        taskTitle: 'Lavar a louça da pia',
        completedAt: '13:00',
      },
      {
        date: yesterdayStr,
        taskId: 'task-piso',
        taskTitle: 'Varrer ou passar pano no chão',
        completedAt: '10:15',
      },
      {
        date: todayStr,
        taskId: 'task-louca',
        taskTitle: 'Lavar a louça da pia',
        completedAt: '09:30',
      },
      { date: todayStr, taskId: 'task-cama', taskTitle: 'Arrumar a cama', completedAt: '08:15' },
    ]
  })

  // Situações de risco do usuário (onboarding / perfil / trocar)
  const [userRiskSituations, setUserRiskSituationsState] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RISK_SITUATIONS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    // Inicial amigável alinhado ao caso do Diego (estresse, pressão, novos começos, ansiedade)
    return [
      'Estresse acumulado ou cansaço mental',
      'Pressão no trabalho ou cobranças',
      'Ansiedade ou coração acelerado',
      'Mudanças e novos começos (novo emprego, rotina nova)',
    ]
  })

  const [lastToastMessage, setLastToastMessage] = React.useState<string | null>(null)

  // Vício / substância ativa selecionada para contexto em /trocar e /hoje
  const [activeHabitId, setActiveHabitIdState] = React.useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_HABIT)
      if (saved && habits.some((h) => h.id === saved)) return saved
    } catch {
      // fallback
    }
    return habits[0]?.id || 'habit-cigarro'
  })

  const setActiveHabitId = React.useCallback((id: string) => {
    setActiveHabitIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_HABIT, id)
    } catch {
      // ignore
    }
  }, [])

  // Atualizar meta do dia livremente para qualquer vício
  const updateHabitGoal = React.useCallback(
    (habitId: string, goalCustom: string, numericLimit?: number) => {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habitId) {
            const updated: TrackedHabit = {
              ...h,
              dailyGoalCustom: goalCustom,
            }
            if (typeof numericLimit === 'number' && !isNaN(numericLimit) && numericLimit >= 0) {
              updated.dailyLimit = numericLimit
            }
            return updated
          }
          return h
        }),
      )
    },
    [],
  )

  // Salvar no localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits))
    } catch {
      // ignore
    }
  }, [habits])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(goodActions))
    } catch {
      // ignore
    }
  }, [goodActions])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TECHNIQUES, JSON.stringify(techniqueMetrics))
    } catch {
      // ignore
    }
  }, [techniqueMetrics])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(contact))
    } catch {
      // ignore
    }
  }, [contact])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CIGARETTE_LOGS, JSON.stringify(cigaretteLogs))
    } catch {
      // ignore
    }
  }, [cigaretteLogs])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EPISODES, JSON.stringify(episodeLogs))
    } catch {
      // ignore
    }
  }, [episodeLogs])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DAILY_TASKS, JSON.stringify(scheduleTasks))
    } catch {
      // ignore
    }
  }, [scheduleTasks])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASK_LOGS, JSON.stringify(taskCompletionLogs))
    } catch {
      // ignore
    }
  }, [taskCompletionLogs])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RISK_SITUATIONS, JSON.stringify(userRiskSituations))
    } catch {
      // ignore
    }
  }, [userRiskSituations])

  const updateContact = React.useCallback((patch: Partial<SupportContact>) => {
    setContact((prev) => ({ ...prev, ...patch }))
  }, [])

  const clearToast = React.useCallback(() => {
    setLastToastMessage(null)
  }, [])

  const addGoodAction = React.useCallback((action: Omit<GoodActionRecord, 'id' | 'timestamp'>) => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`
    const newRecord: GoodActionRecord = {
      ...action,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: timeStr,
    }
    setGoodActions((prev) => [newRecord, ...prev])
    setLastToastMessage(action.message)
  }, [])

  const recordTechniqueCompletion = React.useCallback(
    (techniqueId: string, techniqueName: string, outcome: 'passou' | 'usou') => {
      // Atualiza métricas para o Diário / Espelho do Mês
      setTechniqueMetrics((prev) => {
        const found = prev.find(
          (m) => m.id === techniqueId || m.name.toLowerCase().includes(techniqueName.toLowerCase()),
        )
        if (found) {
          return prev.map((m) => {
            if (m.id === found.id) {
              const newPassed =
                outcome === 'passou' ? m.passedWithoutUsingCount + 1 : m.passedWithoutUsingCount
              const newUsed = outcome === 'usou' ? m.usedAfterCount + 1 : m.usedAfterCount
              const newTotal = m.count + 1
              const percentage = Math.round((newPassed / newTotal) * 100)
              return {
                ...m,
                count: newTotal,
                passedWithoutUsingCount: newPassed,
                usedAfterCount: newUsed,
                percentagePassed: percentage,
              }
            }
            return m
          })
        }
        // Se ainda não existia, adiciona
        const newTotal = 1
        const newPassed = outcome === 'passou' ? 1 : 0
        const newUsed = outcome === 'usou' ? 1 : 0
        return [
          ...prev,
          {
            id: techniqueId,
            name: techniqueName,
            category: 'tecnica',
            count: newTotal,
            passedWithoutUsingCount: newPassed,
            usedAfterCount: newUsed,
            percentagePassed: outcome === 'passou' ? 100 : 0,
          },
        ]
      })

      // Adiciona às Boas Ações com reforço acolhedor
      const message =
        outcome === 'passou'
          ? 'Feito. Você escolheu você.'
          : 'Cada escolha conta. Você parou e cuidou de você.'

      addGoodAction({
        title: `Técnica: ${techniqueName}`,
        type: 'tecnica',
        message,
      })
    },
    [addGoodAction],
  )

  const recordActivityCompletion = React.useCallback(
    (activityName: string, outcome: 'passou' | 'usou') => {
      setTechniqueMetrics((prev) => {
        const found = prev.find((m) => m.name.toLowerCase().includes(activityName.toLowerCase()))
        if (found) {
          return prev.map((m) => {
            if (m.id === found.id) {
              const newPassed =
                outcome === 'passou' ? m.passedWithoutUsingCount + 1 : m.passedWithoutUsingCount
              const newUsed = outcome === 'usou' ? m.usedAfterCount + 1 : m.usedAfterCount
              const newTotal = m.count + 1
              return {
                ...m,
                count: newTotal,
                passedWithoutUsingCount: newPassed,
                usedAfterCount: newUsed,
                percentagePassed: Math.round((newPassed / newTotal) * 100),
              }
            }
            return m
          })
        }
        return [
          ...prev,
          {
            id: `act-metric-${Date.now()}`,
            name: activityName,
            category: 'atividade',
            count: 1,
            passedWithoutUsingCount: outcome === 'passou' ? 1 : 0,
            usedAfterCount: outcome === 'usou' ? 1 : 0,
            percentagePassed: outcome === 'passou' ? 100 : 0,
          },
        ]
      })

      addGoodAction({
        title: `Atividade: ${activityName}`,
        type: 'atividade',
        message: 'Feito. Você escolheu você.',
      })
    },
    [addGoodAction],
  )

  const updateCigarettes = React.useCallback((habitId: string, delta: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        const isMatch =
          h.id === habitId ||
          (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey)) ||
          h.name.toLowerCase().includes('cigarro') ||
          h.name.toLowerCase().includes('tabaco')

        if (isMatch) {
          const currentToday = h.cigarettesToday ?? h.dailyCurrent ?? 0
          const nextToday = Math.max(0, currentToday + delta)
          const currentWeek = h.cigarettesWeek ?? currentToday
          const nextWeek = Math.max(0, currentWeek + delta)

          return {
            ...h,
            cigarettesToday: nextToday,
            cigarettesWeek: nextWeek,
            dailyCurrent: nextToday,
          }
        }
        return h
      }),
    )
  }, [])

  // Registrar cigarro com horário e contexto detalhado (rápido e opcional)
  const logCigaretteWithDetails = React.useCallback(
    ({
      habitId,
      timestamp,
      quantity = 1,
      context,
      note,
    }: {
      habitId?: string
      timestamp?: string
      quantity?: number
      context: string
      note?: string
    }) => {
      const now = new Date()
      const timeStr =
        timestamp ||
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const dateStr = now.toISOString().slice(0, 10)

      const newItem: CigaretteLogItem = {
        id: `cig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: timeStr,
        date: dateStr,
        quantity: Math.max(1, quantity),
        context: context || 'Outro momento',
        note,
      }

      setCigaretteLogs((prev) => [newItem, ...prev])

      // Atualiza contadores do hábito
      const targetHabitId = habitId || 'habit-cigarro'
      updateCigarettes(targetHabitId, newItem.quantity)

      // Adiciona ação acolhedora sem culpa
      addGoodAction({
        title: `Cigarro registrado (${timeStr} • ${newItem.context})`,
        type: 'honestidade',
        message: 'Anotado. Isso te ajuda a conhecer seus momentos.',
      })

      // Calcula cigarros restantes até a meta
      const currentHabit = habits.find((h) => h.id === targetHabitId)
      const currentTotal = (currentHabit?.cigarettesToday ?? 0) + newItem.quantity
      const limit = currentHabit?.dailyLimit ?? 6
      const remaining = limit - currentTotal

      return {
        count: currentTotal,
        limit,
        remaining,
        passed: remaining < 0,
      }
    },
    [habits, updateCigarettes, addGoodAction],
  )

  // Remover último cigarro (se tocou em -1)
  const removeLastCigaretteLog = React.useCallback(
    (habitId?: string) => {
      setCigaretteLogs((prev) => {
        if (prev.length === 0) return prev
        const [first, ...rest] = prev
        const targetHabitId = habitId || 'habit-cigarro'
        updateCigarettes(targetHabitId, -first.quantity)
        return rest
      })
    },
    [updateCigarettes],
  )

  const setCigarettesDirect = React.useCallback((habitId: string, count: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (
          h.id === habitId ||
          (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey))
        ) {
          const val = Math.max(0, count)
          return {
            ...h,
            cigarettesToday: val,
            dailyCurrent: val,
          }
        }
        return h
      }),
    )
  }, [])

  // -------------------------------------------------------------
  // PLANO DO DIA / TAREFAS SAUDÁVEIS & DOPAMINA NATURAL
  // -------------------------------------------------------------
  const todayDateStr = React.useMemo(() => new Date().toISOString().slice(0, 10), [])

  const todayCompletedTaskIds = React.useMemo(() => {
    return taskCompletionLogs.filter((log) => log.date === todayDateStr).map((log) => log.taskId)
  }, [taskCompletionLogs, todayDateStr])

  const toggleTaskCompletionToday = React.useCallback(
    (taskId: string) => {
      const task = scheduleTasks.find((t) => t.id === taskId)
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const dateStr = now.toISOString().slice(0, 10)
      const alreadyDone = taskCompletionLogs.some((l) => l.date === dateStr && l.taskId === taskId)

      if (alreadyDone) {
        // Desmarcar se o usuário tocou por engano
        setTaskCompletionLogs((prev) =>
          prev.filter((l) => !(l.date === dateStr && l.taskId === taskId)),
        )
        return { completed: false, message: 'Tarefa desmarcada com calma.' }
      }

      // Marcar como feita
      const newLog: DayTaskCompletionLog = {
        date: dateStr,
        taskId,
        taskTitle: task?.title || 'Tarefa diária',
        completedAt: timeStr,
      }
      setTaskCompletionLogs((prev) => [...prev, newLog])

      const reinforcementMsg = task?.completedTodayMessage || 'Feito. Você escolheu você.'
      addGoodAction({
        title: `Plano do dia: ${task?.title || 'Tarefa concluída'}`,
        type: 'tarefa-plano',
        message: reinforcementMsg,
      })

      return { completed: true, message: reinforcementMsg }
    },
    [scheduleTasks, taskCompletionLogs, addGoodAction],
  )

  const addCustomScheduleTask = React.useCallback(
    ({
      title,
      subtitle,
      category,
      isPhysicalAlternativeToCravings = false,
    }: {
      title: string
      subtitle?: string
      category: DailyScheduleTask['category']
      isPhysicalAlternativeToCravings?: boolean
    }) => {
      const newTask: DailyScheduleTask = {
        id: `custom-task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        subtitle: subtitle?.trim() || 'Hábito saudável personalizado',
        category,
        dopamineRewardTip: 'Uma tarefa que você mesmo escolheu para cuidar do seu tempo e mente.',
        completedTodayMessage: `Feito. ${title.trim()} concluído com sucesso. Sensação boa de ordem.`,
        isPhysicalAlternativeToCravings,
        isDefault: false,
      }
      setScheduleTasks((prev) => [...prev, newTask])
    },
    [],
  )

  const removeScheduleTask = React.useCallback((taskId: string) => {
    setScheduleTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const resetScheduleTasksToDefault = React.useCallback(() => {
    setScheduleTasks(DEFAULT_DAILY_SCHEDULE_TASKS)
  }, [])

  // Gerenciamento de situações de risco
  const setUserRiskSituations = React.useCallback((situations: string[]) => {
    setUserRiskSituationsState(situations)
  }, [])

  const addUserRiskSituation = React.useCallback((situation: string) => {
    const trimmed = situation.trim()
    if (!trimmed) return
    setUserRiskSituationsState((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]))
  }, [])

  const removeUserRiskSituation = React.useCallback((situation: string) => {
    setUserRiskSituationsState((prev) => prev.filter((s) => s !== situation))
  }, [])

  const recordCheckinDone = React.useCallback(() => {
    addGoodAction({
      title: 'Check-in diário completo',
      type: 'checkin',
      message: 'Cada escolha conta. Cuidar de você é prioridade.',
    })
  }, [addGoodAction])

  const recordHonestEpisode = React.useCallback(
    (substanceName: string, cigarettesAmount?: number, fullEpisode?: Partial<EpisodeLog>) => {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`
      const dateStr = now.toISOString().slice(0, 10)

      addGoodAction({
        title: `Registro honesto: ${substanceName}`,
        type: 'honestidade',
        message: 'Obrigado pela honestidade com você. Recomeçar faz parte.',
      })

      if (cigarettesAmount && cigarettesAmount > 0) {
        // soma aos cigarros do dia se for tabaco/cigarro
        setHabits((prev) =>
          prev.map((h) => {
            const isTobacco =
              h.name.toLowerCase().includes('cigarro') ||
              h.name.toLowerCase().includes('tabaco') ||
              (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey))
            if (isTobacco) {
              const current = h.cigarettesToday ?? 0
              return {
                ...h,
                cigarettesToday: current + cigarettesAmount,
                cigarettesWeek: (h.cigarettesWeek ?? 0) + cigarettesAmount,
              }
            }
            return h
          }),
        )
      }

      // Salva no histórico de episódios
      const newEp: EpisodeLog = {
        id: `ep-${Date.now()}`,
        date: fullEpisode?.date || dateStr,
        time: fullEpisode?.time || timeStr,
        substanceName,
        amountDescription:
          fullEpisode?.amountDescription ||
          (cigarettesAmount ? `${cigarettesAmount} cigarros` : 'Consumo registrado'),
        mood: fullEpisode?.mood || 'neutro',
        triggers: fullEpisode?.triggers || [],
        freeText: fullEpisode?.freeText || '',
        whatHappenedBefore: fullEpisode?.whatHappenedBefore,
        whatHappenedAfter: fullEpisode?.whatHappenedAfter || 'Registrado com calma.',
        cravingTime: fullEpisode?.cravingTime,
        receipt: fullEpisode?.receipt,
        details: fullEpisode?.details,
      }

      setEpisodeLogs((prev) => [newEp, ...prev])
    },
    [addGoodAction],
  )

  const value = React.useMemo<RecomecaStore>(
    () => ({
      habits,
      activeHabitId,
      setActiveHabitId,
      updateHabitGoal,
      goodActions,
      goodActionsStreakDays,
      techniqueMetrics,
      lastToastMessage,
      contact,
      cigaretteLogs,
      episodeLogs,
      scheduleTasks,
      taskCompletionLogs,
      todayCompletedTaskIds,
      toggleTaskCompletionToday,
      addCustomScheduleTask,
      removeScheduleTask,
      resetScheduleTasksToDefault,
      userRiskSituations,
      setUserRiskSituations,
      addUserRiskSituation,
      removeUserRiskSituation,
      updateContact,
      addGoodAction,
      recordTechniqueCompletion,
      recordActivityCompletion,
      updateCigarettes,
      setCigarettesDirect,
      logCigaretteWithDetails,
      removeLastCigaretteLog,
      recordCheckinDone,
      recordHonestEpisode,
      clearToast,
    }),
    [
      habits,
      activeHabitId,
      setActiveHabitId,
      updateHabitGoal,
      goodActions,
      goodActionsStreakDays,
      techniqueMetrics,
      lastToastMessage,
      contact,
      cigaretteLogs,
      episodeLogs,
      scheduleTasks,
      taskCompletionLogs,
      todayCompletedTaskIds,
      toggleTaskCompletionToday,
      addCustomScheduleTask,
      removeScheduleTask,
      resetScheduleTasksToDefault,
      userRiskSituations,
      setUserRiskSituations,
      addUserRiskSituation,
      removeUserRiskSituation,
      updateContact,
      addGoodAction,
      recordTechniqueCompletion,
      recordActivityCompletion,
      updateCigarettes,
      setCigarettesDirect,
      logCigaretteWithDetails,
      removeLastCigaretteLog,
      recordCheckinDone,
      recordHonestEpisode,
      clearToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useRecomecaStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) {
    throw new Error('useRecomecaStore must be used within a RecomecaProvider')
  }
  return ctx
}
