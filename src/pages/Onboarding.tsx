import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { RecomecaButton, RecomecaCard, RecomecaInput, ProgressBar } from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { ONBOARDING_SUBSTANCES, DEFAULT_RISK_SITUATIONS } from '@/lib/mockData'
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Check,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  User,
  Clock,
  Sun,
  Sunset,
  Moon,
  Sparkle,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HabitDetailConfig {
  goal: 'parar' | 'reduzir'
  frequency: string
  sinceWhen: string
  dailyGoalCustom: string // Meta do dia editável (campo livre, nunca sugerido)
}

// Opções de Identidade de Gênero
const GENDER_OPTIONS = [
  { id: 'mulher', label: 'Mulher' },
  { id: 'homem', label: 'Homem' },
  { id: 'nao-binario', label: 'Não-binário' },
  { id: 'trans', label: 'Trans' },
  { id: 'outro', label: 'Outro' },
  { id: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
]

// Opções de Orientação Sexual
const ORIENTATION_OPTIONS = [
  { id: 'heterossexual', label: 'Heterossexual' },
  { id: 'lesbica', label: 'Lésbica' },
  { id: 'gay', label: 'Gay' },
  { id: 'bissexual', label: 'Bissexual' },
  { id: 'pansexual', label: 'Pansexual' },
  { id: 'assexual', label: 'Assexual' },
  { id: 'outra', label: 'Outra' },
  { id: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
]

// Opções de Atividades do Dia a Dia ("O que seu dia tem?")
const DAY_ACTIVITY_OPTIONS = [
  { id: 'trabalho-presencial', label: 'Trabalho presencial' },
  { id: 'home-office', label: 'Home office' },
  { id: 'estudos-faculdade', label: 'Estudo / Faculdade' },
  { id: 'cuidar-casa', label: 'Cuidar da casa' },
  { id: 'filhos-familia', label: 'Família / Filhos' },
  { id: 'momentos-livres', label: 'Momentos livres' },
  { id: 'rotina-noturna', label: 'Rotina noturna' },
  { id: 'rotina-variavel', label: 'Escala / Rotina variável' },
]

// Opções de Horários de Maior Vontade / Uso ("Quando costuma usar?")
const USAGE_TIME_OPTIONS = [
  { id: 'manha', label: 'Manhã', sub: 'Ao acordar / café', icon: Sun },
  { id: 'tarde', label: 'Tarde', sub: 'Pausas / expediente', icon: Sunset },
  { id: 'noite', label: 'Noite', sub: 'Descanso / casa', icon: Moon },
  { id: 'madrugada', label: 'Madrugada', sub: 'Insonia / silêncio', icon: Sparkle },
]

// Opções do que ajuda hoje ("O que ajuda você hoje?")
const HELPFUL_OPTIONS = [
  { id: 'agua-gelada', label: 'Tomar água gelada devagar' },
  { id: 'caminhada-parque', label: 'Caminhada ou ir ao parque' },
  { id: 'sons-suaves', label: 'Ouvir sons suaves / ruído marrom' },
  { id: 'limpar-arrumar', label: 'Lavar louça ou arrumar a casa' },
  { id: 'conversar-alguem', label: 'Conversar com alguém de confiança' },
  { id: 'exercicio-fisico', label: 'Academia ou exercício' },
  { id: 'respirar-fundo', label: 'Pausar e respirar fundo' },
  { id: 'banho-morno', label: 'Tomar um banho tranquilo' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const {
    contact,
    updateContact,
    userRiskSituations,
    setUserRiskSituations,
    identity,
    updateIdentity,
    dailyRoutine,
    updateDailyRoutine,
  } = useRecomecaStore()

  // Etapa atual: 1 a 7 (com novas etapas: 2: Quem é você, 3: Hábitos do dia a dia)
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  // 1) Quem é você (Etapa 2)
  const [legalName, setLegalName] = React.useState(identity.legalName || '')
  const [preferredName, setPreferredName] = React.useState(identity.preferredName || '')
  const [socialName, setSocialName] = React.useState(identity.socialName || '')
  const [genderIdentity, setGenderIdentity] = React.useState(identity.genderIdentity || '')
  const [genderCustomDescription, setGenderCustomDescription] = React.useState(
    identity.genderCustomDescription || '',
  )
  const [sexualOrientation, setSexualOrientation] = React.useState(identity.sexualOrientation || '')
  const [orientationCustomDescription, setOrientationCustomDescription] = React.useState(
    identity.orientationCustomDescription || '',
  )

  // 2) Hábitos do dia a dia (Etapa 3)
  const [dayActivities, setDayActivities] = React.useState<string[]>(
    dailyRoutine.dayActivities || ['Trabalho em home office', 'Cuidar da casa'],
  )
  const [commonDayDescription, setCommonDayDescription] = React.useState(
    dailyRoutine.commonDayDescription || '',
  )
  const [usagePeakTimes, setUsagePeakTimes] = React.useState<string[]>(
    dailyRoutine.usagePeakTimes || ['tarde', 'noite'],
  )
  const [whatHelpsToday, setWhatHelpsToday] = React.useState<string[]>(
    dailyRoutine.whatHelpsToday || ['Tomar água gelada devagar', 'Caminhada ou ir ao parque'],
  )
  const [workStudyRoutine, setWorkStudyRoutine] = React.useState(
    dailyRoutine.workStudyRoutine || '',
  )
  const [sleepRoutine, setSleepRoutine] = React.useState(dailyRoutine.sleepRoutine || '')
  const [freeTimeRoutine, setFreeTimeRoutine] = React.useState(dailyRoutine.freeTimeRoutine || '')

  // 3) Escolhas de substâncias/hábitos (Etapa 1)
  const [selectedSubstances, setSelectedSubstances] = React.useState<string[]>(['alcool', 'cafe'])

  // 4) Detalhes para cada item escolhido (parar ou reduzir, uso atual, desde quando, meta do dia livre) (Etapa 4)
  const [details, setDetails] = React.useState<Record<string, HabitDetailConfig>>({
    alcool: {
      goal: 'parar',
      frequency: '3 a 4 vezes por semana',
      sinceWhen: 'Há 5 anos',
      dailyGoalCustom: '0 doses (dia livre)',
    },
    cafe: {
      goal: 'reduzir',
      frequency: '4 a 5 xícaras por dia',
      sinceWhen: 'Há cerca de 3 anos',
      dailyGoalCustom: 'até 2 xícaras',
    },
  })

  // 5) Contato de emergência (Etapa 6)
  const [contactName, setContactName] = React.useState(contact.name)
  const [contactPhone, setContactPhone] = React.useState(contact.displayPhone || contact.phone)
  const [contactNotified, setContactNotified] = React.useState(contact.hasConsent)

  // 6) Situações de risco (Etapa 7)
  const [selectedRisks, setSelectedRisks] = React.useState<string[]>(userRiskSituations || [])
  const [customRiskInput, setCustomRiskInput] = React.useState<string>('')

  // 7) Consentimento LGPD (Etapa 7)
  const [lgpdConsent, setLgpdConsent] = React.useState(true)

  // Erros gentis
  const [validationError, setValidationError] = React.useState('')

  // Verifica se alguma das substâncias selecionadas é de alto risco na abstinência
  const hasHighRiskSubstance = selectedSubstances.some((id) => {
    const item = ONBOARDING_SUBSTANCES.find((s) => s.id === id)
    return item?.highRisk
  })

  // Handlers de substância
  const toggleSubstance = (id: string) => {
    setValidationError('')
    setSelectedSubstances((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        return prev.filter((s) => s !== id)
      } else {
        const next = [...prev, id]
        if (!details[id]) {
          setDetails((d) => ({
            ...d,
            [id]: {
              goal: 'parar',
              frequency: 'Diariamente',
              sinceWhen: 'Há cerca de 1 ano',
              dailyGoalCustom: '',
            },
          }))
        }
        return next
      }
    })
  }

  const updateDetail = (substanceId: string, field: keyof HabitDetailConfig, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [substanceId]: {
        ...prev[substanceId],
        [field]: value,
      },
    }))
  }

  // Handlers da etapa "Quem é você"
  const selectGender = (id: string) => {
    setGenderIdentity((prev) => (prev === id ? '' : id))
  }

  const selectOrientation = (id: string) => {
    setSexualOrientation((prev) => (prev === id ? '' : id))
  }

  // Verifica se a opção selecionada pede campo descritivo opcional
  const showGenderCustomInput =
    ['trans', 'outro', 'nao-binario'].includes(genderIdentity) ||
    Boolean(genderCustomDescription && genderIdentity)

  const showOrientationCustomInput =
    ['outra', 'pansexual', 'bissexual', 'assexual'].includes(sexualOrientation) ||
    Boolean(orientationCustomDescription && sexualOrientation)

  // Handlers da etapa "Hábitos do dia a dia"
  const toggleDayActivity = (label: string) => {
    setDayActivities((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    )
  }

  const toggleUsageTime = (id: string) => {
    setUsagePeakTimes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleHelpfulOption = (label: string) => {
    setWhatHelpsToday((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    )
  }

  // Handlers de riscos
  const toggleRiskSituation = (label: string) => {
    setSelectedRisks((prev) => {
      const exists = prev.includes(label)
      const next = exists ? prev.filter((r) => r !== label) : [...prev, label]
      setUserRiskSituations(next)
      return next
    })
  }

  const handleAddCustomRisk = () => {
    const trimmed = customRiskInput.trim()
    if (!trimmed) return
    if (!selectedRisks.includes(trimmed)) {
      const next = [...selectedRisks, trimmed]
      setSelectedRisks(next)
      setUserRiskSituations(next)
    }
    setCustomRiskInput('')
  }

  // Persistir dados da etapa atual para o store
  const persistIdentityData = () => {
    updateIdentity({
      legalName: legalName.trim(),
      preferredName: preferredName.trim(),
      socialName: socialName.trim(),
      genderIdentity,
      genderCustomDescription: genderCustomDescription.trim(),
      sexualOrientation,
      orientationCustomDescription: orientationCustomDescription.trim(),
    })
  }

  const persistRoutineData = () => {
    updateDailyRoutine({
      dayActivities,
      commonDayDescription: commonDayDescription.trim(),
      usagePeakTimes,
      whatHelpsToday,
      workStudyRoutine: workStudyRoutine.trim(),
      sleepRoutine: sleepRoutine.trim(),
      freeTimeRoutine: freeTimeRoutine.trim(),
    })
  }

  const handleNext = () => {
    setValidationError('')

    // Etapa 1: O que quer controlar
    if (currentStep === 1) {
      if (selectedSubstances.length === 0) {
        setValidationError('Escolha pelo menos um item para podermos apoiar você.')
        return
      }
      setCurrentStep(2)
      return
    }

    // Etapa 2: Quem é você (tudo opcional)
    if (currentStep === 2) {
      persistIdentityData()
      setCurrentStep(3)
      return
    }

    // Etapa 3: Hábitos do dia a dia (tudo opcional)
    if (currentStep === 3) {
      persistRoutineData()
      setCurrentStep(4)
      return
    }

    // Etapa 4: Seu plano para cada escolha (parar ou reduzir)
    if (currentStep === 4) {
      setCurrentStep(5)
      return
    }

    // Etapa 5: Aviso de segurança / saúde
    if (currentStep === 5) {
      setCurrentStep(6)
      return
    }

    // Etapa 6: Contato de emergência
    if (currentStep === 6) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setValidationError('Preencha o nome e o telefone do seu contato de confiança.')
        return
      }
      updateContact({
        name: contactName.trim(),
        phone: contactPhone.replace(/\D/g, ''),
        displayPhone: contactPhone.trim(),
        hasConsent: contactNotified,
      })
      setCurrentStep(7)
      return
    }

    // Etapa 7: Situações de Risco + LGPD & Início
    if (currentStep === 7) {
      if (!lgpdConsent) {
        setValidationError('Precisamos do seu consentimento para proteger seus dados e continuar.')
        return
      }
      persistIdentityData()
      persistRoutineData()
      if (selectedRisks.length > 0) {
        setUserRiskSituations(selectedRisks)
      }
      navigate('/hoje')
    }
  }

  const handleBack = () => {
    setValidationError('')
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    } else {
      navigate('/')
    }
  }

  // Progresso em % (total 7 etapas)
  const TOTAL_STEPS = 7
  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100)

  const stepTitles: Record<number, string> = {
    1: 'O que quer cuidar',
    2: 'Quem é você',
    3: 'Seus hábitos do dia a dia',
    4: 'Objetivo e frequência',
    5: 'Segurança e saúde',
    6: 'Contato de emergência',
    7: 'Privacidade e início',
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans px-4 py-6 selection:bg-[#7FBFA8]/30">
      {/* Topo com navegação e barra de progresso */}
      <div className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar para a etapa anterior"
            className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center hover:bg-[#7FBFA8]/20 transition-colors touch-target focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-[#6A7A72] dark:text-[#A0B0A7] tabular-nums">
            Etapa {currentStep} de {TOTAL_STEPS}
          </span>

          <button
            type="button"
            onClick={() => {
              persistIdentityData()
              persistRoutineData()
              navigate('/hoje')
            }}
            className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E] dark:hover:text-[#E8EFE9] px-2 py-1"
          >
            Pular tudo
          </button>
        </div>

        <ProgressBar
          value={progressPercent}
          size="sm"
          helperText={`Etapa ${currentStep}: ${stepTitles[currentStep] || ''}`}
        />
      </div>

      {/* Conteúdo da etapa */}
      <div className="flex-1 space-y-6 pt-2">
        {/* =============================================================
            ETAPA 1: O que quer controlar
           ============================================================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                O que você gostaria de controlar ou cuidar?
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Selecione quantos quiser. Lembre-se: sem julgamento, sem culpa.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block mb-2">
                  Substâncias e Hábitos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ONBOARDING_SUBSTANCES.filter((s) => s.category !== 'remedio').map((item) => {
                    const isSelected = selectedSubstances.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSubstance(item.id)}
                        className={cn(
                          'p-3.5 rounded-2xl text-left border text-sm font-semibold flex items-center justify-between transition-all touch-target',
                          isSelected
                            ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-sm'
                            : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                        )}
                      >
                        <span>{item.label}</span>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                            isSelected
                              ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] border-transparent text-white dark:text-[#1C2420]'
                              : 'border-[#E1E8E2] dark:border-[#2D3A34]',
                          )}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block mb-2">
                  Remédios sob Acompanhamento
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ONBOARDING_SUBSTANCES.filter((s) => s.category === 'remedio').map((item) => {
                    const isSelected = selectedSubstances.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSubstance(item.id)}
                        className={cn(
                          'p-3.5 rounded-2xl text-left border text-sm font-semibold flex items-center justify-between transition-all touch-target',
                          isSelected
                            ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-sm'
                            : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                        )}
                      >
                        <span className="pr-2">{item.label}</span>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all',
                            isSelected
                              ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] border-transparent text-white dark:text-[#1C2420]'
                              : 'border-[#E1E8E2] dark:border-[#2D3A34]',
                          )}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            ETAPA 2: QUEM É VOCÊ (Nome, nome preferido, social, gênero, orientação LGBTQI+)
           ============================================================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Quem é você?
                </h2>
                <span className="text-[11px] font-semibold text-[#4CAF7D] bg-[#E8F3EC] dark:bg-[#2A3831] px-2.5 py-1 rounded-full shrink-0">
                  Pode pular
                </span>
              </div>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Usamos isso só para te chamar do jeito que você merece ser chamada. Pode pular
                qualquer campo.
              </p>
            </div>

            {/* Bloco 1: Nomes */}
            <RecomecaCard variant="default" padding="lg" className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2F4A3E] dark:text-[#8FCCAE]">
                <User className="w-4 h-4 text-[#7FBFA8]" />
                <span>Como prefere que o app fale com você?</span>
              </div>

              <RecomecaInput
                label="Como gosta de ser chamada? (nome que o app vai usar)"
                placeholder="Ex.: Camila, Dani, Leo, Pri..."
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                helperText="Este é o nome que vai aparecer na sua saudação de boas-vindas e nos reforços diários."
              />

              <RecomecaInput
                label="Nome social (se tiver, opcional)"
                placeholder="Seu nome social de direito e acolhimento"
                value={socialName}
                onChange={(e) => setSocialName(e.target.value)}
                helperText="Respeitado integralmente em todas as telas."
              />

              <RecomecaInput
                label="Nome de registro (opcional)"
                placeholder="Nome da certidão (só se quiser preencher)"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                helperText="Fica totalmente protegido no seu aparelho."
              />
            </RecomecaCard>

            {/* Bloco 2: Identidade de Gênero */}
            <RecomecaCard variant="default" padding="lg" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Identidade de Gênero
                  </span>
                  <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Com qual identidade você se reconhece?
                  </h3>
                </div>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">Opcional</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((item) => {
                  const isSelected = genderIdentity === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectGender(item.id)}
                      className={cn(
                        'p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between touch-target',
                        isSelected
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                      )}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#4CAF7D] stroke-[3px]" />}
                    </button>
                  )
                })}
              </div>

              {/* Descrição opcional se selecionou trans, outro, não-binário */}
              {showGenderCustomInput && (
                <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center justify-between">
                    <span>Como prefere descrever? (opcional)</span>
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      Em suas palavras
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Mulher trans, homem trans, travesti, gênero fluido..."
                    value={genderCustomDescription}
                    onChange={(e) => setGenderCustomDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/60 text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                  />
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    Sinta-se inteiramente livre para descrever ou deixar em branco.
                  </p>
                </div>
              )}
            </RecomecaCard>

            {/* Bloco 3: Orientação Sexual / Afetiva */}
            <RecomecaCard variant="default" padding="lg" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Orientação Sexual & Afeto (LGBTQI+)
                  </span>
                  <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Qual orientação faz sentido para você?
                  </h3>
                </div>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">Opcional</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ORIENTATION_OPTIONS.map((item) => {
                  const isSelected = sexualOrientation === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectOrientation(item.id)}
                      className={cn(
                        'p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between touch-target',
                        isSelected
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                      )}
                    >
                      <span className="truncate pr-1">{item.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#4CAF7D] stroke-[3px] shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Descrição opcional para orientação */}
              {showOrientationCustomInput && (
                <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center justify-between">
                    <span>Como prefere descrever? (opcional)</span>
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      Em suas palavras
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Bissexual com preferência feminina, pansexual, demissexual..."
                    value={orientationCustomDescription}
                    onChange={(e) => setOrientationCustomDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/60 text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                  />
                </div>
              )}
            </RecomecaCard>
          </div>
        )}

        {/* =============================================================
            ETAPA 3: HÁBITOS SOBRE O DIA A DIA (O que faz, como faz, quando faz, o que ajuda)
           ============================================================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Seus hábitos sobre o dia a dia
                </h2>
                <span className="text-[11px] font-semibold text-[#4CAF7D] bg-[#E8F3EC] dark:bg-[#2A3831] px-2.5 py-1 rounded-full shrink-0">
                  Pode pular
                </span>
              </div>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Entender sua rotina ajuda o app a sugerir tarefas acolhedoras no Plano do Dia nos
                momentos certos. Tudo opcional.
              </p>
            </div>

            {/* Pergunta 1: O que seu dia tem? */}
            <RecomecaCard variant="default" padding="lg" className="space-y-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  1. O que seu dia tem?
                </span>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Atividades e compromissos que fazem parte da sua semana
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DAY_ACTIVITY_OPTIONS.map((item) => {
                  const isSelected = dayActivities.includes(item.label)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleDayActivity(item.label)}
                      className={cn(
                        'p-3 rounded-2xl text-xs font-semibold text-left border transition-all flex items-center justify-between touch-target',
                        isSelected
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                      )}
                    >
                      <span>{item.label}</span>
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                          isSelected
                            ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] border-transparent text-white dark:text-[#1C2420]'
                            : 'border-[#E1E8E2] dark:border-[#2D3A34]',
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </RecomecaCard>

            {/* Pergunta 2: Quando você costuma usar? */}
            <RecomecaCard variant="default" padding="lg" className="space-y-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  2. Quando você costuma usar ou sentir mais vontade?
                </span>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Horários em que a vontade costuma apertar
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {USAGE_TIME_OPTIONS.map((item) => {
                  const isSelected = usagePeakTimes.includes(item.id)
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleUsageTime(item.id)}
                      className={cn(
                        'p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 touch-target',
                        isSelected
                          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] hover:border-[#7FBFA8]/50',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            isSelected ? 'text-[#4CAF7D]' : 'text-[#6A7A72]',
                          )}
                        />
                        {isSelected && <Check className="w-4 h-4 text-[#4CAF7D] stroke-[3px]" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] leading-tight block">
                          {item.sub}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </RecomecaCard>

            {/* Pergunta 3: O que ajuda você hoje? */}
            <RecomecaCard variant="default" padding="lg" className="space-y-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  3. O que ajuda você hoje quando bate o estresse?
                </span>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Ações que trazem alívio e descanso para a sua mente
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {HELPFUL_OPTIONS.map((item) => {
                  const isSelected = whatHelpsToday.includes(item.label)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleHelpfulOption(item.label)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all touch-target flex items-center gap-1.5',
                        isSelected
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                      )}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </button>
                  )
                })}
              </div>
            </RecomecaCard>

            {/* Pergunta 4: Como é um dia comum? (texto livre opcional) */}
            <RecomecaCard variant="default" padding="lg" className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  4. Conte como é a sua rotina (opcional)
                </span>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Sono, trabalho e momentos livres em suas palavras
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Como é um dia comum para você?
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex.: Acordo às 7h, trabalho até as 18h, fico mais vulnerável no fim da tarde..."
                  value={commonDayDescription}
                  onChange={(e) => setCommonDayDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <RecomecaInput
                  label="Rotina de sono (opcional)"
                  placeholder="Ex.: Durmo tarde, durmo bem, sono picado..."
                  value={sleepRoutine}
                  onChange={(e) => setSleepRoutine(e.target.value)}
                />
                <RecomecaInput
                  label="Momentos livres / fins de semana (opcional)"
                  placeholder="Ex.: Fico em casa, saio com amigos..."
                  value={freeTimeRoutine}
                  onChange={(e) => setFreeTimeRoutine(e.target.value)}
                />
              </div>
            </RecomecaCard>
          </div>
        )}

        {/* =============================================================
            ETAPA 4: Para cada item escolhido (parar ou reduzir, uso atual, desde quando)
           ============================================================= */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                Seu plano para cada escolha
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Você pode querer parar completamente ou apenas reduzir. As duas decisões são
                bem-vindas.
              </p>
            </div>

            <div className="space-y-4">
              {selectedSubstances.map((id) => {
                const substanceInfo = ONBOARDING_SUBSTANCES.find((s) => s.id === id)
                const currentDetail: HabitDetailConfig = details[id] || {
                  goal: 'parar',
                  frequency: 'Diariamente',
                  sinceWhen: 'Cerca de 1 ano',
                  dailyGoalCustom: '',
                }

                return (
                  <RecomecaCard key={id} variant="default" padding="md" className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E1E8E2] dark:border-[#2D3A34] pb-2">
                      <span className="font-bold text-base text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {substanceInfo?.label || id}
                      </span>
                      <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                        {substanceInfo?.category === 'remedio' ? 'Medicamento' : 'Hábito'}
                      </span>
                    </div>

                    {/* Parar ou Reduzir */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                        Qual é a sua meta principal?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updateDetail(id, 'goal', 'parar')}
                          className={cn(
                            'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target',
                            currentDetail.goal === 'parar'
                              ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                              : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                          )}
                        >
                          Parar de vez
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDetail(id, 'goal', 'reduzir')}
                          className={cn(
                            'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target',
                            currentDetail.goal === 'reduzir'
                              ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                              : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                          )}
                        >
                          Reduzir aos poucos
                        </button>
                      </div>
                    </div>

                    {/* Quanto usa hoje */}
                    <RecomecaInput
                      label="Quanto costuma usar hoje?"
                      placeholder="Ex.: 3 latas nos fins de semana / 4 cafés por dia"
                      value={currentDetail.frequency}
                      onChange={(e) => updateDetail(id, 'frequency', e.target.value)}
                    />

                    {/* Desde quando */}
                    <RecomecaInput
                      label="Desde quando isso faz parte da sua rotina?"
                      placeholder="Ex.: Há 6 meses / Há alguns anos"
                      value={currentDetail.sinceWhen}
                      onChange={(e) => updateDetail(id, 'sinceWhen', e.target.value)}
                    />

                    {/* Meta do dia editável */}
                    <div className="space-y-1">
                      <RecomecaInput
                        label="Sua meta para o dia (campo livre)"
                        placeholder="Ex.: até 6 cigarros, 2 xícaras, 0 doses, 1g..."
                        value={currentDetail.dailyGoalCustom || ''}
                        onChange={(e) => updateDetail(id, 'dailyGoalCustom', e.target.value)}
                        helperText="Você decide a sua meta em suas próprias palavras. O app nunca impõe nem sugere quantidade."
                      />
                    </div>
                  </RecomecaCard>
                )
              })}
            </div>
          </div>
        )}

        {/* =============================================================
            ETAPA 5: AVISO DE SEGURANÇA (Obrigatório se álcool, calmante ou opioide)
           ============================================================= */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                Sua saúde em primeiro lugar
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Cuidar de si exige responsabilidade médica e muito carinho.
              </p>
            </div>

            {hasHighRiskSubstance ? (
              <RecomecaCard
                variant="default"
                padding="lg"
                className="border-l-4 border-l-[#E86A4C] space-y-4"
              >
                <div className="flex items-center gap-2.5 text-[#E86A4C] dark:text-[#F07856] font-bold text-base">
                  <ShieldAlert className="w-6 h-6" />
                  <span>Aviso Importante de Segurança</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                  &ldquo;Parar de uma vez pode ser perigoso. Converse com um médico antes.&rdquo;
                </div>

                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Para substâncias como <strong>álcool</strong>,{' '}
                  <strong>calmantes/ansiolíticos</strong> e <strong>opioides</strong>, o corpo pode
                  sofrer com a abstinência súbita. O desmame ou a parada precisa ser planejada com
                  um profissional de saúde.
                </p>

                <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Serviços Públicos Gratuitos e Confidenciais
                  </span>

                  <a
                    href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] transition-colors"
                  >
                    <span>Encontrar CAPS AD no seu município</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href="tel:192"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-bold text-[#E86A4C] dark:text-[#F07856] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4" />
                      Ligar SAMU 192 (Em caso de mal-estar grave)
                    </span>
                    <span>192</span>
                  </a>
                </div>
              </RecomecaCard>
            ) : (
              <RecomecaCard variant="default" padding="lg" className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#4CAF7D] dark:text-[#5DBF8C] font-bold text-base">
                  <ShieldCheck className="w-6 h-6" />
                  <span>Orientações de Cuidado</span>
                </div>

                <p className="text-sm text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                  Mesmo em hábitos como tabaco, cigarro, cafeína ou açúcar, o processo é mais suave
                  quando respeitamos o ritmo do nosso corpo.
                </p>

                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Lembre-se: este aplicativo é um diário de apoio e autoconhecimento. Ele não
                  prescreve tratamentos nem substitui consultas médicas.
                </p>
              </RecomecaCard>
            )}
          </div>
        )}

        {/* =============================================================
            ETAPA 6: Contato de emergência
           ============================================================= */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                Quem é seu porto seguro?
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Alguém de confiança para quem você possa ligar ou mandar WhatsApp com um toque se
                bater a crise.
              </p>
            </div>

            <RecomecaCard variant="default" padding="lg" className="space-y-4">
              <div className="flex items-center gap-2.5 text-[#2F4A3E] dark:text-[#8FCCAE] font-semibold text-sm">
                <HeartHandshake className="w-5 h-5 text-[#7FBFA8]" />
                <span>Contato de emergência pessoal</span>
              </div>

              <RecomecaInput
                label="Nome da pessoa de confiança"
                placeholder="Ex.: Mariana (Irmã), Carlos (Amigo)..."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />

              <RecomecaInput
                label="Telefone com DDD"
                placeholder="Ex.: (11) 98765-4321"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                helperText="Usado pelo botão SOS para discagem e mensagem de WhatsApp."
              />

              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactNotified}
                  onChange={(e) => setContactNotified(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#7FBFA8] focus:ring-[#7FBFA8] border-[#E1E8E2]"
                />
                <span className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
                  Já conversei e avisei essa pessoa que ela é meu contato de emergência no Recomeça.
                </span>
              </label>
            </RecomecaCard>
          </div>
        )}

        {/* =============================================================
            ETAPA 7: Situações de Risco (opcional) + Consentimento LGPD & Início
           ============================================================= */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                Seus momentos e início seguro
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Entender onde a onda costuma apertar ajuda o app a sugerir ações práticas na hora
                certa. Tudo opcional.
              </p>
            </div>

            <RecomecaCard
              variant="default"
              padding="md"
              className="space-y-3.5 border-l-4 border-l-[#7FBFA8]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Autoconhecimento • Tudo opcional
                  </span>
                  <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Quais situações costumam te levar a usar?
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-[#4CAF7D] bg-[#E8F3EC] dark:bg-[#2A3831] px-2 py-0.5 rounded-full">
                  Pode pular
                </span>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Toque nas que fazem sentido para você. Usamos isso para sugerir ações do plano do
                dia antes da vontade virar bar:
              </p>

              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_RISK_SITUATIONS.map((risk) => {
                  const isSelected = selectedRisks.includes(risk.label)
                  return (
                    <button
                      key={risk.id}
                      type="button"
                      onClick={() => toggleRiskSituation(risk.label)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold text-left border transition-all touch-target flex items-center gap-1.5',
                        isSelected
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-xs'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]',
                      )}
                    >
                      <span>{risk.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </button>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5">
                <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                  Outra situação de risco pessoal (opcional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Fim do expediente na sexta, briga em família..."
                    value={customRiskInput}
                    onChange={(e) => setCustomRiskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomRisk()
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRisk}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] hover:bg-[#7FBFA8]/20 transition-colors shrink-0"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </RecomecaCard>

            <RecomecaCard variant="highlight" padding="lg" className="space-y-4">
              <div className="flex items-center gap-2 text-[#2F4A3E] dark:text-[#8FCCAE] font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>Compromisso do Recomeça com você</span>
              </div>

              <ul className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] space-y-2 leading-relaxed">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                  Suas notificações no celular serão sempre discretas.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                  Se houver tropeço, seu histórico e sua melhor sequência continuam com você.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                  O botão SOS estará visível em todas as telas para quando você precisar.
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                Este app não substitui tratamento. Em emergência, ligue 192.
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#7FBFA8] focus:ring-[#7FBFA8] border-[#E1E8E2]"
                />
                <span className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
                  Concordo com a coleta confidencial dos meus dados de saúde e hábitos para uso
                  exclusivo dentro do app (LGPD).
                </span>
              </label>
            </RecomecaCard>
          </div>
        )}

        {/* Mensagem de Erro Gentil */}
        {validationError && (
          <div className="p-3 rounded-2xl bg-[#D96C68]/10 border border-[#D96C68]/30 text-xs font-semibold text-[#D96C68] animate-fade-in">
            {validationError}
          </div>
        )}
      </div>

      {/* Botões de Ação Inferiores */}
      <div className="pt-6 pb-2 border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60">
        <RecomecaButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          rightIcon={
            currentStep === TOTAL_STEPS ? (
              <Check className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )
          }
        >
          {currentStep === TOTAL_STEPS ? 'Começar agora' : 'Continuar'}
        </RecomecaButton>
      </div>
    </div>
  )
}
