import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  RecomecaInput,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { useAuth } from '@/lib/authContext'
import { MOCK_USER } from '@/lib/mockData'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Perfil() {
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
            7. PRIVACIDADE E TERMOS (LGPD)
           ============================================================= */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
            Privacidade e Legal
          </h3>

          <RecomecaCard
            variant="default"
            padding="sm"
            className="divide-y divide-[#E1E8E2] dark:divide-[#2D3A34]"
          >
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#7FBFA8]" />
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Proteção de Dados de Saúde (LGPD)
                </span>
              </div>
              <span className="text-[10px] text-[#4CAF7D] font-bold">Ativo</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#7FBFA8]" />
                <span className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Notificações neutras e discretas
                </span>
              </div>
              <span className="text-[10px] text-[#4CAF7D] font-bold">Sim</span>
            </div>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
