import * as React from 'react'
import { Link } from 'react-router-dom'
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
import { useRecomecaStore } from '@/lib/recomecaStore'
import {
  ExternalLink,
  PhoneCall,
  MessageCircle,
  Pill,
  HeartHandshake,
  AlertTriangle,
  Check,
  Plus,
  Clock,
  Heart,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Apoio() {
  const { contact } = useRecomecaStore()

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

  // Tratamento do contato para ligação e WhatsApp
  const contactDigits = (contact?.phone || '').replace(/\D/g, '')
  const hasValidPhone = contactDigits.length >= 8
  const phoneWithCountry = contactDigits.startsWith('55') ? contactDigits : `55${contactDigits}`

  // Mensagem pronta amigável (sem localização, tom de apoio pessoal)
  const contactName = contact?.name?.trim() || 'meu contato'
  const messageText = `Oi, ${contactName}. Estou passando por um momento difícil e preciso de você.`
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(messageText)}`
  const telUrl = `tel:${contactDigits}`

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Apoio e Remédios"
        subtitle="Sua rede de confiança, acompanhamento médico e instituições gratuitas."
      />

      <div className="px-4 py-4 space-y-6">
        {/* =============================================================
            DESTAQUE NO TOPO: MINHA REDE DE APOIO PESSOAL
            Botões grandes para Ligar e Mandar WhatsApp (estilo calmo verde-água / off-white, NUNCA coral)
           ============================================================= */}
        <section aria-label="Minha rede de apoio pessoal" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Minha Rede de Apoio Pessoal
              </h2>
            </div>
            <Link
              to="/perfil"
              className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
            >
              {hasValidPhone ? 'Editar contato' : 'Cadastrar'}
            </Link>
          </div>

          <RecomecaCard
            variant="highlight"
            padding="lg"
            className="space-y-4 border-[#7FBFA8]/40 dark:border-[#8FCCAE]/30"
          >
            {hasValidPhone ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7FBFA8] dark:text-[#8FCCAE] block">
                      Pessoa de Confiança
                    </span>
                    <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                      {contact.name || 'Contato de Apoio'}
                    </h3>
                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] tabular-nums">
                      {contact.displayPhone || contact.phone}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#8FCCAE] border border-[#4CAF7D]/30 shrink-0">
                    Porto Seguro
                  </span>
                </div>

                <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
                  Precisa conversar ou desabafar com quem se importa com você? Acione em um toque:
                </p>

                {/* Botões grandes: Ligar e Mandar mensagem via WhatsApp (estilo calmo: verde-água e off-white) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Botão de Ligar */}
                  <a
                    href={telUrl}
                    className={cn(
                      'flex items-center justify-center gap-2.5 p-3.5 rounded-2xl',
                      'bg-[#7FBFA8] hover:bg-[#6DA98F] text-white font-bold text-sm',
                      'shadow-sm transition-all touch-target',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FBFA8]',
                    )}
                    aria-label={`Ligar para ${contact.name || 'contato de apoio'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">
                      Ligar para {contact.name?.split(' ')[0] || 'contato'}
                    </span>
                  </a>

                  {/* Botão de Mandar WhatsApp com mensagem pronta */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center justify-center gap-2.5 p-3.5 rounded-2xl',
                      'bg-[#F4F7F2] dark:bg-[#242E29] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831]',
                      'border border-[#7FBFA8]/50 dark:border-[#8FCCAE]/40',
                      'text-[#2F4A3E] dark:text-[#E8EFE9] font-bold text-sm',
                      'transition-all touch-target',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FBFA8]',
                    )}
                    aria-label={`Mandar mensagem no WhatsApp para ${contact.name || 'contato de apoio'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#7FBFA8]/20 dark:bg-[#8FCCAE]/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-[#2F4A3E] dark:text-[#8FCCAE]" />
                    </div>
                    <span className="truncate">Mandar WhatsApp</span>
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] flex items-start gap-2">
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] shrink-0">
                    Mensagem pronta:
                  </span>
                  <span className="italic leading-relaxed truncate">
                    &ldquo;{messageText}&rdquo;
                  </span>
                </div>
              </>
            ) : (
              /* Estado gentil quando ainda não há telefone cadastrado */
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      Cadastre seu contato de confiança
                    </h3>
                    <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                      Ter alguém para ligar ou enviar uma mensagem rápida faz toda a diferença nos
                      dias difíceis. Leva menos de 1 minuto.
                    </p>
                  </div>
                </div>

                <Link to="/perfil" className="block">
                  <RecomecaButton
                    variant="primary"
                    size="md"
                    fullWidth
                    leftIcon={<HeartHandshake className="w-4 h-4" />}
                  >
                    Cadastrar contato no perfil
                  </RecomecaButton>
                </Link>
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            BLOCO 1: MEUS REMÉDIOS (APARECE PRIMEIRO NA PÁGINA)
            - Registro do que o médico receitou
            - O que foi tomado hoje
            - 4 perguntas semanais de sinais de alerta
            - Aviso de overdose e tolerância
            - Regra: nunca sugerir dose, aviso não substitui tratamento
           ============================================================= */}
        <section aria-label="Meus remédios" className="space-y-6 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Meus Remédios
              </h2>
            </div>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              Acompanhamento seguro da sua rotina prescrita pelo médico. Sem sugestão de dosagens.
            </p>
          </div>

          {/* 1.1 AVISO DE OVERDOSE E TOLERÂNCIA */}
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
              Nunca compense horários e nunca dobre doses. Este aplicativo não substitui consultas
              nem tratamento médico. Sempre converse com seu médico antes de qualquer ajuste.
            </p>
          </RecomecaCard>

          {/* 1.2 LISTA DE REMÉDIOS PRESCRITOS E REGISTRO DO QUE FOI TOMADO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  O que seu médico receitou
                </h3>
                <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  Apenas nome e horário. Sem indicação de doses.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingMed((m) => !m)}
                className="flex items-center gap-1 text-xs font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline touch-target"
              >
                <Plus className="w-4 h-4" />
                {isAddingMed ? 'Fechar' : 'Adicionar'}
              </button>
            </div>

            {/* Formulário simples de adição */}
            {isAddingMed && (
              <RecomecaCard variant="highlight" padding="md" className="space-y-3 animate-fade-in">
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

                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
                    <RecomecaInput
                      label="Médico responsável"
                      placeholder="Ex.: Dr. André"
                      value={newMedDoctor}
                      onChange={(e) => setNewMedDoctor(e.target.value)}
                    />

                    <div className="space-y-1 text-left">
                      <label className="text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        Horário receitado
                      </label>
                      <input
                        type="time"
                        value={newMedTime}
                        onChange={(e) => setNewMedTime(e.target.value)}
                        className="w-full min-h-[46px] px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
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

            {/* Lista dos remédios com marcação de tomado */}
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
                      'px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all touch-target shrink-0',
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
          </div>

          {/* 1.3 PERGUNTAS SEMANAIS DE SINAIS DE ALERTA */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Sinais de Alerta Semanais (4 perguntas)
              </h3>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Perguntas simples de autopercepção para acompanhar sua relação com a medicação.
                Responda com sinceridade e sem culpa.
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
                    Você indicou mais de um sinal de tolerância ou oscilação recente. Seu corpo pode
                    estar se adaptando. Marque um retorno para conversar com carinho e rever o
                    tratamento.
                  </p>

                  <div className="pt-1">
                    {caregiverAlertSent ? (
                      <div className="text-xs font-semibold text-[#4CAF7D] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Mensagem registrada para seu cuidador com
                        sucesso.
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
          </div>
        </section>

        {/* =============================================================
            BLOCO 2: REDE DE APOIO (A.A., N.A., Al-Anon, Nar-Anon, CAPS AD, Amor-Exigente, CVV)
            Vem DEPOIS dos remédios
           ============================================================= */}
        <section aria-label="Rede de apoio institucional" className="space-y-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                Rede de Apoio Institucional e Gratuita
              </h2>
            </div>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              Instituições oficiais no Brasil com acolhimento profissional e grupos de apoio que
              salvam vidas todos os dias.
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
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] hover:bg-[#7FBFA8]/20 text-xs font-bold text-[#2F4A3E] dark:text-[#8FCCAE] transition-colors touch-target max-w-full"
                  >
                    <span className="truncate">Acessar site oficial</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>

                  {org.phone && (
                    <a
                      href={`tel:${org.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#7FBFA8]/40 hover:bg-[#E8F3EC] text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] transition-colors touch-target max-w-full"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#7FBFA8] shrink-0" />
                      <span className="truncate">{org.phoneDisplay || `Ligar ${org.phone}`}</span>
                    </a>
                  )}
                </div>
              </RecomecaCard>
            ))}
          </div>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
