import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RecomecaButton,
  RecomecaCard,
  RecomecaInput,
  MoodSelector,
  TriggerChip,
  ConfirmationModal,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import {
  MOCK_TRACKED_HABITS,
  ONBOARDING_SUBSTANCES,
  CIGARETTE_CONTEXTS,
  SubstanceDetails,
} from '@/lib/mockData'
import { useRecomecaStore } from '@/lib/recomecaStore'
import {
  CheckCircle2,
  ReceiptText,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Camera,
  Heart,
  ArrowRight,
  Shuffle,
  Info,
  Cigarette,
  Users,
  Package,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_TRIGGERS = [
  'estresse',
  'briga',
  'tédio',
  'festa',
  'solidão',
  'pressão no trabalho',
  'ansiedade',
  'outro',
]

// Durações comuns de uso (sem julgamento)
const USAGE_DURATIONS = [
  'Em 15 a 30 minutos',
  'Em uma hora',
  'Em algumas horas (2 a 4h)',
  'Numa noite',
  'Ao longo do dia',
  'Ao longo de vários dias',
  'Outro ritmo',
] as const

// Valores rápidos de compra para substâncias com gramas/porções
const COMMON_BOUGHT_AMOUNTS = ['0,5g', '1g', '2g', '3g', '5g', 'outro'] as const
const COMMON_USED_AMOUNTS = ['0,5g', '1g', '2g', '3g', 'tudo o que comprei', 'outro'] as const

// Tipos comuns para álcool
const ALCOHOL_UNITS_SUGGESTIONS = [
  '1 lata / long neck (350ml)',
  '2 a 3 latas',
  '4 ou mais latas',
  '1 ou 2 taças de vinho',
  '1 garrafa de vinho',
  '1 dose de destilado (50ml)',
  '2 a 3 doses',
  'chope no bar / saída',
] as const

export default function Registrar() {
  const navigate = useNavigate()
  const { recordHonestEpisode, logCigaretteWithDetails } = useRecomecaStore()

  // Horário atual padrão
  const now = new Date()
  const defaultTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}`

  // Campos ricos, humanos e 100% opcionais
  const [mood, setMood] = React.useState<string>('dificil')
  const [selectedSubstance, setSelectedSubstance] = React.useState<string>(
    MOCK_TRACKED_HABITS[0].name,
  )
  const [amountUsed, setAmountUsed] = React.useState<string>('')
  const [episodeTime, setEpisodeTime] = React.useState<string>(defaultTimeStr)

  // Campos específicos de tabaco / cigarros
  const [cigaretteInputMode, setCigaretteInputMode] = React.useState<'cigarros' | 'macos'>(
    'cigarros',
  )
  const [cigaretteQuantity, setCigaretteQuantity] = React.useState<string>('3')
  const [cigaretteContext, setCigaretteContext] = React.useState<string>('Depois do almoço')
  const [customCigaretteContext, setCustomCigaretteContext] = React.useState<string>('')

  // Campos de substâncias (cocaína, maconha, MD, LSD, remédios, etc.)
  const [boughtAmount, setBoughtAmount] = React.useState<string>('1g')
  const [customBoughtAmount, setCustomBoughtAmount] = React.useState<string>('')
  const [substanceUsedAmount, setSubstanceUsedAmount] = React.useState<string>('1g')
  const [customUsedAmount, setCustomUsedAmount] = React.useState<string>('')
  const [usageDuration, setUsageDuration] = React.useState<string>('Numa noite')
  const [sharedWithOthers, setSharedWithOthers] = React.useState<
    'sim' | 'nao' | 'sozinho' | 'outro'
  >('sim')
  const [sharedNotes, setSharedNotes] = React.useState<string>('')

  // Campos de álcool
  const [alcoholType, setAlcoholType] = React.useState<'cerveja' | 'vinho' | 'destilado' | 'outro'>(
    'cerveja',
  )
  const [alcoholUnitChosen, setAlcoholUnitChosen] = React.useState<string>(
    '1 lata / long neck (350ml)',
  )
  const [customAlcoholUnits, setCustomAlcoholUnits] = React.useState<string>('')

  const [selectedTriggers, setSelectedTriggers] = React.useState<string[]>(['estresse'])
  const [freeText, setFreeText] = React.useState<string>('')
  const [whatHappenedBefore, setWhatHappenedBefore] = React.useState<string>('')
  const [consequencesText, setConsequencesText] = React.useState<string>('')

  // Fissura associada ao registro
  const [hadCravingBefore, setHadCravingBefore] = React.useState<'sim' | 'nao' | 'indiferente'>(
    'sim',
  )
  const [cravingTime, setCravingTime] = React.useState<string>('19:30')
  const [cravingDuration, setCravingDuration] = React.useState<string>('cerca de 20 min')

  // Bloco do recibo: foto OU manual
  const [receiptMode, setReceiptMode] = React.useState<'manual' | 'foto'>('manual')
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null)
  const [spentAmount, setSpentAmount] = React.useState<string>('75.00')
  const [arrivalTime, setArrivalTime] = React.useState<string>('20:00')
  const [departureTime, setDepartureTime] = React.useState<string>('23:00')
  const [itemsList, setItemsList] = React.useState<string[]>(['3 copos', 'porção de batata'])
  const [newItemInput, setNewItemInput] = React.useState<string>('')

  // Modal acolhedor após salvar
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)

  const isTobaccoSelected =
    selectedSubstance.toLowerCase().includes('cigarro') ||
    selectedSubstance.toLowerCase().includes('tabaco')

  const calculateTotalTime = (start: string, end: string) => {
    if (!start || !end) return null
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null

    let totalMinutes = h2 * 60 + m2 - (h1 * 60 + m1)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours === 0) return `${minutes} minutos`
    if (minutes === 0) return `${hours} horas`
    return `${hours}h ${minutes}min`
  }

  const totalTimeCalculated = calculateTotalTime(arrivalTime, departureTime)

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger],
    )
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemInput.trim()) {
      setItemsList((prev) => [...prev, newItemInput.trim()])
      setNewItemInput('')
    }
  }

  const handleRemoveItem = (index: number) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
      setReceiptFile(file)
    }
  }

  const isAlcoholSelected =
    selectedSubstance.toLowerCase().includes('álcool') ||
    selectedSubstance.toLowerCase().includes('alcool')

  const isDosedSubstance =
    !isTobaccoSelected &&
    !isAlcoholSelected &&
    ['cocaína', 'cocaina', 'maconha', 'md', 'lsd', 'opioides', 'calmantes', 'outras'].some((s) =>
      selectedSubstance.toLowerCase().includes(s),
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let cigCount: number | undefined
    const finalCigContext =
      cigaretteContext === 'Outro momento' && customCigaretteContext.trim()
        ? customCigaretteContext.trim()
        : cigaretteContext

    if (isTobaccoSelected) {
      const num = parseFloat(cigaretteQuantity) || 0
      cigCount = cigaretteInputMode === 'macos' ? Math.round(num * 20) : Math.round(num)

      // Também adiciona ao log individual de cigarros para métricas
      logCigaretteWithDetails({
        timestamp: episodeTime,
        context: finalCigContext || 'Outro momento',
        quantity: Math.max(1, cigCount),
        note: freeText.slice(0, 100),
      })
    }

    const finalBought =
      boughtAmount === 'outro' && customBoughtAmount.trim()
        ? customBoughtAmount.trim()
        : boughtAmount
    const finalUsed =
      substanceUsedAmount === 'outro' && customUsedAmount.trim()
        ? customUsedAmount.trim()
        : substanceUsedAmount
    const finalAlcoholUnits =
      alcoholUnitChosen === 'outro' && customAlcoholUnits.trim()
        ? customAlcoholUnits.trim()
        : alcoholUnitChosen

    const details: SubstanceDetails = {
      boughtAmount: isDosedSubstance ? finalBought : undefined,
      usedAmount: isDosedSubstance
        ? finalUsed
        : isTobaccoSelected
          ? `${cigaretteQuantity} ${cigaretteInputMode}`
          : amountUsed || finalAlcoholUnits,
      usageDuration,
      sharedWithOthers,
      alcoholType: isAlcoholSelected ? alcoholType : undefined,
      alcoholUnits: isAlcoholSelected ? finalAlcoholUnits : undefined,
    }

    const receiptData =
      receiptMode === 'manual' && spentAmount
        ? {
            spentAmount: parseFloat(spentAmount) || 0,
            arrivalTime: arrivalTime || '20:00',
            departureTime: departureTime || '23:00',
            durationMinutes: 180,
            itemsConsumed: itemsList,
          }
        : undefined

    recordHonestEpisode(
      selectedSubstance,
      cigCount,
      {
        time: episodeTime,
        amountDescription: isTobaccoSelected
          ? `${cigaretteQuantity} ${cigaretteInputMode} (${finalCigContext})`
          : isAlcoholSelected
            ? `${alcoholType} • ${finalAlcoholUnits}`
            : `${finalUsed || amountUsed || 'Uso registrado'} (${usageDuration})`,
        mood,
        triggers: selectedTriggers,
        freeText,
        whatHappenedBefore,
        whatHappenedAfter: consequencesText || 'Registrado com honestidade e calma.',
        cravingTime: hadCravingBefore === 'sim' ? cravingTime : undefined,
        receipt: receiptData,
        details,
      },
      receiptFile,
    )

    setIsSuccessModalOpen(true)
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title="Registrar Episódio"
        subtitle="Um espaço seguro. Sem culpa, apenas autoconhecimento."
      />

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6">
        {/* Banner acolhedor de abertura */}
        <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 flex items-start gap-2.5 text-xs text-[#2F4A3E] dark:text-[#8FCCAE] leading-relaxed">
          <Heart className="w-4 h-4 text-[#4CAF7D] shrink-0 mt-0.5" />
          <span>
            Registrar o que aconteceu já é uma vitória de coragem e autocuidado. Feito. Você
            escolheu você.
          </span>
        </div>

        {/* =============================================================
            1. ESPAÇO SEGURO DE ESCRITA LIVRE
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="escrita-livre"
                  className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
                >
                  O que aconteceu? Como você se sentiu?
                </label>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">opcional</span>
              </div>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Escreva à vontade, sem julgamentos. Nada do que você disser será criticado.
              </p>
            </div>

            <textarea
              id="escrita-livre"
              rows={4}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Ex.: Tive um dia puxado no trabalho e senti que merecia relaxar. Acabei me perdendo no horário..."
              className={cn(
                'w-full p-3.5 rounded-2xl text-sm leading-relaxed',
                'bg-[#FDFAF5] dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9]',
                'border border-[#E1E8E2] dark:border-[#2D3A34]',
                'focus-visible:outline-2 focus-visible:outline-[#7FBFA8] placeholder:text-[#6A7A72]/60',
              )}
            />
          </RecomecaCard>
        </section>

        {/* =============================================================
            1.1 O QUE ACONTECEU ANTES? (FISSURA, HORÁRIO E CONTEXTO)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#7FBFA8]" />
                  O que aconteceu antes do episódio?
                </span>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                  opcional • gera métricas
                </span>
              </div>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Registrar o antes nos ajuda a entender quando a onda começa a se formar.
              </p>
            </div>

            {/* Bateu fissura antes? */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Bateu fissura ou vontade forte antes de usar? (opcional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setHadCravingBefore('sim')}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-target text-center',
                    hadCravingBefore === 'sim'
                      ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                      : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                  )}
                >
                  Sim, bateu
                </button>
                <button
                  type="button"
                  onClick={() => setHadCravingBefore('nao')}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-target text-center',
                    hadCravingBefore === 'nao'
                      ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                      : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                  )}
                >
                  Não percebi
                </button>
                <button
                  type="button"
                  onClick={() => setHadCravingBefore('indiferente')}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-target text-center',
                    hadCravingBefore === 'indiferente'
                      ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                      : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                  )}
                >
                  Foi no impulso
                </button>
              </div>
            </div>

            {/* Horário da fissura / começo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center justify-between">
                  <span>Qual horário a vontade começou?</span>
                  <span className="text-[10px] font-normal">opcional</span>
                </label>
                <input
                  type="time"
                  value={cravingTime}
                  onChange={(e) => setCravingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center justify-between">
                  <span>Quanto tempo a fissura durou?</span>
                  <span className="text-[10px] font-normal">opcional</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex.: uns 15 minutos, a tarde inteira..."
                  value={cravingDuration}
                  onChange={(e) => setCravingDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>
            </div>

            {/* O que estava acontecendo antes */}
            <div className="space-y-1 pt-1">
              <label
                htmlFor="aconteceu-antes"
                className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center justify-between"
              >
                <span>O que estava acontecendo antes? (Gatilhos, ambiente, conversas)</span>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7] font-normal">
                  opcional
                </span>
              </label>
              <textarea
                id="aconteceu-antes"
                rows={2}
                value={whatHappenedBefore}
                onChange={(e) => setWhatHappenedBefore(e.target.value)}
                placeholder="Ex.: Saí de uma reunião exausto, passei perto do bar que costumava frequentar, ouvi aquela música..."
                className="w-full p-3 rounded-xl text-xs leading-relaxed bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
              />
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            2. CAMPOS: HUMOR, GATILHOS E SUBSTÂNCIA (COM SUPORTE A CIGARROS/MAÇOS)
           ============================================================= */}
        <section className="space-y-4">
          <RecomecaCard variant="default" padding="lg" className="space-y-5">
            {/* Humor */}
            <div className="space-y-1.5">
              <MoodSelector
                value={mood}
                onChange={(m) => setMood(m)}
                label="Como estava seu humor no momento?"
              />
            </div>

            {/* Substância e quantidade */}
            <div className="space-y-3 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Qual substância ou hábito esteve presente?
                </label>
                <select
                  value={selectedSubstance}
                  onChange={(e) => setSelectedSubstance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                >
                  {ONBOARDING_SUBSTANCES.map((s) => (
                    <option key={s.id} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horário do episódio */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ep-time"
                    className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                    <span>Horário do consumo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date()
                      setEpisodeTime(
                        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
                          2,
                          '0',
                        )}`,
                      )
                    }}
                    className="text-[11px] text-[#4CAF7D] font-bold hover:underline"
                  >
                    Agora
                  </button>
                </div>
                <input
                  id="ep-time"
                  type="time"
                  value={episodeTime}
                  onChange={(e) => setEpisodeTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                />
              </div>

              {/* CASO 1: REGISTRO DE TABACO / CIGARRO COM HORÁRIO E CONTEXTO ("DEPOIS DO ALMOÇO", "ANTES DO JANTAR", ETC) */}
              {isTobaccoSelected && (
                <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/50 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                      <Cigarette className="w-4 h-4 text-[#4CAF7D]" />
                      Quantidade fumada no episódio
                    </span>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      20 cig. = 1 maço
                    </span>
                  </div>

                  {/* Seletor de unidade: cigarros ou maços */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCigaretteInputMode('cigarros')}
                      className={cn(
                        'py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-target text-center',
                        cigaretteInputMode === 'cigarros'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#1C2420] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Em cigarros soltos
                    </button>
                    <button
                      type="button"
                      onClick={() => setCigaretteInputMode('macos')}
                      className={cn(
                        'py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-target text-center',
                        cigaretteInputMode === 'macos'
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#1C2420] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                      )}
                    >
                      Em maços inteiros
                    </button>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="number"
                      step={cigaretteInputMode === 'macos' ? '0.1' : '1'}
                      min="0"
                      value={cigaretteQuantity}
                      onChange={(e) => setCigaretteQuantity(e.target.value)}
                      placeholder={
                        cigaretteInputMode === 'macos' ? 'Ex.: 0.5 maço' : 'Ex.: 3 cigarros'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold tabular-nums bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                    <p className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      {cigaretteInputMode === 'cigarros'
                        ? `Equivale a ~${((parseFloat(cigaretteQuantity) || 0) / 20).toFixed(
                            1,
                          )} maço(s). Atualiza seus cigarros de hoje e da semana.`
                        : `Equivale a ~${Math.round(
                            (parseFloat(cigaretteQuantity) || 0) * 20,
                          )} cigarros soltos. Atualiza seus cigarros de hoje e da semana.`}
                    </p>
                  </div>

                  {/* Por que / contexto do cigarro */}
                  <div className="space-y-1.5 pt-2 border-t border-[#7FBFA8]/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        Por que quis fumar nesse momento? (contexto)
                      </label>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        opcional
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {CIGARETTE_CONTEXTS.map((ctx) => {
                        const isSelected = cigaretteContext === ctx
                        return (
                          <button
                            key={ctx}
                            type="button"
                            onClick={() => setCigaretteContext(ctx)}
                            className={cn(
                              'px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all touch-target truncate border',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {ctx}
                          </button>
                        )
                      })}
                    </div>

                    {cigaretteContext === 'Outro momento' && (
                      <input
                        type="text"
                        placeholder="Ex.: na varanda, esperando o ônibus..."
                        value={customCigaretteContext}
                        onChange={(e) => setCustomCigaretteContext(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] mt-1"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* CASO 2: SUBSTÂNCIAS QUE USAM QUANTIDADE / GRAMAS (COCAÍNA, MACONHA, MD, LSD, OUTRAS) */}
              {isDosedSubstance && (
                <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/50 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#4CAF7D]" />
                      Quantidade e contexto ({selectedSubstance})
                    </span>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      100% opcional • Sem julgamento
                    </span>
                  </div>

                  {/* Quanto comprou: 1g, 3g ou mais? */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        Quanto comprou? (opcional)
                      </label>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        ex: 1g, 3g ou mais
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_BOUGHT_AMOUNTS.map((amt) => {
                        const isSelected = boughtAmount === amt
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setBoughtAmount(amt)}
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all touch-target',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {amt === 'outro' ? 'Outro valor' : amt}
                          </button>
                        )
                      })}
                    </div>

                    {boughtAmount === 'outro' && (
                      <input
                        type="text"
                        placeholder="Ex.: 4g, 2 pinos, 1 pacote..."
                        value={customBoughtAmount}
                        onChange={(e) => setCustomBoughtAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] mt-1"
                      />
                    )}
                  </div>

                  {/* Quanto usou? */}
                  <div className="space-y-1.5 pt-2 border-t border-[#7FBFA8]/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                        Quanto usou desse total? (opcional)
                      </label>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        consciência sem culpa
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_USED_AMOUNTS.map((amt) => {
                        const isSelected = substanceUsedAmount === amt
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSubstanceUsedAmount(amt)}
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all touch-target',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {amt === 'outro' ? 'Outra quantidade' : amt}
                          </button>
                        )
                      })}
                    </div>

                    {substanceUsedAmount === 'outro' && (
                      <input
                        type="text"
                        placeholder="Ex.: 0,25g, metade, sobrou um pouco..."
                        value={customUsedAmount}
                        onChange={(e) => setCustomUsedAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] mt-1"
                      />
                    )}
                  </div>

                  {/* Em quanto tempo usou? (Numa noite? Numa hora?) */}
                  <div className="space-y-1.5 pt-2 border-t border-[#7FBFA8]/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                        <span>Usou isso em quanto tempo? (opcional)</span>
                      </label>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        ritmo de uso
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {USAGE_DURATIONS.map((dur) => {
                        const isSelected = usageDuration === dur
                        return (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setUsageDuration(dur)}
                            className={cn(
                              'px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all touch-target truncate border',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {dur}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Dividiu com alguém? */}
                  <div className="space-y-1.5 pt-2 border-t border-[#7FBFA8]/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#7FBFA8]" />
                        <span>Dividiu com alguém? (opcional)</span>
                      </label>
                      <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">
                        contexto social
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'sim', label: 'Sim, dividi' },
                        { id: 'nao', label: 'Não' },
                        { id: 'sozinho', label: 'Estava só' },
                        { id: 'outro', label: 'Outro' },
                      ].map((opt) => {
                        const isSelected = sharedWithOthers === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSharedWithOthers(opt.id as 'sim' | 'nao' | 'sozinho' | 'outro')
                            }
                            className={cn(
                              'py-2 px-1 rounded-xl text-xs font-bold border transition-all touch-target text-center truncate',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CASO 3: ÁLCOOL (DOSES E UNIDADES CLARAS E SIMPLES) */}
              {isAlcoholSelected && (
                <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/50 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#4CAF7D]" />
                      Tipo de bebida e doses (Álcool)
                    </span>
                    <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                      sem sugerir dose
                    </span>
                  </div>

                  {/* Tipo de bebida */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'cerveja', label: 'Cerveja/Chope' },
                      { id: 'vinho', label: 'Vinho' },
                      { id: 'destilado', label: 'Destilado' },
                      { id: 'outro', label: 'Outro' },
                    ].map((t) => {
                      const isSelected = alcoholType === t.id
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            setAlcoholType(t.id as 'cerveja' | 'vinho' | 'destilado' | 'outro')
                          }
                          className={cn(
                            'py-2 px-1 rounded-xl text-xs font-bold border transition-all touch-target text-center truncate',
                            isSelected
                              ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                              : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                          )}
                        >
                          {t.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Quantidade consumida */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                      Quantidade aproximada consumida
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ALCOHOL_UNITS_SUGGESTIONS.map((unit) => {
                        const isSelected = alcoholUnitChosen === unit
                        return (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setAlcoholUnitChosen(unit)}
                            className={cn(
                              'px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all touch-target truncate border',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {unit}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Dividiu com alguém? */}
                  <div className="space-y-1.5 pt-2 border-t border-[#7FBFA8]/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#7FBFA8]" />
                        <span>Estava acompanhado(a)? (opcional)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'sim', label: 'Em grupo / amigos' },
                        { id: 'sozinho', label: 'Sozinho(a)' },
                        { id: 'outro', label: 'Outro' },
                      ].map((opt) => {
                        const isSelected = sharedWithOthers === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSharedWithOthers(opt.id as 'sim' | 'nao' | 'sozinho' | 'outro')
                            }
                            className={cn(
                              'py-2 px-1 rounded-xl text-xs font-bold border transition-all touch-target text-center truncate',
                              isSelected
                                ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                                : 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34]',
                            )}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CASO 4: OUTRO HÁBITO (CAFÉ, REMÉDIO, AÇÚCAR) */}
              {!isTobaccoSelected && !isDosedSubstance && !isAlcoholSelected && (
                <RecomecaInput
                  label="Quantidade consumida (aproximada)"
                  placeholder="Ex.: 2 xícaras, 1 porção..."
                  value={amountUsed}
                  onChange={(e) => setAmountUsed(e.target.value)}
                  helperText="Apenas para você ter consciência do seu corpo. Nunca há julgamento."
                />
              )}
            </div>

            {/* Gatilhos */}
            <div className="space-y-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
              <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                O que acionou essa vontade? (Gatilhos)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {DEFAULT_TRIGGERS.map((trigger) => (
                  <TriggerChip
                    key={trigger}
                    label={trigger}
                    selected={selectedTriggers.includes(trigger)}
                    onToggle={() => toggleTrigger(trigger)}
                  />
                ))}
              </div>
            </div>
          </RecomecaCard>
        </section>

        {/* =============================================================
            3. BLOCO DO RECIBO (FOTO OU MANUAL COM TEMPO E GASTOS)
           ============================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1.5">
              <ReceiptText className="w-4 h-4 text-[#7FBFA8]" />
              Bloco do Recibo
            </h2>
            <span className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
              Consciência financeira e de tempo
            </span>
          </div>

          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReceiptMode('manual')}
                className={cn(
                  'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target',
                  receiptMode === 'manual'
                    ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                    : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                )}
              >
                Preencher à mão
              </button>
              <button
                type="button"
                onClick={() => setReceiptMode('foto')}
                className={cn(
                  'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-target flex items-center justify-center gap-1.5',
                  receiptMode === 'foto'
                    ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                    : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#6A7A72] dark:text-[#A0B0A7] border-[#E1E8E2] dark:border-[#2D3A34]',
                )}
              >
                <Camera className="w-3.5 h-3.5" />
                Foto da comanda/nota
              </button>
            </div>

            {receiptMode === 'foto' ? (
              <div className="space-y-3 pt-2 animate-fade-in">
                <label className="border-2 border-dashed border-[#7FBFA8]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#FDFAF5] dark:bg-[#1C2420] hover:bg-[#E8F3EC]/50 transition-colors">
                  <Camera className="w-8 h-8 text-[#7FBFA8]" />
                  <span className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Selecionar ou tirar foto do recibo
                  </span>
                  <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">
                    A imagem fica salva apenas no seu aparelho (local).
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photoPreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E1E8E2] dark:border-[#2D3A34] max-h-48">
                    <img
                      src={photoPreview}
                      alt="Prévia da foto do recibo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#7FBFA8]" />
                    Valor aproximado gasto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={spentAmount}
                    onChange={(e) => setSpentAmount(e.target.value)}
                    placeholder="Ex.: 80.00"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold tabular-nums bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Chegada</span>
                    </label>
                    <input
                      type="time"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full min-h-[42px] px-2.5 py-2 rounded-xl text-xs font-semibold bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7] flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Saída</span>
                    </label>
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full min-h-[42px] px-2.5 py-2 rounded-xl text-xs font-semibold bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                  </div>
                </div>

                {totalTimeCalculated && (
                  <div className="p-2.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-xs font-semibold text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-between tabular-nums">
                    <span>Tempo total no episódio:</span>
                    <span className="font-bold">{totalTimeCalculated}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Itens consumidos (lista rápida)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemInput}
                      onChange={(e) => setNewItemInput(e.target.value)}
                      placeholder="Ex.: 2 chopes, petisco, maço de cigarro..."
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9]"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      aria-label="Adicionar item"
                      className="px-3 rounded-xl bg-[#7FBFA8] text-white hover:bg-[#6DA98F] text-xs font-bold flex items-center justify-center touch-target"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {itemsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {itemsList.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] text-xs text-[#2F4A3E] dark:text-[#E8EFE9]"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[#D96C68] hover:opacity-80"
                            aria-label={`Remover ${item}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </RecomecaCard>
        </section>

        {/* =============================================================
            4. CAMPO: E DEPOIS, O QUE ACONTECEU? (CONSEQUÊNCIAS E APRENDIZADO)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="consequencias"
                  className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
                >
                  E depois, o que aconteceu? (Consequências e reflexão)
                </label>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">opcional</span>
              </div>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Sensações do dia seguinte, cansaço, sono, brigas ou apenas a reflexão que ficou para
                nos ajudar a criar métricas conscientes.
              </p>
            </div>

            <textarea
              id="consequencias"
              rows={3}
              value={consequencesText}
              onChange={(e) => setConsequencesText(e.target.value)}
              placeholder="Ex.: Acordei com dor de cabeça e gastei mais do que podia. Aprendi que preciso me afastar logo nos primeiros 10 minutos."
              className={cn(
                'w-full p-3.5 rounded-2xl text-sm leading-relaxed',
                'bg-[#FDFAF5] dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9]',
                'border border-[#E1E8E2] dark:border-[#2D3A34]',
                'focus-visible:outline-2 focus-visible:outline-[#7FBFA8] placeholder:text-[#6A7A72]/60',
              )}
            />
          </RecomecaCard>
        </section>

        {/* Botão Salvar */}
        <div className="pt-2">
          <RecomecaButton variant="primary" size="lg" fullWidth type="submit">
            Guardar registro com calma
          </RecomecaButton>
        </div>

        <LegalNoticeFooter />
      </form>

      {/* MODAL ACOLHEDOR PÓS-REGISTRO */}
      <ConfirmationModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title="Obrigado por registrar. Isso já é cuidado."
        description="Olhar de frente para o que aconteceu sem se culpar é o passo mais maduro da sua jornada. Sua melhor sequência continua intacta."
        confirmText="Quero trocar de hábito agora"
        cancelText="Voltar para a tela Hoje"
        icon={<CheckCircle2 className="w-6 h-6 text-[#4CAF7D]" />}
        onConfirm={() => {
          setIsSuccessModalOpen(false)
          navigate('/trocar')
        }}
        onCancel={() => {
          setIsSuccessModalOpen(false)
          navigate('/hoje')
        }}
      />
    </div>
  )
}
