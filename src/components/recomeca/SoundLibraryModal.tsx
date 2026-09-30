import * as React from 'react'
import {
  Volume2,
  VolumeX,
  Wind,
  Sparkles,
  Waves,
  CloudRain,
  Headphones,
  Activity,
  Square,
  Play,
  Sliders,
  Check,
  Sparkle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  ambientAudio,
  SOUND_LIST,
  SOUND_DEFINITIONS,
  SoundDefinition,
  SoundId,
} from '@/lib/ambientSound'
import { cn } from '@/lib/utils'

// Mapeamento de ícones acessíveis
function renderSoundIcon(iconName: SoundDefinition['iconName'], className = 'w-5 h-5') {
  switch (iconName) {
    case 'Wind':
      return <Wind className={className} />
    case 'Sparkles':
      return <Sparkles className={className} />
    case 'Waves':
      return <Waves className={className} />
    case 'CloudRain':
      return <CloudRain className={className} />
    case 'Fish':
      return <Waves className={className} />
    case 'Headphones':
      return <Headphones className={className} />
    case 'Activity':
      return <Activity className={className} />
    default:
      return <Sparkles className={className} />
  }
}

export type SituationContext =
  | 'fissura-ansiedade'
  | 'respiracao'
  | 'noite-sono'
  | 'tedio-foco'
  | 'meditacao-pausa'

export interface SoundLibraryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context?: SituationContext
  onSoundSelect?: (soundId: SoundId) => void
  /** Se estiver na tela SOS, usar coral de segurança apenas nos controles críticos se necessário */
  isSosMode?: boolean
}

/**
 * Retorna sugestão gentil de acordo com a situação atual
 */
export function getGentleSoundSuggestion(situation?: SituationContext): {
  soundId: SoundId
  title: string
  gentleInvite: string
} {
  const currentHour = new Date().getHours()
  const isNight = currentHour >= 21 || currentHour < 6

  if (situation === 'noite-sono' || (isNight && situation !== 'tedio-foco')) {
    return {
      soundId: 'rain',
      title: 'Vontade à noite ou insônia',
      gentleInvite:
        'Que tal o som de chuva ou ruído marrom para desacelerar o corpo e ajudar a descansar?',
    }
  }

  if (situation === 'fissura-ansiedade') {
    return {
      soundId: 'brown',
      title: 'Ansiedade ou fissura intensa',
      gentleInvite:
        'Que tal ouvir o ruído marrom? O tom grave e quente ajuda a acalmar os pensamentos acelerados.',
    }
  }

  if (situation === 'tedio-foco') {
    return {
      soundId: 'lofi',
      title: 'Tédio ou busca por foco',
      gentleInvite:
        'Que tal a calma do lo-fi ou ruído branco? Uma companhia suave para preencher o vazio com tranquilidade.',
    }
  }

  if (situation === 'respiracao') {
    return {
      soundId: 'ocean',
      title: 'Durante a respiração guiada',
      gentleInvite:
        'Que tal ouvir o ritmo do oceano & baleias? O fluxo das ondas acompanha o compasso natural de inspirar e soltar.',
    }
  }

  // Padrão acolhedor
  return {
    soundId: 'ocean',
    title: 'Momento de respirar',
    gentleInvite: 'Que tal acompanhar com o som do oceano ou chuva suave?',
  }
}

/**
 * Modal completo da Biblioteca de Sons do Recomeça
 */
