import * as React from 'react'
import { Link } from 'react-router-dom'
import { RecomecaButton, RecomecaCard, MilestoneBadge, ProgressBar } from '@/components/recomeca'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  Heart,
  ExternalLink,
  HelpCircle,
  Quote,
} from 'lucide-react'

export default function Index() {
  return (
    <div className="w-full flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* -------------------------------------------------------------
          Header / Barra Superior Discreta da Landing
         ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#FDFAF5]/90 dark:bg-[#1C2420]/90 border-b border-[#E1E8E2] dark:border-[#2D3A34] transition-colors">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none">
            <div className="w-8 h-8 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] flex items-center justify-center text-[#2F4A3E] dark:text-[#1C2420] font-bold text-base shadow-sm">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9] leading-tight">
                Recomeça
              </span>
              <span className="text-[10px] font-medium text-[#6A7A72] dark:text-[#A0B0A7] leading-none">
                Um dia de cada vez
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/hoje" className="hidden sm:inline-block">
              <RecomecaButton variant="secondary" size="sm">
                Abrir app
              </RecomecaButton>
            </Link>
            <Link to="/onboarding">
              <RecomecaButton
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Começar
              </RecomecaButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <div className="w-full px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
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
              Controle seus vícios.
              <br />
              <span className="text-[#6DA98F] dark:text-[#8FCCAE]">Um dia de cada vez.</span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-[#6A7A72] dark:text-[#A0B0A7] max-w-lg mx-auto">
              Recomeçar faz parte. Aqui não há culpa, não há pressa e sua história nunca é zerada.
            </p>
          </div>

          {/* Subtítulo explicando as funções */}
          <p className="text-sm sm:text-base text-[#2F4A3E]/90 dark:text-[#E8EFE9]/90 max-w-xl mx-auto leading-relaxed">
            Seja para <strong>parar de vez</strong> ou <strong>reduzir aos poucos</strong>:
            acompanhe seus dias, registre episódios com honestidade, troque o hábito quando a
            vontade vier e tenha apoio seguro sempre à mão.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <RecomecaButton
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Começar minha jornada
              </RecomecaButton>
            </Link>
            <Link to="/hoje" className="w-full sm:w-auto">
              <RecomecaButton variant="secondary" size="lg" fullWidth>
                Ver demonstração do app
              </RecomecaButton>
            </Link>
          </div>

          {/* Card visual de demonstração do contador */}
          <div className="pt-2">
            <RecomecaCard
              variant="highlight"
              padding="lg"
              className="text-center relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
                  Exemplo de jornada real
                </span>
                <MilestoneBadge days={21} label="Primeiro marco" size="sm" />
              </div>

              <div className="py-2">
                <span className="text-5xl sm:text-6xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9]">
                  21
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#6A7A72] dark:text-[#A0B0A7] mt-1">
                  dias limpos agora
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#7FBFA8]/20 dark:border-[#8FCCAE]/20 max-w-md mx-auto">
                <ProgressBar
                  value={70}
                  size="md"
                  label="Rumo ao marco de 30 dias"
                  showPercentage
                  helperText="Melhor sequência: 34 dias • Dias livres no mês: 23 • Um hábito se constrói em média em ~66 dias."
                />
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            2. COMO FUNCIONA (4 Passos com Ícones)
           ============================================================= */}
        <section id="como-funciona" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Simplicidade e acolhimento
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Como o Recomeça funciona em 4 passos
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Sem termos clínicos complicados, sem gráficos frios. Cada ferramenta foi criada para
              acalmar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bloco 1: Contador de Dias */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                1. Contador que não zera tudo
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Você acompanha os dias atuais, mas sua <strong>melhor sequência</strong> e os{' '}
                <strong>dias livres no mês</strong> continuam visíveis. O que você viveu continua
                valendo.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5">
                <MilestoneBadge days={21} size="sm" />
                <MilestoneBadge days={30} size="sm" />
                <MilestoneBadge days={60} size="sm" />
                <MilestoneBadge days={90} size="sm" />
              </div>
            </RecomecaCard>

            {/* Bloco 2: Registro de Episódios */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                2. Registro seguro do que aconteceu
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Escreva livremente, identifique gatilhos (estresse, festa, solidão) e anote os
                gastos com honestidade. Registrar já é um ato de cuidado.
              </p>
              <div className="pt-1 text-xs text-[#2F4A3E] dark:text-[#8FCCAE] font-semibold bg-[#E8F3EC] dark:bg-[#2A3831] px-3 py-1.5 rounded-xl inline-block">
                Gatilhos • Tempo consumido • Recibo do momento
              </div>
            </RecomecaCard>

            {/* Bloco 3: Troca de Hábito na Vontade */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                3. Bateu a vontade? Troque de hábito
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                A vontade vem e passa como uma onda. Um timer de 15 minutos, respiração guiada calma
                e ideias práticas para tirar o foco da urgência.
              </p>
              <div className="pt-1 text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Timer 15 min • Respiração 4s/6s • Caminhada, água, banho
              </div>
            </RecomecaCard>

            {/* Bloco 4: SOS e Rede de Apoio */}
            <RecomecaCard variant="default" padding="md" className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                4. SOS e apoio ao alcance de um toque
              </h3>
              <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                Em momentos difíceis, chame seu contato de confiança com localização via WhatsApp,
                ou ligue direto para SAMU 192 e CVV 188.
              </p>
              <div className="pt-1 text-xs text-[#E86A4C] dark:text-[#F07856] font-semibold flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                Botão SOS flutuante disponível em todas as telas
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            3. PRINCÍPIOS FUNDAMENTAIS
           ============================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              O que nos guia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Princípios inegociáveis do Recomeça
            </h2>
            <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Cada tela foi desenhada para acolher, nunca para acusar ou cobrar.
            </p>
          </div>

          <div className="space-y-3">
            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#4CAF7D] dark:text-[#5DBF8C] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Linguagem simples, sem julgamento e sem culpa
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Não existem palavras punitivas. Reconhecemos que o caminho tem altos e baixos e
                  que qualquer dia de atenção consigo mesmo é um avanço.
                </p>
              </div>
            </RecomecaCard>

            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Segurança em primeiro lugar: nunca sugerimos doses
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  O app nunca sugere dosagens nem pede para parar remédios por conta própria. Para
                  certas substâncias, parar de vez é perigoso — sempre orientamos a conversar com o
                  médico.
                </p>
              </div>
            </RecomecaCard>

            <RecomecaCard variant="default" padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#6CA8D6] dark:text-[#7EB8E4] flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Privacidade total e notificações neutras (LGPD)
                </h3>
                <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
                  Seus dados de saúde são seus. Notificações chegam discretas (&ldquo;Seu lembrete
                  do dia&rdquo;), sem nunca expor nenhuma substância na tela do seu celular.
                </p>
              </div>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            4. DEPOIMENTOS ILUSTRATIVOS (Claramente marcados)
           ============================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Jornadas possíveis
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Como as pessoas usam o Recomeça
            </h2>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              (Exemplos ilustrativos representando situações reais de apoio)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <RecomecaCard
              variant="highlight"
              padding="md"
              className="space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  <Quote className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Carlos, 34 anos
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed italic">
                  &ldquo;Ter o contador sem a humilhação de ver tudo zerar mudou minha cabeça.
                  Quando tive um episódio, continuei vendo meus 40 dias anteriores.&rdquo;
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] block border-t border-[#7FBFA8]/20 pt-2">
                Objetivo: Álcool • Parar
              </span>
            </RecomecaCard>

            <RecomecaCard
              variant="highlight"
              padding="md"
              className="space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  <Quote className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Juliana, 29 anos
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed italic">
                  &ldquo;A respiração de 15 minutos na hora que bate o desespero me salvou várias
                  noites. A vontade vem forte, mas passa.&rdquo;
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] block border-t border-[#7FBFA8]/20 pt-2">
                Objetivo: Açúcar e café • Reduzir
              </span>
            </RecomecaCard>

            <RecomecaCard
              variant="highlight"
              padding="md"
              className="space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  <Quote className="w-4 h-4 text-[#7FBFA8] dark:text-[#8FCCAE]" />
                  <span className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Rodrigo, 42 anos
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed italic">
                  &ldquo;Uso o botão SOS para mandar WhatsApp com minha localização para o meu
                  irmão. Saber que ele está a um toque me dá paz.&rdquo;
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] block border-t border-[#7FBFA8]/20 pt-2">
                Objetivo: Calmantes • Em tratamento médico
              </span>
            </RecomecaCard>
          </div>
        </section>

        {/* =============================================================
            5. FAQ ACCORDION (Perguntas Frequentes)
           ============================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Tire suas dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Perguntas frequentes
            </h2>
            <p className="text-sm text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto">
              Tudo sobre como o aplicativo cuida de você.
            </p>
          </div>

          <RecomecaCard variant="default" padding="sm" className="overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="faq-1"
                className="border-b border-[#E1E8E2] dark:border-[#2D3A34] px-3"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] py-3.5 hover:no-underline">
                  O que acontece se eu tiver uma recaída? O contador zera?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pb-3.5">
                  Não zera tudo. O contador mostra os dias limpos do ciclo atual, mas sua melhor
                  sequência continua registrada com carinho, assim como os dias livres do mês.
                  Recomeçar faz parte do processo e cada tentativa fortalece novos caminhos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-2"
                className="border-b border-[#E1E8E2] dark:border-[#2D3A34] px-3"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] py-3.5 hover:no-underline">
                  O aplicativo sugere diminuir ou parar remédios?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pb-3.5">
                  Nunca. O aplicativo nunca recomenda dosagens nem pede para você parar qualquer
                  remédio por conta própria. Qualquer mudança de prescrição deve ser feita com seu
                  médico de confiança. O app serve apenas para acompanhar horários e sinais de
                  alerta para levar à sua consulta.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-3"
                className="border-b border-[#E1E8E2] dark:border-[#2D3A34] px-3"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] py-3.5 hover:no-underline">
                  O que o botão SOS faz de verdade?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pb-3.5">
                  O botão SOS abre uma tela emergencial de um toque: permite ligar diretamente para
                  o SAMU 192, CVV 188 ou para seu contato de apoio, além de enviar uma mensagem
                  pronta no WhatsApp com sua localização aproximada pelo Google Maps.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-4"
                className="border-b border-[#E1E8E2] dark:border-[#2D3A34] px-3"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] py-3.5 hover:no-underline">
                  Minha família ou patrão podem ver meus registros?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pb-3.5">
                  Não. Seus dados são confidenciais e protegidos pela LGPD. Além disso, as
                  notificações enviadas para o seu celular são totalmente neutras (exemplo:
                  &ldquo;Seu lembrete do dia&rdquo;) e nunca citam substâncias.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="border-none px-3">
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] py-3.5 hover:no-underline">
                  Por que os ciclos de 21, 30, 60 e 90 dias são destacados?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pb-3.5">
                  Esses marcos funcionam como pequenas celebrações psicológicas de acolhimento. A
                  ciência do comportamento mostra que consolidar um novo hábito leva em média cerca
                  de 66 dias — cada semana vencida é uma vitória.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </RecomecaCard>
        </section>

        {/* =============================================================
            6. AVISO LEGAL E SEGURANÇA
           ============================================================= */}
        <section className="space-y-4">
          <RecomecaCard
            variant="default"
            padding="md"
            className="border-l-4 border-l-[#E86A4C] space-y-3"
          >
            <div className="flex items-center gap-2 text-[#2F4A3E] dark:text-[#E8EFE9] font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-[#E86A4C]" />
              <span>Segurança e Aviso Legal Obrigatório</span>
            </div>

            <p className="text-sm text-[#2F4A3E] dark:text-[#E8EFE9] font-medium leading-relaxed">
              Este app não substitui tratamento. Em emergência, ligue 192.
            </p>

            <p className="text-xs sm:text-sm text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Para pessoas com uso frequente de álcool, calmantes ou opioides,{' '}
              <strong>parar de uma vez pode ser perigoso</strong>. Consulte sempre uma equipe
              médica, o CAPS AD do seu município ou ligue para o SAMU 192.
            </p>
          </RecomecaCard>
        </section>

        {/* =============================================================
            7. CTA FINAL FORTE
           ============================================================= */}
        <section
          id="comecar"
          className="text-center p-6 sm:p-10 rounded-3xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 dark:border-[#8FCCAE]/20 space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#7FBFA8]/30 dark:bg-[#8FCCAE]/30 text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
            Dê o primeiro passo com tranquilidade
          </h2>
          <p className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] max-w-md mx-auto leading-relaxed">
            Sem cobrança, sem julgamento e no seu tempo. O processo começa respondendo a poucas
            perguntas gentis.
          </p>
          <div className="pt-2">
            <Link to="/onboarding">
              <RecomecaButton
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Começar agora no seu ritmo
              </RecomecaButton>
            </Link>
          </div>
        </section>
      </div>

      {/* =============================================================
          8. RODAPÉ COMPLETO
         ============================================================= */}
      <footer className="mt-12 border-t border-[#E1E8E2] dark:border-[#2D3A34] bg-[#F4F7F2] dark:bg-[#242E29]/50 py-10 px-4 sm:px-6">
        <div className="w-full max-w-[720px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#7FBFA8] dark:bg-[#8FCCAE] flex items-center justify-center text-[#2F4A3E] dark:text-[#1C2420] font-bold text-xs">
                R
              </div>
              <span className="font-bold text-base text-[#2F4A3E] dark:text-[#E8EFE9]">
                Recomeça
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
              Um dia de cada vez. Recomeçar faz parte.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block mb-2">
              Redes públicas e gratuitas de acolhimento
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#2F4A3E] dark:text-[#8FCCAE]">
              <a
                href="https://www.aa.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                A.A. (Alcoólicos Anônimos) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.na.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                N.A. (Narcóticos Anônimos) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://cvv.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                CVV 188 <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                CAPS AD (SUS) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] space-y-1 pt-2 border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 leading-relaxed">
            <p className="font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Este app não substitui tratamento. Em emergência, ligue 192.
            </p>
            <p>
              Privacidade: Dados protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
              Notificações são neutras. Sem termos clínicos punitivos, sem exposição pública.
            </p>
            <p className="pt-2 opacity-75">
              © {new Date().getFullYear()} Recomeça • Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
