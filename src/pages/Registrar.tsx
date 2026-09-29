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
import { MOCK_TRACKED_HABITS, ONBOARDING_SUBSTANCES } from '@/lib/mockData'
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

export default function Registrar() {
  const navigate = useNavigate()

  // Campos básicos
  const [mood, setMood] = React.useState<string>('dificil')
  const [selectedSubstance, setSelectedSubstance] = React.useState<string>(
    MOCK_TRACKED_HABITS[0].name,
  )
  const [amountUsed, setAmountUsed] = React.useState<string>('')
  const [selectedTriggers, setSelectedTriggers] = React.useState<string[]>(['estresse'])
  const [freeText, setFreeText] = React.useState<string>('')
  const [consequencesText, setConsequencesText] = React.useState<string>('')

  // Bloco do recibo: foto OU manual
  const [receiptMode, setReceiptMode] = React.useState<'manual' | 'foto'>('manual')
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
  const [spentAmount, setSpentAmount] = React.useState<string>('75.00')
  const [arrivalTime, setArrivalTime] = React.useState<string>('20:00')
  const [departureTime, setDepartureTime] = React.useState<string>('23:00')
  const [itemsList, setItemsList] = React.useState<string[]>(['3 copos', 'porção de batata'])
  const [newItemInput, setNewItemInput] = React.useState<string>('')

  // Modal acolhedor após salvar
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)

  // Cálculo automático do tempo total gasto
  const calculateTotalTime = (start: string, end: string) => {
    if (!start || !end) return null
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null

    let totalMinutes = h2 * 60 + m2 - (h1 * 60 + m1)
    if (totalMinutes < 0) {
      // Cruzou a meia-noite
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
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
            Registrar o que aconteceu já é uma vitória de coragem. Entender o momento é a melhor
            forma de se cuidar no futuro.
          </span>
        </div>

        {/* =============================================================
            1. ESPAÇO SEGURO DE ESCRITA LIVRE
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="escrita-livre"
                className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
              >
                O que aconteceu? Como você se sentiu?
              </label>
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
            2. CAMPOS: HUMOR, GATILHOS E SUBSTÂNCIA
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

              <RecomecaInput
                label="Quantidade consumida (aproximada)"
                placeholder="Ex.: 3 latas, 2 doses, 1 maço..."
                value={amountUsed}
                onChange={(e) => setAmountUsed(e.target.value)}
                helperText="Apenas para você ter consciência do seu corpo. Nunca há julgamento."
              />
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
            {/* Alternância de Modo */}
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
                {/* Valor gasto */}
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

                {/* Horários e cálculo automático */}
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

                {/* Exibição do tempo calculado */}
                {totalTimeCalculated && (
                  <div className="p-2.5 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-xs font-semibold text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-between tabular-nums">
                    <span>Tempo total no episódio:</span>
                    <span className="font-bold">{totalTimeCalculated}</span>
                  </div>
                )}

                {/* Itens consumidos adicionáveis */}
                <div className="space-y-2 pt-2 border-t border-[#E1E8E2] dark:border-[#2D3A34]">
                  <label className="text-xs font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
                    Itens consumidos (lista rápida)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemInput}
                      onChange={(e) => setNewItemInput(e.target.value)}
                      placeholder="Ex.: 2 chopes, petisco, energético..."
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
            4. CAMPO: O QUE ACONTECEU DEPOIS? (CONSEQUÊNCIAS)
           ============================================================= */}
        <section className="space-y-2">
          <RecomecaCard variant="default" padding="lg" className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="consequencias"
                className="text-sm font-bold text-[#2F4A3E] dark:text-[#E8EFE9]"
              >
                O que aconteceu depois?
              </label>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                Sensações do dia seguinte, brigas, cansaço, atrasos ou apenas a reflexão que ficou.
              </p>
            </div>

            <textarea
              id="consequencias"
              rows={3}
              value={consequencesText}
              onChange={(e) => setConsequencesText(e.target.value)}
              placeholder="Ex.: Acordei com dor de cabeça e gastei mais do que podia. Não valeu a pena o mal-estar."
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

      {/* =============================================================
          MODAL ACOLHEDOR PÓS-REGISTRO
         ============================================================= */}
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
