import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { MOCK_CONTACT } from '@/lib/mockData'
import {
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  Wind,
  Heart,
  PenLine,
  MapPin,
  Clock,
  ArrowLeft,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SOS() {
  const navigate = useNavigate()

  // Estado da geolocalização para o WhatsApp
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = React.useState<'idle' | 'loading' | 'ready' | 'denied'>('idle')

  // Respiração Guiada de emergência (ciclo 4s / 6s)
  const [breathPhase, setBreathPhase] = React.useState<'inspire' | 'expire'>('inspire')
  const [breathCount, setBreathCount] = React.useState<number>(4)

  // Tenta obter geolocalização de forma não bloqueante ao abrir a tela
  React.useEffect(() => {
    if ('geolocation' in navigator) {
      setGeoStatus('loading')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setGeoStatus('ready')
        },
        () => {
          setGeoStatus('denied')
        },
        { timeout: 6000, enableHighAccuracy: false },
      )
    } else {
      setGeoStatus('denied')
    }
  }, [])

  // Timer de respiração guiada
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inspire') {
            setBreathPhase('expire')
            return 6
          } else {
            setBreathPhase('inspire')
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [breathPhase])

  // Monta mensagem exata do WhatsApp com link de localização ou sem ele
  const generateWhatsAppUrl = () => {
    const contactPhoneDigits = MOCK_CONTACT.phone.replace(/\D/g, '')
    // Exigência do prompt:
    // "Oi, [nome]. Estou passando por um momento difícil e preciso de você. Minha localização: [link]"
    // [link] é https://maps.google.com/?q=LAT,LNG
    let messageText = `Oi, ${MOCK_CONTACT.name}. Estou passando por um momento difícil e preciso de você.`

    if (coords) {
      const locationLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      messageText += ` Minha localização: ${locationLink}`
    }

    return `https://wa.me/55${contactPhoneDigits}?text=${encodeURIComponent(messageText)}`
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      {/* Header SOS com botão voltar */}
      <ScreenHeader
        title="Ajuda Imediata (SOS)"
        subtitle="Você não está sozinho. Respire. Estamos com você."
        backHref="/hoje"
      />

      <div className="px-4 py-4 space-y-6">
        {/* Banner de acolhimento imediato */}
        <div className="p-4 rounded-3xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-1.5 text-center">
          <div className="w-10 h-10 rounded-full bg-[#7FBFA8] text-white flex items-center justify-center mx-auto">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
            Mantenha a calma. A crise vai passar.
          </h2>
          <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto leading-relaxed">
            Seja um momento de vontade intensa, recaída ou medo, tome uma das ações abaixo em um
            toque.
          </p>
        </div>

        {/* =============================================================
            1. AÇÕES DE UM TOQUE (BOTÕES GRANDES)
           ============================================================= */}
        <section className="space-y-3" aria-label="Contatos de emergência">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block">
            Ações de um toque
          </span>

          {/* 1.1 Ligar para o contato de emergência */}
          <a
            href={`tel:+55${MOCK_CONTACT.phone.replace(/\D/g, '')}`}
            className={cn(
              'flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 rounded-2xl',
              'bg-[#E86A4C] hover:bg-[#D95C3F] dark:bg-[#F07856] dark:hover:bg-[#FF8A6A]',
              'text-white font-bold text-sm tracking-tight',
              'shadow-[0_8px_24px_rgba(232,106,76,0.35)]',
              'transition-all touch-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E86A4C]',
            )}
            aria-label={`Ligar para seu contato de emergência: ${MOCK_CONTACT.name}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs opacity-90 font-medium truncate">
                  Ligar para contato de apoio
                </span>
                <span className="text-base font-bold truncate block">{MOCK_CONTACT.name}</span>
              </div>
            </div>
            <span className="text-xs font-semibold underline tabular-nums opacity-95 shrink-0 ml-auto">
              {MOCK_CONTACT.displayPhone}
            </span>
          </a>

          {/* 1.2 WhatsApp com localização */}
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 rounded-2xl',
              'bg-[#4CAF7D] hover:bg-[#3d9668] text-white font-bold text-sm',
              'shadow-[0_4px_16px_rgba(76,175,125,0.3)]',
              'transition-all touch-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4CAF7D]',
            )}
            aria-label={`Enviar mensagem no WhatsApp para ${MOCK_CONTACT.name}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs opacity-90 font-medium truncate">
                  WhatsApp com mensagem pronta
                </span>
                <span className="text-sm font-bold truncate block">
                  Mandar mensagem para {MOCK_CONTACT.name}
                </span>
              </div>
            </div>
            {coords && (
              <span className="text-[11px] font-semibold flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg shrink-0 ml-auto">
                <MapPin className="w-3 h-3" /> com mapa
              </span>
            )}
          </a>

          {/* 1.3 Ligar SAMU 192 e CVV 188 */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href="tel:192"
              className={cn(
                'flex flex-col items-center justify-center p-3.5 rounded-2xl text-center',
                'bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34]',
                'hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] text-[#2F4A3E] dark:text-[#E8EFE9]',
                'transition-all touch-target',
              )}
              aria-label="Ligar SAMU 192 para emergências de saúde"
            >
              <ShieldAlert className="w-6 h-6 text-[#E86A4C] mb-1" />
              <span className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                Emergência SUS
              </span>
              <span className="text-base font-bold tabular-nums">Ligar SAMU 192</span>
            </a>

            <a
              href="tel:188"
              className={cn(
                'flex flex-col items-center justify-center p-3.5 rounded-2xl text-center',
                'bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34]',
                'hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] text-[#2F4A3E] dark:text-[#E8EFE9]',
                'transition-all touch-target',
              )}
              aria-label="Ligar CVV 188 para apoio emocional 24 horas"
            >
              <Heart className="w-6 h-6 text-[#7FBFA8] mb-1" />
              <span className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                Apoio Emocional
              </span>
              <span className="text-base font-bold tabular-nums">Ligar CVV 188</span>
            </a>
          </div>
        </section>

        {/* =============================================================
            2. RESPIRAÇÃO GUIADA DE EMERGÊNCIA (4s / 6s)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="highlight" padding="lg" className="text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              <Wind className="w-4 h-4 text-[#7FBFA8]" />
              <span>Respire com calma agora</span>
            </div>

            <div className="py-2 flex flex-col items-center justify-center">
              <div
                className={cn(
                  'w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out',
                  'bg-white/80 dark:bg-[#1C2420]/80 border-2 border-[#7FBFA8]',
                  breathPhase === 'inspire' ? 'scale-115 bg-[#7FBFA8]/20' : 'scale-90',
                )}
              >
                <div className="text-center">
                  <span className="text-xl font-bold tabular-nums text-[#2F4A3E] dark:text-[#E8EFE9] block">
                    {breathCount}s
                  </span>
                  <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                    {breathPhase === 'inspire' ? 'inspire...' : 'solte devagar...'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-3 max-w-xs leading-relaxed">
                Concentre-se no ar entrando e saindo. Você está no controle deste segundo.
              </p>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. QUER REGISTRAR O QUE ACONTECEU?
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="md" className="space-y-3 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7]">
              Passou o pior momento?
            </span>
            <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              Quer registrar o que aconteceu?
            </h3>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto leading-relaxed">
              Escrever enquanto as lembranças estão frescas ajuda a identificar gatilhos e a se
              proteger na próxima vez.
            </p>
            <div className="pt-1">
              <Link to="/registrar">
                <RecomecaButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  leftIcon={<PenLine className="w-4 h-4" />}
                >
                  Registrar episódio no diário
                </RecomecaButton>
              </Link>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. CARTÃO "RECOMEÇAR FAZ PARTE" SEM CULPA
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard
            variant="default"
            padding="lg"
            className="border-l-4 border-l-[#7FBFA8] space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
              <Heart className="w-4 h-4 text-[#7FBFA8]" />
              <span>Recomeçar faz parte. Não se puna.</span>
            </div>
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              Qualquer caminhada longa tem pausas e tropeços. O mais importante é que você não
              desistiu de você. Amanhã o sol nasce de novo e você recomeça com mais aprendizado.
            </p>
          </RecomecaCard>
        </section>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
