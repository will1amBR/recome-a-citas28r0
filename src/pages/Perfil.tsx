import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  RecomecaInput,
  ScreenHeader,
  LegalNoticeFooter,
  ConfirmationModal,
} from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { useAuth } from '@/lib/authContext'
import { MOCK_USER } from '@/lib/mockData'
import {
  isPinSet,
  savePin,
  removePin,
  isBiometricsConfigured,
  setBiometricsConfigured,
  isBiometricsAvailableOnDevice,
} from '@/lib/securityPin'
import {
  collectAllUserData,
  downloadUserDataFiles,
  deleteAllUserDataAndAccount,
} from '@/services/privacyService'
import {
  createDoctorLinkCode,
  getPatientDoctorLinks,
  revokeDoctorLink,
  upsertPatientSummaryForDoctor,
  DoctorLinkData,
} from '@/services/doctorService'
import {
  User,
  Moon,
  Sun,
  ShieldCheck,
  HeartHandshake,
  Lock,
  FileText,
  Activity,
  Heart,
  ChevronRight,
  Sparkles,
  CalendarDays,
  Clock,
  Check,
  PenLine,
  Smile,
  LogOut,
  LogIn,
  UploadCloud,
  Lightbulb,
  Calendar,
  KeyRound,
  Fingerprint,
  Download,
  Trash2,
  Stethoscope,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Perfil() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const {
    contact,
    habits,
    updateHabitGoal,
    identity,
    updateIdentity,
    userGreetingName,
    dailyRoutine,
    updateDailyRoutine,
    isDemoUser,
    hasLocalDataToImport,
    importLocalDataToBackend,
    isImporting,
    userRiskSituations,
    planIntentions,
    addPlanIntention,
    removePlanIntention,
    medicalAppointment,
    updateMedicalAppointment,
    updateContact,
  } = useRecomecaStore()

  const [customRiskInput, setCustomRiskInput] = React.useState<string>('')

  // Estados de Privacidade: PIN e Biometria
  const [hasPin, setHasPin] = React.useState<boolean>(() => isPinSet())
  const [isSettingPin, setIsSettingPin] = React.useState<boolean>(false)
  const [pinValue, setPinValue] = React.useState<string>('')
  const [pinConfirmValue, setPinConfirmValue] = React.useState<string>('')
  const [pinError, setPinError] = React.useState<string | null>(null)
  const [pinSuccess, setPinSuccess] = React.useState<string | null>(null)

  const [biometricsAvailable, setBiometricsAvailable] = React.useState<boolean>(false)
  const [biometricsEnabled, setBiometricsEnabled] = React.useState<boolean>(() =>
    isBiometricsConfigured(),
  )

  React.useEffect(() => {
    isBiometricsAvailableOnDevice().then((avail) => {
      setBiometricsAvailable(avail)
    })
  }, [])

  // Estados de Exportar e Apagar Conta
  const [isExporting, setIsExporting] = React.useState<boolean>(false)
  const [exportSuccess, setExportSuccess] = React.useState<boolean>(false)

  // Modal de apagar conta em duas etapas
  const [deleteStep, setDeleteStep] = React.useState<number>(0) // 0: fechado, 1: primeiro aviso, 2: digitar APAGAR
  const [confirmInput, setConfirmInput] = React.useState<string>('')
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  // Estados da Seção "Meu Médico" (Vínculo e visualização)
  const [doctorLinks, setDoctorLinks] = React.useState<DoctorLinkData[]>([])
  const [isGeneratingCode, setIsGeneratingCode] = React.useState<boolean>(false)
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null)
  const [copiedDoctorCode, setCopiedDoctorCode] = React.useState<boolean>(false)
  const [doctorMsg, setDoctorMsg] = React.useState<string | null>(null)

  // Carrega links com médicos
  const loadDoctorLinks = React.useCallback(async () => {
    if (!user?.id) return
    const links = await getPatientDoctorLinks(user.id)
    setDoctorLinks(links)
  }, [user?.id])

  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadDoctorLinks()
    }
  }, [isAuthenticated, user?.id, loadDoctorLinks])

  // Sincroniza resumo com o médico caso haja link ativo
  const syncSummaryWithDoctor = React.useCallback(async () => {
    if (!user?.id) return
    const activeLink = doctorLinks.find((l) => l.status === 'active')
    await upsertPatientSummaryForDoctor({
      patient: user.id,
      doctor: activeLink?.doctor || undefined,
      patient_display_name: userGreetingName || user?.name || 'Paciente',
      substances_summary: habits.map((h) => ({
        name: h.name,
        goal: h.goalType === 'parar' ? 'Parar de vez' : 'Reduzir aos poucos',
        cleanDays: h.currentStreakDays,
        bestStreak: h.bestStreakDays,
        cleanDaysMonth: h.cleanDaysThisMonth || h.currentStreakDays,
      })),
      relapse_alerts: [],
      med_screening_answers: [
        { question: 'Precisou tomar mais para fazer o mesmo efeito?', answeredYes: false },
        { question: 'Sentiu vontade de tomar antes do horário prescrito?', answeredYes: false },
        { question: 'A caixa acabou antes do previsto ou perdeu comprimidos?', answeredYes: false },
        {
          question: 'Pegou receita com mais de um médico para o mesmo sintoma?',
          answeredYes: false,
        },
      ],
      sleep_summary: dailyRoutine.sleepRoutine
        ? [{ week: 'Semana atual', answer: 'Anotado', note: dailyRoutine.sleepRoutine }]
        : [],
      milestones_summary: [{ title: 'Início do acompanhamento', isAchieved: true }],
      next_appointment: medicalAppointment.date
        ? `${medicalAppointment.date}${medicalAppointment.time ? ` às ${medicalAppointment.time}` : ''}${medicalAppointment.doctorName ? ` (${medicalAppointment.doctorName})` : ''}`
        : 'Não agendada',
      updated_at_display: new Date().toLocaleDateString('pt-BR'),
    })
  }, [
    user?.id,
    user?.name,
    userGreetingName,
    habits,
    dailyRoutine.sleepRoutine,
    medicalAppointment,
    doctorLinks,
  ])

  React.useEffect(() => {
    if (isAuthenticated && user?.id && doctorLinks.some((l) => l.status === 'active')) {
      syncSummaryWithDoctor()
    }
  }, [isAuthenticated, user?.id, doctorLinks, syncSummaryWithDoctor])

  // Handlers para PIN
  const handleSaveNewPin = () => {
    setPinError(null)
    setPinSuccess(null)
    if (!/^\d{4,6}$/.test(pinValue)) {
      setPinError('O PIN deve conter de 4 a 6 números.')
      return
    }
    if (pinValue !== pinConfirmValue) {
      setPinError('A confirmação do PIN não confere. Digite com calma.')
      return
    }
    savePin(pinValue)
    setHasPin(true)
    setIsSettingPin(false)
    setPinValue('')
    setPinConfirmValue('')
    setPinSuccess('PIN ativado com sucesso! Seu app está protegido.')
    setTimeout(() => setPinSuccess(null), 4000)
  }

  const handleRemovePin = () => {
    removePin()
    setHasPin(false)
    setBiometricsEnabled(false)
    setPinSuccess('PIN removido. As telas voltam a abrir diretamente.')
    setTimeout(() => setPinSuccess(null), 4000)
  }

  const handleToggleBiometrics = (checked: boolean) => {
    setBiometricsConfigured(checked)
    setBiometricsEnabled(checked)
  }

  // Exportar dados
  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const data = await collectAllUserData(
        user?.id || 'local_user',
        user?.email || 'usuario@local',
        userGreetingName || user?.name || 'Usuário Recomeça',
      )
      downloadUserDataFiles(data)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 5000)
    } finally {
      setIsExporting(false)
    }
  }

  // Apagar conta
  const handleConfirmDelete = async () => {
    if (confirmInput.trim().toUpperCase() !== 'APAGAR') return
    setIsDeleting(true)
    try {
      if (user?.id) {
        await deleteAllUserDataAndAccount(user.id)
      } else {
        localStorage.clear()
        sessionStorage.clear()
      }
      logout()
      setDeleteStep(0)
      navigate('/', { replace: true })
    } finally {
      setIsDeleting(false)
    }
  }

  // Gerar código para o médico
  const handleGenerateDoctorCode = async () => {
    if (!user?.id) return
    setIsGeneratingCode(true)
    setDoctorMsg(null)
    try {
      const link = await createDoctorLinkCode(
        user.id,
        userGreetingName || user?.name || 'Paciente Recomeça',
      )
      setGeneratedCode(link.code)
      loadDoctorLinks()
    } catch {
      setDoctorMsg('Não foi possível gerar o código agora. Tente de novo.')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  // Desvincular médico
  const handleRevokeDoctor = async (linkId: string) => {
    await revokeDoctorLink(linkId)
    setDoctorMsg('Vínculo desfeito com sucesso. O médico não tem mais acesso ao resumo.')
    loadDoctorLinks()
    setTimeout(() => setDoctorMsg(null), 4000)
  }

  // Estado para edição inline da meta do dia de cada vício
  const [editingHabitId, setEditingHabitId] = React.useState<string | null>(null)
  const [goalInputValue, setGoalInputValue] = React.useState<string>('')

  // Edição inline da seção "Quem é você"
  const [isEditingIdentity, setIsEditingIdentity] = React.useState<boolean>(false)
  const [tempPreferredName, setTempPreferredName] = React.useState(identity.preferredName || '')
  const [tempSocialName, setTempSocialName] = React.useState(identity.socialName || '')
  const [tempLegalName, setTempLegalName] = React.useState(identity.legalName || '')
  const [tempGender, setTempGender] = React.useState(identity.genderIdentity || '')
  const [tempGenderDesc, setTempGenderDesc] = React.useState(identity.genderCustomDescription || '')
  const [tempOrientation, setTempOrientation] = React.useState(identity.sexualOrientation || '')
  const [tempOrientationDesc, setTempOrientationDesc] = React.useState(
    identity.orientationCustomDescription || '',
  )

  // Edição inline da seção "Meu dia a dia"
  const [isEditingRoutine, setIsEditingRoutine] = React.useState<boolean>(false)
  const [tempCommonDesc, setTempCommonDesc] = React.useState(
    dailyRoutine.commonDayDescription || '',
  )
  const [tempSleep, setTempSleep] = React.useState(dailyRoutine.sleepRoutine || '')
  const [tempFreeTime, setTempFreeTime] = React.useState(dailyRoutine.freeTimeRoutine || '')
  const [tempActivities, setTempActivities] = React.useState<string[]>(
    dailyRoutine.dayActivities || [],
  )
  const [tempPeakTimes, setTempPeakTimes] = React.useState<string[]>(
    dailyRoutine.usagePeakTimes || [],
  )

  // Controle de tema claro/escuro
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    return document.documentElement.classList.contains('dark')
  })

  const toggleTheme = () => {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Handlers para salvar identidade
  const handleStartEditIdentity = () => {
    setTempPreferredName(identity.preferredName || '')
    setTempSocialName(identity.socialName || '')
    setTempLegalName(identity.legalName || '')
    setTempGender(identity.genderIdentity || '')
    setTempGenderDesc(identity.genderCustomDescription || '')
    setTempOrientation(identity.sexualOrientation || '')
    setTempOrientationDesc(identity.orientationCustomDescription || '')
    setIsEditingIdentity(true)
  }

  const handleSaveIdentity = () => {
    updateIdentity({
      preferredName: tempPreferredName.trim(),
      socialName: tempSocialName.trim(),
      legalName: tempLegalName.trim(),
      genderIdentity: tempGender,
      genderCustomDescription: tempGenderDesc.trim(),
      sexualOrientation: tempOrientation,
      orientationCustomDescription: tempOrientationDesc.trim(),
    })
    setIsEditingIdentity(false)
  }

  // Handlers para salvar rotina
  const handleStartEditRoutine = () => {
    setTempCommonDesc(dailyRoutine.commonDayDescription || '')
    setTempSleep(dailyRoutine.sleepRoutine || '')
    setTempFreeTime(dailyRoutine.freeTimeRoutine || '')
    setTempActivities(dailyRoutine.dayActivities || [])
    setTempPeakTimes(dailyRoutine.usagePeakTimes || [])
    setIsEditingRoutine(true)
  }

  const handleSaveRoutine = () => {
    updateDailyRoutine({
      commonDayDescription: tempCommonDesc.trim(),
      sleepRoutine: tempSleep.trim(),
      freeTimeRoutine: tempFreeTime.trim(),
      dayActivities: tempActivities,
      usagePeakTimes: tempPeakTimes,
    })
    setIsEditingRoutine(false)
  }

  const toggleTempActivity = (act: string) => {
    setTempActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act],
    )
  }

  const toggleTempPeakTime = (timeId: string) => {
    setTempPeakTimes((prev) =>
      prev.includes(timeId) ? prev.filter((t) => t !== timeId) : [...prev, timeId],
    )
  }

  const formatGenderLabel = (id?: string) => {
    if (!id) return 'Não informado'
    const map: Record<string, string> = {
      mulher: 'Mulher',
      homem: 'Homem',
      'nao-binario': 'Não-binário',
      trans: 'Trans',
      outro: 'Outro',
      'prefiro-nao-dizer': 'Prefiro não dizer',
    }
    return map[id] || id
  }

  const formatOrientationLabel = (id?: string) => {
    if (!id) return 'Não informado'
    const map: Record<string, string> = {
      heterossexual: 'Heterossexual',
      lesbica: 'Lésbica',
      gay: 'Gay',
      bissexual: 'Bissexual',
      pansexual: 'Pansexual',
      assexual: 'Assexual',
      outra: 'Outra',
      'prefiro-nao-dizer': 'Prefiro não dizer',
    }
    return map[id] || id
  }

  const formatTimeLabel = (id: string) => {
    const map: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite',
      madrugada: 'Madrugada',
    }
    return map[id] || id
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Suas preferências, dados de apoio e privacidade protegida."
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            1. CABEÇALHO DO PERFIL COM NOME REAL / PREFERIDO & CONTA
           ============================================================= */}
        <section className="space-y-2">
          {/* Card de aviso se for usuário de demonstração */}
          {isDemoUser && (
            <div className="p-3 rounded-2xl bg-[#FDFAF5] dark:bg-[#202723] border border-[#7FBFA8]/50 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#E8A84C]/20 text-[#E8A84C] font-bold text-[10px] uppercase">
                  Demonstração
                </span>
                <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
                  Explorando com a usuária fictícia Camila
                </span>
              </div>
              <Link
                to="/login"
                className="text-xs font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline flex items-center gap-1 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar / Cadastrar</span>
              </Link>
            </div>
          )}

          {/* Convite gentil de importação se houver dados locais */}
          {isAuthenticated && hasLocalDataToImport && (
            <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8] space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE]">
                <UploadCloud className="w-4 h-4 text-[#4CAF7D]" />
                <span>Quer que a gente leve o que você já registrou neste aparelho?</span>
              </div>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Você tem respostas de onboarding gravadas neste navegador. Podemos sincronizar tudo
                na sua conta segura com um toque.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={importLocalDataToBackend}
                  disabled={isImporting}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold hover:bg-[#6DA98F] transition-colors"
                >
                  {isImporting ? 'Salvando...' : 'Sim, sincronizar agora'}
                </button>
              </div>
            </div>
          )}

          <RecomecaCard variant="highlight" padding="lg" className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] text-[#2F4A3E] dark:text-[#1C2420] font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm">
              {(userGreetingName || (isAuthenticated ? user?.email : MOCK_USER.name) || 'U')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                {userGreetingName || (isAuthenticated ? user?.name || user?.email : MOCK_USER.name)}
              </h2>
              {identity.socialName && (
                <p className="text-xs text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold truncate">
                  Nome social: {identity.socialName}
                </p>
              )}
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] truncate">
                {isAuthenticated
                  ? `Conta conectada • ${user?.email}`
                  : `Membro desde ${MOCK_USER.sinceYear} • ID Anônimo: ${MOCK_USER.anonymousId}`}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4CAF7D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7D]" />
                  {isAuthenticated ? 'Banco de dados ativo' : 'Espaço individual protegido'}
                </span>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[11px] font-bold text-[#D96C68] hover:underline ml-auto flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sair da conta</span>
                  </button>
                )}
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. QUEM É VOCÊ (NOVA SEÇÃO: VISUALIZAR E EDITAR)
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#7FBFA8]" />
              <span>Quem é você</span>
            </h3>
            {!isEditingIdentity ? (
              <button
                type="button"
                onClick={handleStartEditIdentity}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingIdentity(false)}
                className="text-xs text-[#6A7A72] hover:text-[#2F4A3E]"
              >
                Cancelar
              </button>
            )}
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3.5">
            {isEditingIdentity ? (
              <div className="space-y-3 animate-fade-in">
                <RecomecaInput
                  label="Como gosta de ser chamada? (nome no app)"
                  placeholder="Ex.: Camila, Dani, Leo..."
                  value={tempPreferredName}
                  onChange={(e) => setTempPreferredName(e.target.value)}
                />

                <RecomecaInput
                  label="Nome social (se tiver, opcional)"
                  placeholder="Seu nome social"
                  value={tempSocialName}
                  onChange={(e) => setTempSocialName(e.target.value)}
                />

                <RecomecaInput
                  label="Nome de registro (opcional)"
                  placeholder="Nome de registro"
                  value={tempLegalName}
                  onChange={(e) => setTempLegalName(e.target.value)}
                />

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Identidade de gênero:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'mulher', label: 'Mulher' },
                      { id: 'homem', label: 'Homem' },
                      { id: 'nao-binario', label: 'Não-binário' },
                      { id: 'trans', label: 'Trans' },
                      { id: 'outro', label: 'Outro' },
                      { id: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setTempGender(g.id)}
                        className={cn(
                          'p-2 rounded-xl text-xs font-bold border transition-all text-left touch-target',
                          tempGender === g.id
                            ? 'bg-[#7FBFA8] text-white border-transparent'
                            : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] border-[#E1E8E2]',
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>

                  {['trans', 'outro', 'nao-binario'].includes(tempGender) && (
                    <input
                      type="text"
                      placeholder="Como prefere descrever? (opcional)"
                      value={tempGenderDesc}
                      onChange={(e) => setTempGenderDesc(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#7FBFA8] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Orientação sexual (LGBTQI+):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'heterossexual', label: 'Heterossexual' },
                      { id: 'lesbica', label: 'Lésbica' },
                      { id: 'gay', label: 'Gay' },
                      { id: 'bissexual', label: 'Bissexual' },
                      { id: 'pansexual', label: 'Pansexual' },
                      { id: 'assexual', label: 'Assexual' },
                      { id: 'outra', label: 'Outra' },
                      { id: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
                    ].map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setTempOrientation(o.id)}
                        className={cn(
                          'p-2 rounded-xl text-xs font-bold border transition-all text-left touch-target',
                          tempOrientation === o.id
                            ? 'bg-[#7FBFA8] text-white border-transparent'
                            : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] border-[#E1E8E2]',
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>

                  {['outra', 'pansexual', 'bissexual', 'assexual'].includes(tempOrientation) && (
                    <input
                      type="text"
                      placeholder="Como prefere descrever? (opcional)"
                      value={tempOrientationDesc}
                      onChange={(e) => setTempOrientationDesc(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#7FBFA8] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <button
                    type="button"
                    onClick={() => setIsEditingIdentity(false)}
                    className="px-3 py-1.5 text-xs text-[#6A7A72] hover:text-[#2F4A3E]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveIdentity}
                    className="px-4 py-1.5 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold shadow-xs hover:bg-[#6DA98F]"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Como gosta de ser chamada
                    </span>
                    <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9] text-sm">
                      {identity.preferredName || 'Não informado'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Nome social
                    </span>
                    <span className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9] text-sm">
                      {identity.socialName || 'Não informado'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Identidade de Gênero
                    </span>
                    <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      {formatGenderLabel(identity.genderIdentity)}
                    </span>
                    {identity.genderCustomDescription && (
                      <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block mt-0.5">
                        &ldquo;{identity.genderCustomDescription}&rdquo;
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Orientação (LGBTQI+)
                    </span>
                    <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      {formatOrientationLabel(identity.sexualOrientation)}
                    </span>
                    {identity.orientationCustomDescription && (
                      <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block mt-0.5">
                        &ldquo;{identity.orientationCustomDescription}&rdquo;
                      </span>
                    )}
                  </div>
                </div>

                {identity.legalName && (
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                    Nome de registro protegido: <strong>{identity.legalName}</strong>
                  </p>
                )}
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. MEU DIA A DIA (NOVA SEÇÃO: VISUALIZAR E EDITAR)
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#7FBFA8]" />
              <span>Meu dia a dia & Rotina</span>
            </h3>
            {!isEditingRoutine ? (
              <button
                type="button"
                onClick={handleStartEditRoutine}
                className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingRoutine(false)}
                className="text-xs text-[#6A7A72] hover:text-[#2F4A3E]"
              >
                Cancelar
              </button>
            )}
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3.5">
            {isEditingRoutine ? (
              <div className="space-y-3 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Como é um dia comum para você?
                  </label>
                  <textarea
                    rows={2}
                    value={tempCommonDesc}
                    onChange={(e) => setTempCommonDesc(e.target.value)}
                    placeholder="Conte um pouco da sua rotina..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#7FBFA8] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Horários de maior vontade / uso:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['manha', 'tarde', 'noite', 'madrugada'].map((tId) => (
                      <button
                        key={tId}
                        type="button"
                        onClick={() => toggleTempPeakTime(tId)}
                        className={cn(
                          'p-2 rounded-xl text-xs font-bold border transition-all text-left touch-target flex items-center justify-between',
                          tempPeakTimes.includes(tId)
                            ? 'bg-[#7FBFA8] text-white border-transparent'
                            : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] border-[#E1E8E2]',
                        )}
                      >
                        <span>{formatTimeLabel(tId)}</span>
                        {tempPeakTimes.includes(tId) && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <RecomecaInput
                  label="Rotina de sono (opcional)"
                  placeholder="Ex.: Durmo tarde, durmo bem..."
                  value={tempSleep}
                  onChange={(e) => setTempSleep(e.target.value)}
                />

                <RecomecaInput
                  label="Momentos livres / fins de semana (opcional)"
                  placeholder="Ex.: Fico em casa, saio para caminhar..."
                  value={tempFreeTime}
                  onChange={(e) => setTempFreeTime(e.target.value)}
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <button
                    type="button"
                    onClick={() => setIsEditingRoutine(false)}
                    className="px-3 py-1.5 text-xs text-[#6A7A72] hover:text-[#2F4A3E]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRoutine}
                    className="px-4 py-1.5 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold shadow-xs hover:bg-[#6DA98F]"
                  >
                    Salvar rotina
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {dailyRoutine.commonDayDescription && (
                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Como é um dia comum
                    </span>
                    <p className="text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                      &ldquo;{dailyRoutine.commonDayDescription}&rdquo;
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      Quando costuma usar / pico
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dailyRoutine.usagePeakTimes.length > 0 ? (
                        dailyRoutine.usagePeakTimes.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-[#E8F3EC] dark:bg-[#2A3831] text-[11px] font-bold text-[#2F4A3E] dark:text-[#8FCCAE]"
                          >
                            {formatTimeLabel(t)}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#6A7A72]">Não informado</span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] uppercase font-bold block">
                      O que seu dia tem
                    </span>
                    <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block mt-1">
                      {dailyRoutine.dayActivities.length > 0
                        ? `${dailyRoutine.dayActivities.length} atividades mapeadas`
                        : 'Não informado'}
                    </span>
                  </div>
                </div>

                {dailyRoutine.whatHelpsToday.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] font-semibold block">
                      O que ajuda quando a onda sobe:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dailyRoutine.whatHelpsToday.map((h) => (
                        <span
                          key={h}
                          className="px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[10px] font-semibold text-[#4CAF7D] dark:text-[#8FCCAE]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            3b. PLANO SE–ENTÃO (Prevenção de Recaída)
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Meus Planos Se–Então
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-[#4CAF7D] bg-[#E8F3EC] dark:bg-[#2A3831] px-2 py-0.5 rounded-full">
              Prevenção de Recaída
            </span>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Pares &ldquo;Se [situação], então [minha ação]&rdquo;. Quando a vontade bater, seu
              plano já estará definido.
            </p>

            {/* Lista dos planos existentes */}
            <div className="space-y-2">
              {planIntentions.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-start justify-between gap-2"
                >
                  <div className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                    <strong className="text-[#4CAF7D]">Se</strong> {plan.se_situacao},{' '}
                    <strong className="text-[#7FBFA8]">então</strong> {plan.entao_acao}.
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlanIntention(plan.id)}
                    className="text-[#6A7A72] hover:text-[#D96C68] text-xs p-1 touch-target shrink-0"
                    aria-label="Remover plano"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Sugestões a partir das situações de risco já cadastradas */}
            {userRiskSituations.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                  Usar uma situação que você marcou:
                </span>
                <div className="flex flex-wrap gap-1">
                  {userRiskSituations.slice(0, 4).map((sit) => (
                    <button
                      key={sit}
                      type="button"
                      onClick={() => setCustomRiskInput(sit)}
                      className="text-[11px] px-2 py-1 rounded-lg bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] hover:bg-[#7FBFA8]/20 transition-colors"
                    >
                      + {sit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Formulário de novo plano */}
            <div className="space-y-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
              <span className="text-[11px] font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Criar novo plano:
              </span>
              <input
                type="text"
                placeholder="Se... (ex.: bater vontade forte depois do trabalho)"
                value={customRiskInput}
                onChange={(e) => setCustomRiskInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
              />
              <input
                type="text"
                placeholder="Então... (ex.: caminho 15 min ouvindo chuva antes de ir para casa)"
                value={goalInputValue}
                onChange={(e) => setGoalInputValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
              />
              <button
                type="button"
                disabled={!customRiskInput.trim() || !goalInputValue.trim()}
                onClick={async () => {
                  if (customRiskInput.trim() && goalInputValue.trim()) {
                    await addPlanIntention(customRiskInput.trim(), goalInputValue.trim())
                    setCustomRiskInput('')
                    setGoalInputValue('')
                  }
                }}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#7FBFA8] hover:bg-[#6DA98F] text-white disabled:opacity-40 transition-all touch-target"
              >
                Salvar plano se–então
              </button>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3c. PRÓXIMA CONSULTA MÉDICA
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Próxima Consulta Médica
              </h3>
            </div>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              No dia da consulta, o Recomeça te lembra com carinho e prepara um resumo com o que
              você registrou.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Data da consulta
                </label>
                <input
                  type="date"
                  value={medicalAppointment.date}
                  onChange={(e) =>
                    updateMedicalAppointment({
                      ...medicalAppointment,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Horário (opcional)
                </label>
                <input
                  type="time"
                  value={medicalAppointment.time}
                  onChange={(e) =>
                    updateMedicalAppointment({
                      ...medicalAppointment,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Profissional ou Local (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex.: Dra. Beatriz / CAPS AD"
                value={medicalAppointment.doctorName}
                onChange={(e) =>
                  updateMedicalAppointment({
                    ...medicalAppointment,
                    doctorName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
              />
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. HÁBITOS EM ACOMPANHAMENTO
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Hábitos em Acompanhamento
            </h3>
            <Link to="/onboarding" className="text-xs font-semibold text-[#7FBFA8] hover:underline">
              Editar no fluxo
            </Link>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => {
              const isEditing = editingHabitId === habit.id

              const handleStartEdit = () => {
                setEditingHabitId(habit.id)
                setGoalInputValue(
                  habit.dailyGoalCustom ||
                    (habit.dailyLimit ? `até ${habit.dailyLimit} ${habit.unit || 'unidades'}` : ''),
                )
              }

              const handleSaveGoal = () => {
                const numMatch = goalInputValue.match(/\d+/)
                const parsedNum = numMatch ? parseInt(numMatch[0], 10) : undefined
                updateHabitGoal(habit.id, goalInputValue.trim(), parsedNum)
                setEditingHabitId(null)
              }

              return (
                <RecomecaCard key={habit.id} variant="default" padding="md" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                          {habit.name}
                        </h4>
                        <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                          {habit.goalType === 'parar'
                            ? 'Objetivo: Parar de vez'
                            : 'Objetivo: Reduzir aos poucos'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                        {habit.currentStreakDays} dias
                      </span>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                        Melhor: {habit.bestStreakDays}d
                      </span>
                    </div>
                  </div>

                  {/* Meta do dia editável para este vício */}
                  <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6A7A72] dark:text-[#A0B0A7] font-semibold">
                        Meta do dia:
                      </span>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={handleStartEdit}
                          className="text-[#4CAF7D] dark:text-[#8FCCAE] font-bold hover:underline"
                        >
                          {habit.dailyGoalCustom ? 'Editar meta' : 'Definir meta'}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 animate-fade-in pt-1">
                        <input
                          type="text"
                          value={goalInputValue}
                          onChange={(e) => setGoalInputValue(e.target.value)}
                          placeholder="Ex.: até 5 cigarros, 2 xícaras, 0 doses..."
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#7FBFA8] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                        />
                        <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                          Campo livre: você decide a sua meta em suas palavras. O app nunca sugere
                          doses.
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingHabitId(null)}
                            className="px-2.5 py-1 text-xs text-[#6A7A72] hover:text-[#2F4A3E]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveGoal}
                            className="px-3 py-1 rounded-lg bg-[#7FBFA8] text-white text-xs font-bold"
                          >
                            Salvar meta
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE]">
                        {habit.dailyGoalCustom ||
                          (habit.dailyLimit
                            ? `Até ${habit.dailyLimit} ${habit.unit || 'unidades'}`
                            : 'Nenhuma meta definida')}
                      </p>
                    )}
                  </div>
                </RecomecaCard>
              )
            })}
          </div>
        </section>

        {/* =============================================================
            5. CONTATO DE EMERGÊNCIA CONFIGURADO
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Contato de Emergência Atual
            </h3>
            <Link to="/onboarding" className="text-xs font-semibold text-[#7FBFA8] hover:underline">
              Editar
            </Link>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                    {contact.name || 'Contato não configurado'}
                  </h4>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block truncate">
                    {contact.displayPhone || contact.phone || 'Sem telefone'}
                  </span>
                </div>
              </div>

              {contact.hasConsent ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] border border-[#4CAF7D]/30 shrink-0">
                  Já avisado
                </span>
              ) : (
                (contact.phone || contact.displayPhone) && (
                  <a
                    href={`https://wa.me/${(contact.phone || contact.displayPhone || '').replace(/\D/g, '').startsWith('55') ? (contact.phone || contact.displayPhone || '').replace(/\D/g, '') : `55${(contact.phone || contact.displayPhone || '').replace(/\D/g, '')}`}?text=${encodeURIComponent(
                      `Oi, ${contact.name || 'tudo bem'}. Estou cuidando de mim e comecei um acompanhamento. Talvez eu peça sua ajuda de vez em quando. Obrigado por estar na minha rede.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => updateContact({ hasConsent: true })}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#7FBFA8] text-white hover:bg-[#6DA98F] transition-colors shrink-0"
                  >
                    <span>Avisar pessoa (WhatsApp)</span>
                  </a>
                )
              )}
            </div>

            <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34] leading-relaxed">
              O botão SOS e a tela de Apoio acionam diretamente este contato para ligação e
              conversa.
            </p>
          </RecomecaCard>
        </section>

        {/* =============================================================
            6. PREFERÊNCIAS VISUAIS (TEMA CLARO / ESCURO)
           ============================================================= */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
            Aparência
          </h3>

          <RecomecaCard
            variant="default"
            padding="md"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Modo Escuro (Dark Mode)
                </h4>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Tons suaves e confortáveis para a noite
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar modo claro e escuro"
              className={cn(
                'w-12 h-7 rounded-full p-1 transition-colors touch-target focus-visible:outline-2 focus-visible:outline-[#7FBFA8]',
                isDarkMode ? 'bg-[#7FBFA8]' : 'bg-[#C4CFC8]',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-white transition-transform',
                  isDarkMode ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </RecomecaCard>
        </section>

        {/* =============================================================
            7. MEU MÉDICO / VÍNCULO PROFISSIONAL (PARTE 2 DO PROMPT)
           ============================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#7FBFA8]" />
              <span>Meu Médico / Terapeuta</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#4CAF7D] bg-[#E8F3EC] dark:bg-[#2A3831] px-2 py-0.5 rounded-full">
              Com seu consentimento
            </span>
          </div>

          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Você pode permitir que seu médico ou terapeuta acompanhe seu resumo clínico pelo
              painel dele. Ele vê apenas dias limpos, sequência, sinais de remédio e sono.
            </p>

            <div className="p-2.5 rounded-xl bg-[#E8F3EC]/70 dark:bg-[#2A3831]/70 border border-[#7FBFA8]/30 text-xs text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#4CAF7D] shrink-0" />
              <span>
                <strong>Garantia ética:</strong> Seu médico <strong>NUNCA</strong> vê seu diário,
                textos livres de episódios nem fotos de recibos.
              </span>
            </div>

            {/* Lista de médicos vinculados */}
            {doctorLinks.filter((l) => l.status === 'active').length > 0 && (
              <div className="space-y-2 pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                <span className="text-[11px] font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Profissionais com acesso ao seu resumo:
                </span>
                {doctorLinks
                  .filter((l) => l.status === 'active')
                  .map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                          {link.doctor_name || 'Dr(a). Profissional'}
                        </h4>
                        <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                          {link.doctor_crm ? `CRM/Conselho: ${link.doctor_crm} • ` : ''}
                          Pode ver seu resumo. Ele nunca vê seu diário.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRevokeDoctor(link.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#D96C68] hover:bg-[#FBEBEA] dark:hover:bg-[#331C1A] border border-[#D96C68]/30 transition-colors"
                      >
                        Desvincular
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Gerador de código para novo médico */}
            <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-2">
              <span className="text-[11px] font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                Conectar com novo profissional:
              </span>

              {generatedCode ? (
                <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8] space-y-2 animate-fade-in">
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                    Passe este código para o seu médico digitar em /profissional:
                  </span>
                  <div className="flex items-center justify-between bg-white dark:bg-[#242E29] p-2.5 rounded-xl border border-[#7FBFA8]/50">
                    <span className="text-lg font-mono font-bold tracking-widest text-[#2F4A3E] dark:text-[#8FCCAE]">
                      {generatedCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(generatedCode)
                          setCopiedDoctorCode(true)
                          setTimeout(() => setCopiedDoctorCode(false), 2000)
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-[#7FBFA8] text-white text-xs font-bold flex items-center gap-1"
                    >
                      {copiedDoctorCode ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedDoctorCode ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateDoctorCode}
                  disabled={isGeneratingCode || !isAuthenticated}
                  className="w-full py-2.5 rounded-xl bg-[#7FBFA8] hover:bg-[#6DA98F] text-white text-xs font-bold transition-all disabled:opacity-40"
                >
                  {isGeneratingCode
                    ? 'Gerando código...'
                    : !isAuthenticated
                      ? 'Faça login para gerar código de médico'
                      : 'Gerar código de vínculo de 6 dígitos'}
                </button>
              )}

              {doctorMsg && (
                <p className="text-xs font-semibold text-[#4CAF7D] animate-fade-in">{doctorMsg}</p>
              )}
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            8. PRIVACIDADE COMPLETA (PARTE 1 DO PROMPT)
            - PIN / Biometria
            - Exportar meus dados
            - Apagar minha conta e tudo que registrei
            - Notificações neutras
           ============================================================= */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#7FBFA8]" />
            <span>Privacidade & Proteção de Dados</span>
          </h3>

          {/* Feedback de sucesso do PIN */}
          {pinSuccess && (
            <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-xs font-semibold text-[#4CAF7D] border border-[#4CAF7D]/30 animate-fade-in">
              {pinSuccess}
            </div>
          )}

          {/* 8.1 BLOQUEIO COM PIN / BIOMETRIA */}
          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    PIN de Acesso
                  </h4>
                  <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                    {hasPin ? 'PIN ativo para abrir o app' : 'Proteja suas telas com 4 a 6 dígitos'}
                  </p>
                </div>
              </div>

              {hasPin ? (
                <button
                  type="button"
                  onClick={handleRemovePin}
                  className="text-xs font-bold text-[#D96C68] hover:underline"
                >
                  Desativar PIN
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSettingPin((p) => !p)}
                  className="px-3 py-1.5 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold hover:bg-[#6DA98F]"
                >
                  {isSettingPin ? 'Fechar' : 'Ativar PIN'}
                </button>
              )}
            </div>

            {/* Formulário de definição de PIN com confirmação */}
            {isSettingPin && !hasPin && (
              <div className="p-3.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8] space-y-3 animate-fade-in">
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                  Escolha um PIN de 4 a 6 números:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Digite o PIN (4–6 dígitos)"
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Confirme o mesmo PIN"
                    value={pinConfirmValue}
                    onChange={(e) => setPinConfirmValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                  />
                </div>

                {pinError && <p className="text-xs font-semibold text-[#D96C68]">{pinError}</p>}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSettingPin(false)}
                    className="px-3 py-1 text-xs text-[#6A7A72]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewPin}
                    className="px-4 py-1.5 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold hover:bg-[#6DA98F]"
                  >
                    Salvar e Proteger
                  </button>
                </div>
              </div>
            )}

            {/* Opção de Biometria se suportada ou aviso gentil */}
            <div className="pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#7FBFA8]" />
                <div>
                  <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    Desbloqueio com Biometria
                  </span>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    {biometricsAvailable
                      ? 'Impressão digital ou reconhecimento facial'
                      : 'Não disponível neste navegador ou aparelho'}
                  </span>
                </div>
              </div>

              {biometricsAvailable ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={biometricsEnabled}
                    onChange={(e) => handleToggleBiometrics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#C4CFC8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7FBFA8]" />
                </label>
              ) : (
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] italic">
                  Indisponível
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-1 leading-relaxed">
              * O botão SOS continua acessível mesmo com o app bloqueado por segurança.
            </p>
          </RecomecaCard>

          {/* 8.2 EXPORTAR MEUS DADOS */}
          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Exportar meus dados
                  </h4>
                  <p className="text-xs text-[#4CAF7D] dark:text-[#8FCCAE] font-semibold">
                    &ldquo;Seus dados são seus.&rdquo;
                  </p>
                </div>
              </div>

              <RecomecaButton
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                disabled={isExporting}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                {isExporting ? 'Preparando...' : 'Exportar meus dados'}
              </RecomecaButton>
            </div>

            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Gera um download seguro em JSON e em formato de texto legível de tudo o que você já
              registrou: perfil, hábitos, diário, episódios, fissuras, sono e marcos.
            </p>

            {exportSuccess && (
              <div className="p-2.5 rounded-xl bg-[#E8F3EC] text-xs font-semibold text-[#4CAF7D] animate-fade-in">
                ✓ Seus arquivos foram baixados com sucesso!
              </div>
            )}
          </RecomecaCard>

          {/* 8.3 NOTIFICAÇÕES E LEMBRETES COM TEXTO NEUTRO */}
          <RecomecaCard variant="default" padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#7FBFA8]" />
                <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Notificações e Lembretes Discretos
                </span>
              </div>
              <span className="text-[10px] text-[#4CAF7D] font-bold">Garantido</span>
            </div>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Qualquer aviso ou lembrete de consulta aparece apenas com o rótulo neutro{' '}
              <strong>&ldquo;Seu lembrete do dia&rdquo;</strong>, sem nunca citar substâncias ou
              detalhes na tela do seu aparelho.
            </p>
          </RecomecaCard>

          {/* 8.4 APAGAR MINHA CONTA E TUDO QUE REGISTREI (FLUXO EM 2 ETAPAS) */}
          <RecomecaCard
            variant="default"
            padding="md"
            className="border-l-4 border-l-[#D96C68] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FBEBEA] dark:bg-[#331C1A] text-[#D96C68] flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Apagar minha conta e tudo que registrei
                  </h4>
                  <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                    Exclusão completa e definitiva de todas as coleções
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteStep(1)}
                className="px-3 py-1.5 rounded-xl border border-[#D96C68]/40 text-[#D96C68] hover:bg-[#D96C68] hover:text-white text-xs font-bold transition-all"
              >
                Apagar tudo
              </button>
            </div>

            <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Remove irreversivelmente todos os seus registros de saúde, diário, hábitos e conta de
              acesso, sem deixar nenhum dado órfão no sistema.
            </p>
          </RecomecaCard>
        </section>

        {/* MODAL ETAPA 1: PRIMEIRO AVISO */}
        {deleteStep === 1 && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-[400px] w-full bg-[#FDFAF5] dark:bg-[#1C2420] rounded-3xl p-5 border border-[#D96C68]/40 space-y-4 shadow-xl animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#FBEBEA] dark:bg-[#331C1A] text-[#D96C68] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Tem certeza que quer apagar tudo?
                </h3>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Esta ação é irreversível. Todas as suas conquistas, diários, check-ins e histórico
                  serão apagados permanentemente dos nossos servidores.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteStep(0)}
                  className="flex-1 py-2.5 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
                >
                  Manter meus dados
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteStep(2)}
                  className="flex-1 py-2.5 rounded-xl bg-[#D96C68] hover:bg-[#C25854] text-white text-xs font-bold transition-colors"
                >
                  Quero continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ETAPA 2: DIGITAR APAGAR */}
        {deleteStep === 2 && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-[400px] w-full bg-[#FDFAF5] dark:bg-[#1C2420] rounded-3xl p-5 border border-[#D96C68] space-y-4 shadow-xl animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#D96C68] text-white flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Confirmação final
                </h3>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Para confirmar a exclusão completa, digite a palavra{' '}
                  <strong className="text-[#D96C68]">APAGAR</strong> abaixo:
                </p>
              </div>

              <input
                type="text"
                placeholder="Digite APAGAR"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-center text-sm font-bold tracking-widest bg-white dark:bg-[#242E29] border border-[#D96C68] text-[#2F4A3E] dark:text-[#E8EFE9] uppercase"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteStep(0)
                    setConfirmInput('')
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={confirmInput.trim().toUpperCase() !== 'APAGAR' || isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-[#D96C68] hover:bg-[#C25854] text-white text-xs font-bold disabled:opacity-40 transition-colors"
                >
                  {isDeleting ? 'Apagando tudo...' : 'Confirmar exclusão'}
                </button>
              </div>
            </div>
          </div>
        )}

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
