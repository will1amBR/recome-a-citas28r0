import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  RecomecaInput,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { useAuth } from '@/lib/authContext'
import {
  bindDoctorWithCode,
  getDoctorLinkedPatients,
  getDoctorPatientSummary,
  DoctorLinkData,
  DoctorPatientSummaryData,
} from '@/services/doctorService'
import {
  Stethoscope,
  Users,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Heart,
  Calendar,
  Lock,
  ChevronRight,
  LogOut,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Profissional() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [inputCode, setInputCode] = React.useState('')
  const [bindLoading, setBindLoading] = React.useState(false)
  const [bindMessage, setBindMessage] = React.useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [patients, setPatients] = React.useState<DoctorLinkData[]>([])
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null)
  const [patientSummary, setPatientSummary] = React.useState<DoctorPatientSummaryData | null>(null)
  const [copiedSummary, setCopiedSummary] = React.useState(false)
  const [loadingPatients, setLoadingPatients] = React.useState(false)

  const doctorName = user?.name || 'Dr(a). Profissional'
  const doctorCrm = user?.crm_conselho || ''

  // Carrega pacientes vinculados
  const loadPatients = React.useCallback(async () => {
    if (!user?.id) return
    setLoadingPatients(true)
    const list = await getDoctorLinkedPatients(user.id)
    setPatients(list)
    if (list.length > 0 && !selectedPatientId) {
      setSelectedPatientId(list[0].patient)
    }
    setLoadingPatients(false)
  }, [user?.id, selectedPatientId])

  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadPatients()
    }
  }, [isAuthenticated, user?.id, loadPatients])

  // Carrega resumo do paciente selecionado
  React.useEffect(() => {
    if (selectedPatientId) {
      getDoctorPatientSummary(selectedPatientId).then((data) => {
        setPatientSummary(data)
      })
    }
  }, [selectedPatientId])

  // Vincula paciente por código
  const handleBindCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setBindLoading(true)
    setBindMessage(null)

    const res = await bindDoctorWithCode(user?.id || '', doctorName, doctorCrm, inputCode.trim())

    setBindLoading(false)

    if (res.success) {
      setBindMessage({
        type: 'success',
        text: 'Paciente vinculado com sucesso! O resumo seguro já está disponível.',
      })
      setInputCode('')
      loadPatients()
    } else {
      setBindMessage({
        type: 'error',
        text: res.error || 'Código não encontrado.',
      })
    }
  }

  // Gera texto para copiar para o prontuário/consulta
  const generateCopySummaryText = () => {
    if (!patientSummary) return ''

    const lines = [
      `--- RECOMEÇA • RESUMO CLÍNICO DE ACOMPANHAMENTO ---`,
      `Paciente: ${patientSummary.patient_display_name || 'Paciente'}`,
      `Atualização: ${patientSummary.updated_at_display || 'Recente'}`,
      `Aviso: Registro gerado pelo paciente no Recomeça. Não substitui julgamento clínico.`,
      ``,
      `HÁBITOS EM ACOMPANHAMENTO:`,
      ...(patientSummary.substances_summary || []).map(
        (s) =>
          `• ${s.name} (${s.goal}): ${s.cleanDays} dias limpos atuais | Melhor sequência: ${s.bestStreak} dias | Dias livres no mês: ${s.cleanDaysMonth} dias`,
      ),
      ``,
      `ALERTAS DE RECAÍDA (DATAS SEM TEXTO DE DIÁRIO):`,
      ...(patientSummary.relapse_alerts && patientSummary.relapse_alerts.length > 0
        ? patientSummary.relapse_alerts.map((a) => `• Data: ${a.date} (${a.substanceName})`)
        : ['• Nenhum episódio recente registrado']),
      ``,
      `RESPOSTAS DAS 4 PERGUNTAS SEMANAIS (SINAIS DE ALERTA DE REMÉDIO):`,
      ...(patientSummary.med_screening_answers && patientSummary.med_screening_answers.length > 0
        ? patientSummary.med_screening_answers.map(
            (m) => `• ${m.question}: ${m.answeredYes ? 'SIM' : 'NÃO'}`,
          )
        : ['• Nenhuma resposta registrada']),
      ``,
      `CHECK-IN DE SONO RECENTE:`,
      ...(patientSummary.sleep_summary && patientSummary.sleep_summary.length > 0
        ? patientSummary.sleep_summary.map(
            (sl) => `• Semana ${sl.week}: ${sl.answer}${sl.note ? ` ("${sl.note}")` : ''}`,
          )
        : ['• Nenhum registro recente']),
      ``,
      `PRÓXIMA CONSULTA ANOTADA PELO PACIENTE:`,
      `• ${patientSummary.next_appointment || 'Não agendada'}`,
      `----------------------------------------------------`,
    ]

    return lines.join('\n')
  }

  const handleCopySummary = async () => {
    const text = generateCopySummaryText()
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
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

  // Exemplos de demonstração quando o profissional ainda não tem pacientes
  const demoSummary: DoctorPatientSummaryData = {
    patient: 'demo',
    patient_display_name: 'Camila (Exemplo de Demonstração)',
    updated_at_display: 'Hoje',
    next_appointment: 'Próxima quarta-feira às 14h',
    substances_summary: [
      {
        name: 'Cigarro',
        goal: 'Reduzir aos poucos',
        cleanDays: 8,
        bestStreak: 14,
        cleanDaysMonth: 22,
      },
      {
        name: 'Álcool',
        goal: 'Parar de vez',
        cleanDays: 38,
        bestStreak: 38,
        cleanDaysMonth: 28,
      },
    ],
    relapse_alerts: [{ date: '12/04/2025 às 22:30', substanceName: 'Álcool' }],
    med_screening_answers: [
      { question: 'Precisou tomar mais para fazer o mesmo efeito?', answeredYes: false },
      { question: 'Sentiu vontade de tomar antes do horário prescrito?', answeredYes: true },
      { question: 'A caixa acabou antes do previsto ou perdeu comprimidos?', answeredYes: false },
      { question: 'Pegou receita com mais de um médico para o mesmo sintoma?', answeredYes: false },
    ],
    sleep_summary: [
      { week: 'Semana 17', answer: 'Difícil', note: 'Demorei para pegar no sono na terça' },
      { week: 'Semana 16', answer: 'Bem', note: 'Dormi 7h seguidas' },
    ],
    milestones_summary: [
      { title: '30 dias livres de álcool', celebratedDate: '01/04/2025', isAchieved: true },
      { title: '60 dias livres de álcool', isAchieved: false },
    ],
  }

  const activeSummary = patientSummary || (patients.length === 0 ? demoSummary : null)

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Espaço do Profissional"
        subtitle="Acompanhamento clínico respeitoso com consentimento do paciente."
      />

      <div className="px-4 py-4 space-y-6 max-w-[520px] mx-auto w-full">
        {/* Aviso de julgamento clínico obrigatório (PRP) */}
        <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-1 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
          <div className="flex items-center gap-2 font-bold">
            <Stethoscope className="w-4 h-4 text-[#4CAF7D]" />
            <span>Aviso Profissional</span>
          </div>
          <p className="leading-relaxed">
            Este painel não substitui seu julgamento clínico. Os dados são autorizados
            voluntariamente pelo paciente. O paciente nunca é vigiado: ele pode desvincular o acesso
            a qualquer momento.
          </p>
        </div>

        {/* Card do Médico Logado */}
        {isAuthenticated ? (
          <RecomecaCard
            variant="highlight"
            padding="md"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#7FBFA8] text-white font-bold flex items-center justify-center text-lg">
                {doctorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {doctorName}
                </h3>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  {doctorCrm ? `Conselho: ${doctorCrm}` : 'Profissional de saúde cadastrado'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-[#6A7A72] hover:text-[#D96C68] flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </RecomecaCard>
        ) : (
          <div className="p-3 rounded-2xl bg-[#FDFAF5] dark:bg-[#202723] border border-[#7FBFA8]/50 flex items-center justify-between text-xs">
            <span className="text-[#6A7A72] dark:text-[#A0B0A7]">
              Modo visualização de demonstração
            </span>
            <Link
              to="/login"
              className="font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
            >
              Entrar como profissional →
            </Link>
          </div>
        )}

        {/* 1. VINCULAR NOVO PACIENTE POR CÓDIGO */}
        <section aria-label="Vincular paciente com código" className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7FBFA8]" />
            <span>Vincular Novo Paciente</span>
          </h2>

          <RecomecaCard variant="default" padding="md" className="space-y-3">
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Peça ao seu paciente para abrir <strong>Perfil → Meu Médico</strong> no aplicativo
              dele e gerar o código de vínculo (ex: REC-78A).
            </p>

            <form onSubmit={handleBindCode} className="flex gap-2">
              <input
                type="text"
                placeholder="Código de 6 dígitos (ex: REC-AB12)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] uppercase tracking-wider font-bold"
              />
              <button
                type="submit"
                disabled={bindLoading || !inputCode.trim()}
                className="px-4 py-2 rounded-xl bg-[#7FBFA8] text-white text-xs font-bold hover:bg-[#6DA98F] transition-colors disabled:opacity-40"
              >
                {bindLoading ? 'Vinculando...' : 'Vincular'}
              </button>
            </form>

            {bindMessage && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold ${
                  bindMessage.type === 'success'
                    ? 'bg-[#E8F3EC] text-[#4CAF7D]'
                    : 'bg-[#FBEBEA] text-[#D96C68]'
                }`}
              >
                {bindMessage.text}
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* 2. LISTA DE PACIENTES VINCULADOS */}
        {patients.length > 0 && (
          <section aria-label="Lista de pacientes" className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#7FBFA8]" />
              <span>Pacientes Vinculados ({patients.length})</span>
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {patients.map((p) => {
                const isSelected = selectedPatientId === p.patient
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.patient)}
                    className={cn(
                      'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0',
                      isSelected
                        ? 'bg-[#7FBFA8] text-white border-[#7FBFA8]'
                        : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]',
                    )}
                  >
                    {p.patient_name || 'Paciente'}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* 3. RESUMO SEGURO DO PACIENTE */}
        {activeSummary && (
          <section aria-label="Resumo seguro de acompanhamento" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {activeSummary.patient_display_name}
                </h2>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Resumo estrito permitido • {activeSummary.updated_at_display}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7FBFA8] hover:bg-[#6DA98F] text-white text-xs font-bold transition-all shadow-xs"
              >
                {copiedSummary ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSummary ? 'Copiado!' : 'Copiar resumo para a consulta'}</span>
              </button>
            </div>

            {/* Aviso de Privacidade: o que o médico NUNCA vê */}
            <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center gap-2 text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
              <Lock className="w-3.5 h-3.5 text-[#7FBFA8] shrink-0" />
              <span>
                Proteção ética: você nunca tem acesso ao diário pessoal, textos de reflexão nem
                fotos de recibos do paciente.
              </span>
            </div>

            {/* A. DIAS LIMPOS POR SUBSTÂNCIA, MELHOR SEQUÊNCIA E DIAS LIVRES NO MÊS */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Dias Limpos e Metas do Paciente
              </span>

              <div className="space-y-2">
                {(activeSummary.substances_summary || []).map((sub) => (
                  <div
                    key={sub.name}
                    className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {sub.name}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] font-bold">
                        {sub.goal}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-[#242E29]">
                        <span className="text-[9px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                          Limpos atuais
                        </span>
                        <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                          {sub.cleanDays} dias
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white dark:bg-[#242E29]">
                        <span className="text-[9px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                          Melhor sequência
                        </span>
                        <span className="font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                          {sub.bestStreak} dias
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white dark:bg-[#242E29]">
                        <span className="text-[9px] text-[#6A7A72] dark:text-[#A0B0A7] block">
                          Dias livres no mês
                        </span>
                        <span className="font-bold tabular-nums text-[#4CAF7D]">
                          {sub.cleanDaysMonth} dias
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RecomecaCard>

            {/* B. ALERTAS DE RECAÍDA (DATAS SEM TEXTO DE DIÁRIO) */}
            <RecomecaCard variant="default" padding="md" className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Alertas de Recaída (Apenas Datas de Episódios)
              </span>

              {activeSummary.relapse_alerts && activeSummary.relapse_alerts.length > 0 ? (
                <div className="space-y-1.5">
                  {activeSummary.relapse_alerts.map((al, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#FBEBEA]/60 dark:bg-[#331C1A]/40 border border-[#D96C68]/30 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        {al.substanceName}
                      </span>
                      <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        {al.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4CAF7D] font-semibold">
                  Nenhum episódio registrado no período recente.
                </p>
              )}
            </RecomecaCard>

            {/* C. 4 PERGUNTAS SEMANAIS DE SINAIS DE ALERTA DE REMÉDIO */}
            <RecomecaCard variant="default" padding="md" className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Sinais de Alerta de Medicação (4 Perguntas)
              </span>

              <div className="space-y-1.5">
                {(activeSummary.med_screening_answers || []).map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-[#2F4A3E] dark:text-[#E8EFE9] flex-1">{m.question}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.answeredYes
                          ? 'bg-[#E8A84C]/20 text-[#E8A84C]'
                          : 'bg-[#E8F3EC] text-[#4CAF7D]'
                      }`}
                    >
                      {m.answeredYes ? 'SIM' : 'NÃO'}
                    </span>
                  </div>
                ))}
              </div>
            </RecomecaCard>

            {/* D. CHECK-INS DE SONO (RESUMO) */}
            <RecomecaCard variant="default" padding="md" className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                Padrão de Sono Semanal
              </span>

              <div className="space-y-1.5">
                {(activeSummary.sleep_summary || []).map((sl, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#2F4A3E] dark:text-[#E8EFE9]">{sl.week}</strong>
                      {sl.note && (
                        <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] italic">
                          &ldquo;{sl.note}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-[#7FBFA8] dark:text-[#8FCCAE]">
                      {sl.answer}
                    </span>
                  </div>
                ))}
              </div>
            </RecomecaCard>

            {/* E. PRÓXIMOS MARCOS & CONSULTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Próxima Consulta
                </span>
                <p className="font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  {activeSummary.next_appointment || 'Não agendada'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
                  Marcos Comemorados
                </span>
                <p className="font-semibold text-[#4CAF7D]">
                  {activeSummary.milestones_summary?.filter((m) => m.isAchieved).length || 0} marcos
                  conquistados
                </p>
              </div>
            </div>
          </section>
        )}

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
