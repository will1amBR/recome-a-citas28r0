import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { RecomecaButton, RecomecaCard, RecomecaInput, ProgressBar } from '@/components/recomeca'
import { useRecomecaStore } from '@/lib/recomecaStore'
import { ONBOARDING_SUBSTANCES } from '@/lib/mockData'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HabitDetailConfig {
  goal: 'parar' | 'reduzir'
  frequency: string
  sinceWhen: string
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { contact, updateContact } = useRecomecaStore()

  // Etapa atual: 1 a 5
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  // 1) Escolhas de substâncias/hábitos
  const [selectedSubstances, setSelectedSubstances] = React.useState<string[]>(['alcool', 'cafe'])

  // 2) Detalhes para cada item escolhido (parar ou reduzir, uso atual, desde quando)
  const [details, setDetails] = React.useState<Record<string, HabitDetailConfig>>({
    alcool: { goal: 'parar', frequency: '3 a 4 vezes por semana', sinceWhen: 'Há 5 anos' },
    cafe: { goal: 'reduzir', frequency: '4 a 5 xícaras por dia', sinceWhen: 'Há cerca de 3 anos' },
  })

  // 3) Contato de emergência
  const [contactName, setContactName] = React.useState(contact.name)
  const [contactPhone, setContactPhone] = React.useState(contact.displayPhone || contact.phone)
  const [contactNotified, setContactNotified] = React.useState(contact.hasConsent)

  // 4) Consentimento LGPD
  const [lgpdConsent, setLgpdConsent] = React.useState(true)

  // Erros gentis
  const [validationError, setValidationError] = React.useState('')

  // Verifica se alguma das substâncias selecionadas é de alto risco na abstinência
  const hasHighRiskSubstance = selectedSubstances.some((id) => {
    const item = ONBOARDING_SUBSTANCES.find((s) => s.id === id)
    return item?.highRisk
  })

  const toggleSubstance = (id: string) => {
    setValidationError('')
    setSelectedSubstances((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        const next = prev.filter((s) => s !== id)
        return next
      } else {
        const next = [...prev, id]
        if (!details[id]) {
          setDetails((d) => ({
            ...d,
            [id]: { goal: 'parar', frequency: 'Diariamente', sinceWhen: 'Há cerca de 1 ano' },
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

  const handleNext = () => {
    setValidationError('')
    if (currentStep === 1) {
      if (selectedSubstances.length === 0) {
        setValidationError('Escolha pelo menos um item para podermos apoiar você.')
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      // Se tiver alto risco, o passo 3 é o AVISO DE SEGURANÇA obrigatório
      // Se não tiver, ainda mostramos um aviso de acolhimento preventivo
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      setCurrentStep(4)
      return
    }

    if (currentStep === 4) {
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
      setCurrentStep(5)
      return
    }

    if (currentStep === 5) {
      if (!lgpdConsent) {
        setValidationError('Precisamos do seu consentimento para proteger seus dados e continuar.')
        return
      }
      // Conclui onboarding e vai para a tela principal
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

  // Progresso em %
  const progressPercent = Math.round((currentStep / 5) * 100)

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
            Etapa {currentStep} de 5
          </span>

          <button
            type="button"
            onClick={() => navigate('/hoje')}
            className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E] dark:hover:text-[#E8EFE9] px-2 py-1"
          >
            Pular
          </button>
        </div>

        <ProgressBar
          value={progressPercent}
          size="sm"
          helperText={`Etapa ${currentStep}: ${
            currentStep === 1
              ? 'O que quer controlar'
              : currentStep === 2
                ? 'Objetivo e frequência'
                : currentStep === 3
                  ? 'Segurança e saúde'
                  : currentStep === 4
                    ? 'Contato de emergência'
                    : 'Privacidade e início'
          }`}
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
              {/* Categorias organizadas */}
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
            ETAPA 2: Para cada item escolhido (parar ou reduzir, uso atual, desde quando)
           ============================================================= */}
        {currentStep === 2 && (
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
                const currentDetail = details[id] || {
                  goal: 'parar',
                  frequency: 'Diariamente',
                  sinceWhen: 'Cerca de 1 ano',
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
                  </RecomecaCard>
                )
              })}
            </div>
          </div>
        )}

        {/* =============================================================
            ETAPA 3: AVISO DE SEGURANÇA (Obrigatório se álcool, calmante ou opioide)
           ============================================================= */}
        {currentStep === 3 && (
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
            ETAPA 4: Contato de emergência
           ============================================================= */}
        {currentStep === 4 && (
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
            ETAPA 5: Consentimento LGPD e Começar agora
           ============================================================= */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
                Tudo pronto para começar
              </h2>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7]">
                Seu espaço seguro de autocuidado está pronto.
              </p>
            </div>

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
            currentStep === 5 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />
          }
        >
          {currentStep === 5 ? 'Começar agora' : 'Continuar'}
        </RecomecaButton>
      </div>
    </div>
  )
}
