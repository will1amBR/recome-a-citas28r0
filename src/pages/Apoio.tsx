import * as React from 'react'
import {
  RecomecaButton,
  RecomecaCard,
  RecomecaInput,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import {
  SUPPORT_ORGANIZATIONS,
  MOCK_MEDICATIONS,
  MEDICATION_SCREENING_QUESTIONS,
  PrescribedMedication,
} from '@/lib/mockData'
import {
  ExternalLink,
  PhoneCall,
  Pill,
  ShieldAlert,
  AlertTriangle,
  Check,
  Plus,
  Clock,
  Heart,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Apoio() {
  // Aba ativa interna: 'rede' ou 'remedios'
  const [activeSection, setActiveSection] = React.useState<'rede' | 'remedios'>('rede')

  // Seção Meus Remédios
  const [medications, setMedications] = React.useState<PrescribedMedication[]>(MOCK_MEDICATIONS)
  const [newMedName, setNewMedName] = React.useState('')
  const [newMedDoctor, setNewMedDoctor] = React.useState('')
  const [newMedTime, setNewMedTime] = React.useState('08:00')
  const [newMedNotes, setNewMedNotes] = React.useState('')
  const [isAddingMed, setIsAddingMed] = React.useState(false)

  // Perguntas Semanais de Sinais de Alerta
  const [screenAnswers, setScreenAnswers] = React.useState<Record<string, boolean | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  })
  const [caregiverAlertSent, setCaregiverAlertSent] = React.useState(false)

  const handleToggleTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenToday: !m.takenToday } : m)),
    )
  }

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMedName.trim()) return

    const newMed: PrescribedMedication = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      doctorName: newMedDoctor.trim() || undefined,
      scheduledTime: newMedTime || '08:00',
      takenToday: false,
      notes: newMedNotes.trim() || undefined,
    }

    setMedications((prev) => [...prev, newMed])
    setNewMedName('')
    setNewMedDoctor('')
    setNewMedNotes('')
    setIsAddingMed(false)
  }

  // Contagem de respostas "Sim" nas perguntas de sinais de alerta
  const yesAnswersCount = Object.values(screenAnswers).filter((ans) => ans === true).length

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Apoio e Remédios"
        subtitle="Instituições gratuitas e acompanhamento seguro com seu médico."
      />

      <div className="px-4 py-4 space-y-6">
        {/* Seletor entre Rede de Apoio e Meus Remédios */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34]">
          <button
            type="button"
            onClick={() => setActiveSection('rede')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target',
              activeSection === 'rede'
                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] shadow-sm'
                : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
            )}
          >
            Rede de Apoio
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('remedios')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target',
              activeSection === 'remedios'
                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] shadow-sm'
                : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]',
            )}
          >
            Meus Remédios
          </button>
        </div>

        {/* =============================================================
            SEÇÃO 1: CARTÕES DE REDE DE APOIO COM LINKS CONFIRMADOS
           ============================================================= */}
        {activeSection === 'rede' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Instituições Oficiais e Gratuitas
              </h2>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Acolhimento profissional e grupos de apoio que salvam vidas todos os dias no Brasil.
              </p>
            </div>

            <div className="space-y-3">
              {SUPPORT_ORGANIZATIONS.map((org) => (
                <RecomecaCard key={org.id} variant="default" padding="md" className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                          {org.name}
                        </h3>
                        {org.emergencyBadge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] border border-[#7FBFA8]/30">
                            {org.emergencyBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-1 leading-relaxed">
                        {org.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                    <a
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] hover:bg-[#7FBFA8]/20 text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] transition-colors touch-target"
                    >
                      <span>Acessar site oficial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {org.phone && (
                      <a
                        href={`tel:${org.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/40 hover:bg-[#E8F3EC] text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] transition-colors touch-target"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#E86A4C]" />
                        <span>{org.phoneDisplay || `Ligar ${org.phone}`}</span>
                      </a>
                    )}
                  </div>
                </RecomecaCard>
              ))}
            </div>
          </div>
        )}

        {/* =============================================================
            SEÇÃO 2: MEUS REMÉDIOS (SEM SUGESTÃO DE DOSES)
           ============================================================= */}
        {activeSection === 'remedios' && (
          <div className="space-y-6 animate-fade-in">
            {/* 2.1 AVISO DE OVERDOSE E TOLERÂNCIA */}
            <RecomecaCard
              variant="default"
              padding="md"
              className="border-l-4 border-l-[#E86A4C] space-y-2"
            >
              <div className="flex items-center gap-2 text-[#E86A4C] dark:text-[#F07856] font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Aviso de Tolerância e Risco de Overdose</span>
              </div>
              <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
                &ldquo;Depois de um tempo sem usar, seu corpo tolera menos. Uma dose antiga pode ser
                perigosa.&rdquo;
              </p>
              <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Nunca compense horários e nunca dobre doses. Sempre converse com o seu médico antes
                de qualquer ajuste.
              </p>
            </RecomecaCard>

            {/* 2.2 LISTA DE REMÉDIOS PRESCRITOS */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                    O que seu médico receitou
                  </h2>
                  <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    Apenas nome e horário. Sem indicação de doses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingMed((m) => !m)}
                  className="flex items-center gap-1 text-xs font-bold text-[#7FBFA8] hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  {isAddingMed ? 'Fechar' : 'Adicionar'}
                </button>
              </div>

              {/* Formulário simples de adição */}
              {isAddingMed && (
                <RecomecaCard
                  variant="highlight"
                  padding="md"
                  className="space-y-3 animate-fade-in"
                >
                  <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    Cadastrar medicação prescrita
                  </span>

                  <form onSubmit={handleAddMedication} className="space-y-3">
                    <RecomecaInput
                      label="Nome do remédio"
                      placeholder="Ex.: Sertralina, Clonazepam, etc."
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <RecomecaInput
                        label="Médico responsável"
                        placeholder="Ex.: Dr. André"
                        value={newMedDoctor}
                        onChange={(e) => setNewMedDoctor(e.target.value)}
                      />

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                          Horário receitado
                        </label>
                        <input
                          type="time"
                          value={newMedTime}
                          onChange={(e) => setNewMedTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                        />
                      </div>
                    </div>

                    <RecomecaInput
                      label="Instrução do médico (opcional)"
                      placeholder="Ex.: Tomar com água após o café"
                      value={newMedNotes}
                      onChange={(e) => setNewMedNotes(e.target.value)}
                      helperText="O aplicativo nunca sugere dosagens. Siga rigorosamente a receita médica."
                    />

                    <RecomecaButton variant="primary" size="md" fullWidth type="submit">
                      Guardar na minha rotina
                    </RecomecaButton>
                  </form>
                </RecomecaCard>
              )}

              {/* Lista dos remédios */}
              <div className="space-y-2">
                {medications.map((med) => (
                  <RecomecaCard
                    key={med.id}
                    variant="default"
                    padding="md"
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                          med.takenToday
                            ? 'bg-[#4CAF7D]/20 text-[#4CAF7D]'
                            : 'bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8]',
                        )}
                      >
                        <Pill className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                          {med.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-0.5">
                          <span className="flex items-center gap-1 font-semibold tabular-nums">
                            <Clock className="w-3 h-3" />
                            {med.scheduledTime}
                          </span>
                          {med.doctorName && <span>• {med.doctorName}</span>}
                        </div>
                        {med.notes && (
                          <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] mt-1 line-clamp-1 italic">
                            {med.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTaken(med.id)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all touch-target',
                        med.takenToday
                          ? 'bg-[#4CAF7D] text-white'
                          : 'bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7]',
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {med.takenToday ? 'Tomado' : 'Tomar'}
                    </button>
                  </RecomecaCard>
                ))}
              </div>
            </section>

            {/* 2.3 PERGUNTAS SEMANAIS DE SINAIS DE ALERTA */}
            <section className="space-y-3 pt-2">
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  Sinais de Alerta Semanais
                </h2>
                <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  Perguntas simples de autopercepção. Responda com sinceridade e sem culpa.
                </p>
              </div>

              <RecomecaCard variant="default" padding="lg" className="space-y-4">
                <div className="space-y-3">
                  {MEDICATION_SCREENING_QUESTIONS.map((q) => {
                    const currentAnswer = screenAnswers[q.id]
                    return (
                      <div
                        key={q.id}
                        className="p-3 rounded-2xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-2"
                      >
                        <p className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                          {q.text}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setScreenAnswers((prev) => ({ ...prev, [q.id]: false }))}
                            className={cn(
                              'flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all touch-target',
                              currentAnswer === false
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent'
                                : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            Não
                          </button>
                          <button
                            type="button"
                            onClick={() => setScreenAnswers((prev) => ({ ...prev, [q.id]: true }))}
                            className={cn(
                              'flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all touch-target',
                              currentAnswer === true
                                ? 'bg-[#E8A84C] text-white border-transparent'
                                : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            Sim
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Se 2 ou mais "sim": mensagem sugerindo conversar com o médico */}
                {yesAnswersCount >= 2 && (
                  <div className="p-3.5 rounded-2xl bg-[#E8A84C]/15 border border-[#E8A84C]/40 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      <AlertTriangle className="w-4 h-4 text-[#E8A84C]" />
                      <span>Vale a pena conversar com seu médico</span>
                    </div>
                    <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                      Você indicou mais de um sinal de tolerância ou oscilação recente. Seu corpo
                      pode estar se adaptando. Marque um retorno para conversar com carinho e rever
                      o tratamento.
                    </p>

                    <div className="pt-1">
                      {caregiverAlertSent ? (
                        <div className="text-xs font-semibold text-[#4CAF7D] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Mensagem registrada para seu cuidador
                          com sucesso.
                        </div>
                      ) : (
                        <RecomecaButton
                          variant="secondary"
                          size="sm"
                          fullWidth
                          leftIcon={<UserCheck className="w-4 h-4" />}
                          onClick={() => setCaregiverAlertSent(true)}
                        >
                          Avisar meu cuidador / pessoa de confiança
                        </RecomecaButton>
                      )}
                    </div>
                  </div>
                )}
              </RecomecaCard>
            </section>
          </div>
        )}

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
