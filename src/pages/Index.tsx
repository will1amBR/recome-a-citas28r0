import * as React from 'react'
import {
  RecomecaButton,
  RecomecaCard,
  RecomecaInput,
  MoodSelector,
  TriggerChip,
  MilestoneBadge,
  ProgressBar,
  ConfirmationModal,
} from '@/components/recomeca'
import {
  CalendarDays,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PhoneCall,
  Activity,
  ChevronDown,
  Info,
} from 'lucide-react'

export default function Index() {
  // Estados para demonstração interativa dos componentes base na própria LP
  const [selectedMood, setSelectedMood] = React.useState<string>('bem')
  const [activeTriggers, setActiveTriggers] = React.useState<string[]>(['estresse', 'festa'])
  const [demoInput, setDemoInput] = React.useState('')
  const [inputError, setInputError] = React.useState('')
  const [modalOpen, setModalOpen] = React.useState(false)

  const toggleTrigger = (triggerName: string) => {
    setActiveTriggers((prev) =>
      prev.includes(triggerName) ? prev.filter((t) => t !== triggerName) : [...prev, triggerName],
    )
  }

  const handleDemoValidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoInput.trim()) {
      setInputError('Precisamos que você escreva algo para guardar sua reflexão.')
    } else {
      setInputError('')
      setModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* -------------------------------------------------------------
          Header / Barra Superior Discreta
         ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#FDFAF5]/90 dark:bg-[#1C2420]/90 border-b border-[#E1E8E2] dark:border-[#2D3A34] transition-colors">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] flex items-center justify-center text-[#2F4A3E] dark:text-[#1C2420] font-bold text-base shadow-sm">
              R
            </div>
            <span className="font-bold text-xl tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9]">
              Recomeça
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a href="#como-funciona" className="hidden sm:inline-block">
              <RecomecaButton variant="secondary" size="sm">
                Como funciona
              </RecomecaButton>
            </a>
            <a href="#comecar">
              <RecomecaButton variant="primary" size="sm">
                Quero recomeçar
              </RecomecaButton>
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Centralizado (max-w 720px para acolhimento e foco) */}
      <main className="flex-1 w-full max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* =============================================================
            1. HERO
           ============================================================= */}
        <section className="text-center space-y-6 pt-2 sm:pt-4 animate-fade-in-up">
          {/* Badge de boas-vindas */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] border border-[#7FBFA8]/30">
            <span className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-pulse" />
            Um espaço calmo e sem julgamento
          </div>

          {/* Nome e frase-guia */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9] leading-[1.15]">
              Recomeça
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-[#6A7A72] dark:text-[#A0B0A7] max-w-lg mx-auto">
              Um dia de cada vez. Recomeçar faz parte.
            </p>
          </div>

          {/* Subtítulo explicando as 4 funções */}
          <p className="text-base sm:text-lg text-[#2F4A3E]/90 dark:text-[#E8EFE9]/90 max-w-xl mx-auto leading-relaxed">
            Seu companheiro discreto com <strong>contador acolhedor de dias</strong>,{' '}
            <strong>registro de episódios sem culpa</strong>,{' '}
            <strong>troca de hábito quando bater a vontade</strong> e uma{' '}
            <strong>rede de apoio com botão de emergência</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="#comecar" className="w-full sm:w-auto">
              <RecomecaButton
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Quero recomeçar
              </RecomecaButton>
            </a>
            <a href="#como-funciona" className="w-full sm:w-auto">
              <RecomecaButton variant="secondary" size="lg" fullWidth>
                Ver como funciona
              </RecomecaButton>
            </a>
          </div>

          {/* Card visual de demonstração do contador (não é tela funcional do app) */}
          <div className="pt-4">
            <RecomecaCard
              variant="highlight"
              padding="lg"
              className="text-center relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
                  Exemplo de jornada
                </span>
                <MilestoneBadge days={21} label="Hábito consolidado" size="sm" />
              </div>

              <div className="py-2">
                <span className="text-5xl sm:text-6xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                  21
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#6A7A72] dark:text-[#A0B0A7] mt-1">
                  dias no seu ritmo
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20 max-w-md mx-auto">
                <ProgressBar
                  value={70}
                  size="md"
                  label="Rumo ao marco de 30 dias"
                  showPercentage
                  helperText="Sua melhor sequência foi de 18 dias. Esse progresso é todo seu."
                />
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            2. COMO FUNCIONA (4 Blocos / Funções Centrais)
           ============================================================= */}
        <section id="como-funciona" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Simplicidade no dia a dia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Como o Recomeça funciona
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Quatro pilares simples pensados para apoiar você em qualquer momento, com discrição e
              sem complicação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bloco 1: Contador de Dias */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                1. Contador de dias
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Acompanhe o tempo que você conquistou. Se houver tropeço, seu histórico continua
                seguro com a melhor sequência sempre visível.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5">
                <MilestoneBadge days={7} size="sm" />
                <MilestoneBadge days={30} size="sm" />
                <MilestoneBadge days={90} size="sm" />
              </div>
            </RecomecaCard>

            {/* Bloco 2: Registro de Episódios */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                2. Registro de episódios
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Anote como se sentiu e o que aconteceu em poucos segundos. Sem julgamento, sem
                perguntas invasivas e sem nenhuma culpa.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5">
                <TriggerChip label="estresse" selected size="sm" />
                <TriggerChip label="solidão" size="sm" />
                <TriggerChip label="briga" size="sm" />
              </div>
            </RecomecaCard>

            {/* Bloco 3: Troca de Hábito na Vontade */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                3. Troca de hábito na vontade
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Quando a vontade bater, acione sugestões rápidas de 3 minutos: beber água, respirar
                com calma ou dar uma volta curta.
              </p>
              <div className="pt-1 text-xs font-semibold text-[#2F4A3E] dark:text-[#8FCCAE] bg-[#E8F3EC] dark:bg-[#2A3831] px-3 py-1.5 rounded-xl inline-block">
                Respiração guiada • Copo de água • Caminhada
              </div>
            </RecomecaCard>

            {/* Bloco 4: SOS e Rede de Apoio */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                4. SOS e rede de apoio
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Acesso imediato com um toque a quem você confia e aos serviços públicos e gratuitos
                de acolhimento (CVV 188 e SAMU 192).
              </p>
              <div className="pt-1 text-xs text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#E86A4C]" />
                Botão coral exclusivo nas telas do aplicativo
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            3. PRINCÍPIOS (Linguagem sem culpa, histórico, privacidade)
           ============================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Nossos valores
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Princípios do Recomeça
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Cuidado humano em cada detalhe, para que você nunca se sinta sozinho.
            </p>
          </div>

          <div className="space-y-3">
            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#5DBF8C] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Linguagem sem culpa
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Nada de palavras agressivas ou contadores com tom punitivo. Recomeçar faz parte da
                  jornada de qualquer pessoa.
                </p>
              </div>
            </RecomecaCard>

            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Recaída não zera seu histórico
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Os dias que você conquistou continuam sendo seus. O aplicativo guarda e destaca a
                  sua melhor sequência para você se lembrar da sua força.
                </p>
              </div>
            </RecomecaCard>

            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#6CA8D6] dark:text-[#7EB8E4] flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Privacidade total e discrição (LGPD)
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Seus dados são confidenciais e protegidos pela LGPD. As notificações são neutras e
                  nunca citam substâncias na tela de bloqueio do celular.
                </p>
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            4. PARA QUEM (Substâncias, açúcar/cafeína, remédios — sem fotos de substâncias)
           ============================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Feito para o seu objetivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Para quem é o Recomeça?
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              O método acolhe diferentes jornadas de controle, redução ou pausa completa, sem
              rótulos ou preconceitos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <RecomecaCard
              variant="highlight"
              padding="md"
              className="text-center space-y-2 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#7FBFA8]/20 dark:bg-[#8FCCAE]/20 text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Substâncias
              </h3>
              <p className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Para quem busca reduzir ou interromper o uso no seu próprio ritmo, com discrição.
              </p>
            </RecomecaCard>

            <RecomecaCard
              variant="highlight"
              padding="md"
              className="text-center space-y-2 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#7FBFA8]/20 dark:bg-[#8FCCAE]/20 text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Açúcar e cafeína
              </h3>
              <p className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Para quem sente a saúde pesada e quer recuperar o bem-estar e o foco mental.
              </p>
            </RecomecaCard>

            <RecomecaCard
              variant="highlight"
              padding="md"
              className="text-center space-y-2 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#7FBFA8]/20 dark:bg-[#8FCCAE]/20 text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">Remédios</h3>
              <p className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Apoio na rotina e no autoconhecimento, sempre em sintonia com acompanhamento médico.
              </p>
            </RecomecaCard>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE] shrink-0" />
            <span>
              Parar certas substâncias de uma vez pode ser perigoso. Converse sempre com um médico
              antes de fazer alterações bruscas.
            </span>
          </div>
        </section>

        {/* =============================================================
            EXPERIMENTE OS COMPONENTES BASE (Demonstração prática dos 8 componentes)
           ============================================================= */}
        <section className="space-y-6 pt-4 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Componentes do Design System
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Sinta a experiência acolhedora
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Experimente abaixo os componentes que guiarão o seu dia a dia dentro do Recomeça.
            </p>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-6">
            {/* Seletor de humor */}
            <div className="space-y-2">
              <MoodSelector
                value={selectedMood}
                onChange={(mood) => setSelectedMood(mood)}
                label="1. Seletor de humor diário"
              />
            </div>

            {/* Chips de gatilho */}
            <div className="space-y-2 text-left">
              <span className="text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                2. Chips de gatilho (selecione para experimentar)
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {['estresse', 'briga', 'tédio', 'festa', 'solidão', 'outro'].map((trigger) => (
                  <TriggerChip
                    key={trigger}
                    label={trigger}
                    selected={activeTriggers.includes(trigger)}
                    onToggle={() => toggleTrigger(trigger)}
                  />
                ))}
              </div>
            </div>

            {/* Campo de texto com validação gentil */}
            <form onSubmit={handleDemoValidate} className="space-y-4">
              <RecomecaInput
                label="3. Campo de texto com estado gentil de foco e erro"
                placeholder="Ex.: Hoje senti vontade depois de um dia puxado no trabalho..."
                value={demoInput}
                onChange={(e) => {
                  setDemoInput(e.target.value)
                  if (inputError) setInputError('')
                }}
                errorMessage={inputError}
                helperText="Escreva livremente. Nada do que você digitar aqui será julgado."
              />

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <RecomecaButton variant="primary" size="md" type="submit">
                  Guardar pensamento (abre modal)
                </RecomecaButton>

                <RecomecaButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setDemoInput('')
                    setInputError('Exemplo de erro gentil: preencha antes de continuar.')
                  }}
                >
                  Ver mensagem de erro gentil
                </RecomecaButton>
              </div>
            </form>

            {/* Amostra visual do botão SOS (apenas como demonstração de design system, com aviso) */}
            <div className="pt-4 border-t border-[#E1E8E2] dark:border-[#2D3A34] space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
                  Demonstração do Botão SOS (Coral Exclusivo)
                </span>
                <span className="text-xs text-[#E86A4C] font-semibold">
                  Apenas demonstração visual
                </span>
              </div>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                O tom coral é reservado estritamente para o botão SOS no app. Veja o estilo com
                elevação e destaque permanente:
              </p>
              <div className="pt-2">
                <RecomecaButton
                  variant="sos"
                  size="lg"
                  fullWidth
                  leftIcon={<PhoneCall className="w-5 h-5" />}
                  onClick={() => setModalOpen(true)}
                >
                  Preciso de ajuda agora (SOS)
                </RecomecaButton>
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            5. SEGURANÇA E AVISO LEGAL
           ============================================================= */}
        <section className="space-y-4">
          <RecomecaCard
            variant="default"
            padding="md"
            className="border-l-4 border-l-[#E86A4C] space-y-3"
          >
            <div className="flex items-center gap-2 text-[#2F4A3E] dark:text-[#E8EFE9] font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-[#E86A4C]" />
              <span>Segurança e Aviso Legal Importante</span>
            </div>

            <p className="text-sm text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
              Este app não substitui tratamento. Em emergência, ligue 192.
            </p>

            <p className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Em crise, o botão <strong>Preciso de ajuda agora</strong> liga para{' '}
              <strong>SAMU 192</strong>, <strong>CVV 188</strong> e seu contato de confiança. O
              Recomeça é uma ferramenta de apoio ao autocuidado e nunca sugere dosagens ou substitui
              a avaliação de profissionais da saúde.
            </p>
          </RecomecaCard>
        </section>

        {/* =============================================================
            Chamada Final para Começar
           ============================================================= */}
        <section
          id="comecar"
          className="text-center p-6 sm:p-10 rounded-3xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 dark:border-[#8FCCAE]/20 space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
            Dê o primeiro passo com tranquilidade
          </h2>
          <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto leading-relaxed">
            Sem cobrança, sem julgamento e no seu tempo. As próximas fases do aplicativo estão sendo
            preparadas com carinho.
          </p>
          <div className="pt-2">
            <RecomecaButton
              variant="primary"
              size="lg"
              onClick={() => {
                alert('Obrigado pelo carinho! As telas do app serão liberadas no próximo passo.')
              }}
            >
              Quero recomeçar hoje
            </RecomecaButton>
          </div>
        </section>
      </main>

      {/* =============================================================
          6. RODAPÉ SIMPLES
         ============================================================= */}
      <footer className="mt-12 border-t border-[#E1E8E2] dark:border-[#2D3A34] bg-[#F4F7F2] dark:bg-[#242E29]/50 py-8 px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] flex items-center justify-center text-[#2F4A3E] dark:text-[#1C2420] font-bold text-xs">
              R
            </div>
            <span className="font-bold text-base text-[#2F4A3E] dark:text-[#E8EFE9]">Recomeça</span>
          </div>

          <p className="text-sm font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
            Um dia de cada vez. Recomeçar faz parte.
          </p>

          <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto leading-relaxed opacity-90">
            Este app não substitui tratamento. Em emergência, ligue 192.
            <br />
            Dados protegidos conforme a LGPD. Sem imagens de substâncias ou julgamentos.
          </p>

          <p className="text-[11px] text-[#6A7A72]/70 dark:text-[#A0B0A7]/70 pt-2">
            © {new Date().getFullYear()} Recomeça • Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modal de Confirmação Demonstrativo Acolhedor */}
      <ConfirmationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Pensamento guardado com calma"
        description="Seu registro foi acolhido com sucesso. Lembre-se: cada momento de atenção com você mesmo é um avanço real na sua jornada."
        confirmText="Entendido, obrigado"
        cancelText="Fechar"
        icon={<CheckCircle2 className="w-6 h-6 text-[#4CAF7D]" />}
        onConfirm={() => {
          setModalOpen(false)
          setDemoInput('')
        }}
      />
    </div>
  )
}