export function SoundLibraryModal({
  open,
  onOpenChange,
  context = 'respiracao',
  onSoundSelect,
  isSosMode = false,
}: SoundLibraryModalProps) {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(ambientAudio.getIsPlaying())
  const [currentId, setCurrentId] = React.useState<SoundId>(ambientAudio.getCurrentSoundId())
  const [volume, setVolume] = React.useState<number>(ambientAudio.getVolume())

  React.useEffect(() => {
    const unsub = ambientAudio.subscribe(() => {
      setIsPlaying(ambientAudio.getIsPlaying())
      setCurrentId(ambientAudio.getCurrentSoundId())
      setVolume(ambientAudio.getVolume())
    })
    return unsub
  }, [])

  const suggestion = React.useMemo(() => getGentleSoundSuggestion(context), [context])

  const handlePlaySound = (soundId: SoundId) => {
    if (isPlaying && currentId === soundId) {
      ambientAudio.pause()
    } else {
      ambientAudio.play(soundId)
    }
    onSoundSelect?.(soundId)
  }

  const handleStop = () => {
    ambientAudio.pause()
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    ambientAudio.setVolume(val)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[480px] w-[calc(100%-28px)] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl',
          'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34]',
          'text-[#2F4A3E] dark:text-[#E8EFE9] shadow-2xl',
        )}
      >
        {/* Cabeçalho */}
        <div className="p-5 pb-3 border-b border-[#E1E8E2] dark:border-[#2D3A34] bg-white/70 dark:bg-[#1C2420]/70 backdrop-blur-sm">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center text-white',
                    isSosMode ? 'bg-[#7FBFA8]' : 'bg-[#7FBFA8]',
                  )}
                >
                  <Volume2 className="w-4 h-4" />
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Biblioteca de Sons
                </DialogTitle>
              </div>

              {/* Status tocando */}
              {isPlaying && (
                <span className="text-[11px] font-semibold text-[#4CAF7D] dark:text-[#8FCCAE] flex items-center gap-1.5 bg-[#E8F3EC] dark:bg-[#2A3831] px-2.5 py-1 rounded-full border border-[#7FBFA8]/30">
                  <span className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-ping" />
                  Tocando agora
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed pt-1">
              Todos os sons são gerados no próprio app, offline e sem consumo de dados. Toque para
              ouvir no seu tempo.
            </DialogDescription>
          </DialogHeader>

          {/* Sugestão gentil contextual (aparece como convite, nunca como ordem) */}
          <div className="mt-3 p-3 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4CAF7D] dark:text-[#8FCCAE] flex items-center gap-1">
                <Sparkle className="w-3 h-3" />
                Sugestão acolhedora: {suggestion.title}
              </span>
              <button
                type="button"
                onClick={() => handlePlaySound(suggestion.soundId)}
                className="text-[11px] font-bold text-[#2F4A3E] dark:text-[#E8EFE9] underline hover:text-[#4CAF7D]"
              >
                {isPlaying && currentId === suggestion.soundId ? 'Pausar' : 'Ouvir agora'}
              </button>
            </div>
            <p className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-relaxed">
              {suggestion.gentleInvite}
            </p>
          </div>
        </div>

        {/* Lista de Sons com scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block px-1">
              Escolha um som para acolher o momento
            </span>
          </div>

          <div className="space-y-2">
            {SOUND_LIST.map((sound) => {
              const isSelected = currentId === sound.id
              const isCurrentPlaying = isSelected && isPlaying

              return (
                <div
                  key={sound.id}
                  onClick={() => handlePlaySound(sound.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handlePlaySound(sound.id)
                    }
                  }}
                  className={cn(
                    'w-full p-3.5 rounded-2xl border text-left transition-all touch-target select-none cursor-pointer',
                    'flex items-start justify-between gap-3 group',
                    isCurrentPlaying
                      ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] shadow-sm'
                      : isSelected
                        ? 'bg-white dark:bg-[#242E29] border-[#7FBFA8]/60'
                        : 'bg-white dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/60',
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                        isCurrentPlaying
                          ? 'bg-[#4CAF7D] text-white shadow-sm'
                          : 'bg-[#F4F7F2] dark:bg-[#1C2420] text-[#7FBFA8] dark:text-[#8FCCAE] group-hover:bg-[#E8F3EC]',
                      )}
                    >
                      {renderSoundIcon(sound.iconName, 'w-5 h-5')}
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-tight">
                          {sound.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#7FBFA8]/20 text-[#2F4A3E] dark:text-[#8FCCAE]">
                            {isCurrentPlaying ? 'ativo' : 'selecionado'}
                          </span>
                        )}
                      </div>

                      {/* Legenda "bom para" em destaque simples */}
                      <p className="text-xs font-semibold text-[#4CAF7D] dark:text-[#8FCCAE] leading-tight">
                        Bom para: {sound.bestFor}
                      </p>

                      <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed line-clamp-2 pt-0.5">
                        {sound.description}
                      </p>
                    </div>
                  </div>

                  {/* Botão de ação direta touch target >= 44px */}
                  <div className="shrink-0 flex items-center self-center pl-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlaySound(sound.id)
                      }}
                      aria-label={
                        isCurrentPlaying
                          ? `Pausar ${sound.name}`
                          : `Tocar ${sound.name} (${sound.bestFor})`
                      }
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-all touch-target',
                        isCurrentPlaying
                          ? 'bg-[#4CAF7D] text-white hover:bg-[#3d9668]'
                          : 'bg-[#F4F7F2] dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#7FBFA8] hover:text-white border border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      {isCurrentPlaying ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rodapé fixo com controles: Parar sempre visível, volume baixo ajustável */}
        <div className="p-4 border-t border-[#E1E8E2] dark:border-[#2D3A34] bg-[#F4F7F2]/90 dark:bg-[#1C2420]/90 backdrop-blur-sm space-y-3">
          {/* Controle de volume com slider suave */}
          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-[#6A7A72] shrink-0" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                <span>Volume suave</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Ajustar volume do som ambiente"
                className="w-full accent-[#4CAF7D] cursor-pointer h-2 bg-white dark:bg-[#242E29] rounded-lg"
              />
            </div>
            <Volume2 className="w-4 h-4 text-[#4CAF7D] shrink-0" />
          </div>

          {/* Botões de controle */}
          <div className="flex items-center gap-2 pt-1">
            {isPlaying ? (
              <button
                type="button"
                onClick={handleStop}
                className={cn(
                  'flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-target',
                  'bg-[#2F4A3E] dark:bg-[#E8EFE9] text-white dark:text-[#1C2420]',
                  'flex items-center justify-center gap-2 shadow-sm',
                )}
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Parar som ambiente</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePlaySound(currentId)}
                className={cn(
                  'flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-target',
                  'bg-[#4CAF7D] text-white hover:bg-[#3d9668]',
                  'flex items-center justify-center gap-2 shadow-sm',
                )}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Tocar {ambientAudio.getCurrentSound().name}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target hover:bg-[#E8F3EC]"
            >
              Fechar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Barra ou Botão Integrado de Som Ambiente
 * Mostra o estado atual, permite tocar/parar em 1 toque e abrir a biblioteca completa
 */
export interface AmbientSoundPlayerBarProps {
  context?: SituationContext
  className?: string
  variant?: 'compact' | 'card' | 'floating'
  isSosMode?: boolean
}

export function AmbientSoundPlayerBar({
  context = 'respiracao',
  className,
  variant = 'card',
  isSosMode = false,
}: AmbientSoundPlayerBarProps) {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(ambientAudio.getIsPlaying())
  const [currentSoundId, setCurrentSoundId] = React.useState<SoundId>(
    ambientAudio.getCurrentSoundId(),
  )

  React.useEffect(() => {
    const unsub = ambientAudio.subscribe(() => {
      setIsPlaying(ambientAudio.getIsPlaying())
      setCurrentSoundId(ambientAudio.getCurrentSoundId())
    })
    return unsub
  }, [])

  const currentSound = SOUND_DEFINITIONS[currentSoundId] || SOUND_DEFINITIONS.brown
  const suggestion = getGentleSoundSuggestion(context)

  const handleToggle = () => {
    ambientAudio.toggle()
  }

  const handleStop = () => {
    ambientAudio.pause()
  }

  if (variant === 'compact') {
    return (
      <>
        <div
          className={cn(
            'inline-flex items-center gap-1.5 p-1 rounded-full border transition-all text-xs',
            isPlaying
              ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] text-[#2F4A3E] dark:text-[#8FCCAE]'
              : 'bg-white dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7]',
            className,
          )}
        >
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isPlaying ? `Pausar ${currentSound.name}` : `Tocar ${currentSound.name}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold touch-target hover:opacity-85"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#4CAF7D] animate-pulse" />
                <span className="font-bold">{currentSound.name}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#6A7A72]" />
                <span>Sons relaxantes</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpenModal(true)}
            aria-label="Abrir biblioteca de sons para trocar"
            className="px-2.5 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 font-medium text-[11px] underline touch-target"
          >
            Trocar som
          </button>
        </div>

        <SoundLibraryModal
          open={isOpenModal}
          onOpenChange={setIsOpenModal}
          context={context}
          isSosMode={isSosMode}
        />
      </>
    )
  }

  // Card expandido e acolhedor (ideal para topo ou seção da respiração)
  return (
    <>
      <div
        className={cn(
          'p-3.5 rounded-2xl border transition-all space-y-2.5',
          isPlaying
            ? 'bg-[#E8F3EC]/80 dark:bg-[#2A3831]/80 border-[#7FBFA8]'
            : 'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34]',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                isPlaying
                  ? 'bg-[#4CAF7D] text-white'
                  : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#7FBFA8]',
              )}
            >
              {renderSoundIcon(currentSound.iconName, 'w-4 h-4')}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] block leading-tight">
                Biblioteca de Sons (Web Audio)
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
                {currentSound.name}{' '}
                <span className="font-normal text-[#6A7A72] dark:text-[#A0B0A7] text-[11px]">
                  • {currentSound.bestFor}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botão de parar sempre visível quando tocando */}
            {isPlaying && (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Parar som ambiente"
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#F4F7F2] transition-colors touch-target flex items-center gap-1"
              >
                <Square className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Parar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggle}
              aria-label={isPlaying ? 'Pausar som ambiente' : `Tocar ${currentSound.name}`}
              className={cn(
                'px-3 py-1.5 rounded-xl font-bold text-xs transition-all touch-target flex items-center gap-1.5',
                isPlaying
                  ? 'bg-[#4CAF7D] text-white'
                  : 'bg-[#7FBFA8] hover:bg-[#6DA98F] text-white',
              )}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Tocando</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Ouvir som</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Linha de sugestão gentil e link para abrir biblioteca */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 text-xs">
          <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1 min-w-0">
            <Sparkle className="w-3 h-3 text-[#7FBFA8] shrink-0" />
            <span className="truncate">{suggestion.gentleInvite}</span>
          </p>

          <button
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="text-[11px] font-bold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline flex items-center gap-1 shrink-0 ml-auto"
          >
            <Sliders className="w-3 h-3" />
            <span>Ver todos os 7 sons & volume</span>
          </button>
        </div>
      </div>

      <SoundLibraryModal
        open={isOpenModal}
        onOpenChange={setIsOpenModal}
        context={context}
        isSosMode={isSosMode}
      />
    </>
  )
}
