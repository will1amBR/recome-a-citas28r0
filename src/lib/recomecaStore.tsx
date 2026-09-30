import * as React from 'react'
import {
  TrackedHabit,
  GoodActionRecord,
  CravingTechniqueMetric,
  SupportContact,
  MOCK_TRACKED_HABITS,
  MOCK_MONTHLY_MIRROR,
  MOCK_CONTACT,
} from '@/lib/mockData'

const STORAGE_KEY_ACTIONS = 'recomeca_good_actions_v1'
const STORAGE_KEY_HABITS = 'recomeca_habits_v1'
const STORAGE_KEY_TECHNIQUES = 'recomeca_technique_metrics_v1'
const STORAGE_KEY_CONTACT = 'recomeca_contact_v1'

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
  updateContact: (contact: Partial<SupportContact>) => void
  addGoodAction: (action: Omit<GoodActionRecord, 'id' | 'timestamp'>) => void
  recordTechniqueCompletion: (
    techniqueId: string,
    techniqueName: string,
    outcome: 'passou' | 'usou',
  ) => void
  recordActivityCompletion: (activityName: string, outcome: 'passou' | 'usou') => void
  updateCigarettes: (habitId: string, delta: number) => void
  setCigarettesDirect: (habitId: string, count: number) => void
  recordCheckinDone: () => void
  recordHonestEpisode: (substanceName: string, cigarettesAmount?: number) => void
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

  const [lastToastMessage, setLastToastMessage] = React.useState<string | null>(null)

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
        if (
          h.id === habitId ||
          (h.substanceKey && ['tabaco', 'cigarro'].includes(h.substanceKey))
        ) {
          const currentToday = h.cigarettesToday ?? 0
          const nextToday = Math.max(0, currentToday + delta)
          const currentWeek = h.cigarettesWeek ?? 0
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

  const recordCheckinDone = React.useCallback(() => {
    addGoodAction({
      title: 'Check-in diário completo',
      type: 'checkin',
      message: 'Cada escolha conta. Cuidar de você é prioridade.',
    })
  }, [addGoodAction])

  const recordHonestEpisode = React.useCallback(
    (substanceName: string, cigarettesAmount?: number) => {
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
    },
    [addGoodAction],
  )

  const value = React.useMemo<RecomecaStore>(
    () => ({
      habits,
      goodActions,
      goodActionsStreakDays,
      techniqueMetrics,
      lastToastMessage,
      contact,
      updateContact,
      addGoodAction,
      recordTechniqueCompletion,
      recordActivityCompletion,
      updateCigarettes,
      setCigarettesDirect,
      recordCheckinDone,
      recordHonestEpisode,
      clearToast,
    }),
    [
      habits,
      goodActions,
      goodActionsStreakDays,
      techniqueMetrics,
      lastToastMessage,
      contact,
      updateContact,
      addGoodAction,
      recordTechniqueCompletion,
      recordActivityCompletion,
      updateCigarettes,
      setCigarettesDirect,
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
