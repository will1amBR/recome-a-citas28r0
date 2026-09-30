import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { RecomecaButton } from './RecomecaButton'
import { CIGARETTE_CONTEXTS } from '@/lib/mockData'
import { Cigarette, Clock, Heart, Sparkles, Check, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CigaretteQuickLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { timestamp: string; context: string; quantity: number; note?: string }) => void
  currentCount?: number
  dailyGoal?: number
}

function getFormattedNow(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function CigaretteQuickLogModal({
  open,
  onOpenChange,
  onConfirm,
  currentCount = 0,
  dailyGoal = 6,
}: CigaretteQuickLogModalProps) {
  const [timestamp, setTimestamp] = React.useState<string>(getFormattedNow())
  const [quantity, setQuantity] = React.useState<number>(1)
  const [selectedContext, setSelectedContext] = React.useState<string>('Depois do almoço')
  const [customContext, setCustomContext] = React.useState<string>('')
  const [note, setNote] = React.useState<string>('')
  const [savedFeedback, setSavedFeedback] = React.useState<{
    saved: boolean
    remaining: number
    passed: boolean
  } | null>(null)

  // Ao abrir, atualiza para o horário atual
  React.useEffect(() => {
    if (open) {
      setTimestamp(getFormattedNow())
      setQuantity(1)
      setNote('')
      setSavedFeedback(null)
    }
  }, [open])

  const handleUseNow = () => {
    setTimestamp(getFormattedNow())
  }

  const projectedTotal = currentCount + quantity
  const remainingUntilGoal = dailyGoal - projectedTotal
  const hasPassed = remainingUntilGoal < 0

  const handleSave = () => {
    const finalContext =
      selectedContext === 'Outro momento' && customContext.trim()
        ? customContext.trim()
        : selectedContext

    const finalQuantity = Math.max(1, quantity)
    const newTotal = currentCount + finalQuantity
    const newRemaining = dailyGoal - newTotal

    onConfirm({
      timestamp: timestamp || getFormattedNow(),
      context: finalContext || 'Outro momento',
      quantity: finalQuantity,
      note: note.trim() || undefined,
    })

    // Exibe o micro-reforço gentil dentro do modal antes de fechar ou dá feedback claro
    setSavedFeedback({
      saved: true,
      remaining: newRemaining,
      passed: newRemaining < 0,
    })

    // Fecha suavemente após 1.2 segundos para o usuário ver o micro-reforço
    setTimeout(() => {
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[460px] w-[calc(100%-24px)] rounded-3xl p-5 sm:p-6',
          'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34]',
          'text-[#2F4A3E] dark:text-[#E8EFE9] shadow-2xl',
          'max-h-[92vh] overflow-y-auto',
        )}
      >
        <DialogHeader className="text-left space-y-1.5 pb-2 border-b border-[#E1E8E2] dark:border-[#2D3A34]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#7FBFA8]/20 dark:bg-[#7FBFA8]/30 text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center shrink-0">
                <Cigarette className="w-5 h-5 text-[#4CAF7D]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-tight">
                  Marcar cigarro (+1)
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
                  2 toques rápidos • Tudo opcional • Sem culpa
                </DialogDescription>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE]">
              Hoje: {projectedTotal} de {dailyGoal}
            </span>
          </div>
        </DialogHeader>

        {savedFeedback?.saved ? (
          <div className="py-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-[#4CAF7D]/20 text-[#4CAF7D] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                Anotado. Isso te ajuda a conhecer seus momentos.
              </h3>
              <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] max-w-xs mx-auto">
                {savedFeedback.passed
                  ? 'passou um pouco — amanhã é outro dia'
                  : savedFeedback.remaining === 0
                    ? 'você atingiu a meta do dia com calma'
                    : `restam ${savedFeedback.remaining} ${
                        savedFeedback.remaining === 1 ? 'cigarro' : 'cigarros'
                      } até a meta do dia`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* 1. HORÁRIO DO CIGARRO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cig-time"
                  className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9] flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-[#7FBFA8]" />
                  <span>Horário do cigarro</span>
                </label>
                <button
                  type="button"
                  onClick={handleUseNow}
                  className="text-[11px] font-bold text-[#4CAF7D] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Usar agora ({getFormattedNow()})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="cig-time"
                  type="time"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-2xl text-sm font-bold tabular-nums bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
                />

                {/* Ajuste de quantidade (caso queira registrar 2 de uma vez) */}
                <div className="flex items-center gap-1 bg-white dark:bg-[#242E29] p-1 rounded-2xl border border-[#E1E8E2] dark:border-[#2D3A34] shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir quantidade"
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#E8F3EC] dark:hover:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs tabular-nums">
                    +{quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Aumentar quantidade"
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#E8F3EC] dark:hover:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] touch-target"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. POR QUE / CONTEXTO DESSE CIGARRO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                  Por que você quis fumar agora? (contexto)
                </label>
                <span className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7]">1 toque</span>
              </div>

              {/* Chips de contexto organizados por momentos comuns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {CIGARETTE_CONTEXTS.map((ctx) => {
                  const isSelected = selectedContext === ctx
                  return (
                    <button
                      key={ctx}
                      type="button"
                      onClick={() => setSelectedContext(ctx)}
                      className={cn(
                        'px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all touch-target flex items-center justify-between gap-1',
                        'border active:scale-95',
                        isSelected
                          ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-white dark:text-[#1C2420] border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#242E29] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:border-[#7FBFA8]/50',
                      )}
                    >
                      <span className="truncate">{ctx}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {selectedContext === 'Outro momento' && (
                <input
                  type="text"
                  placeholder="Qual era o momento? (ex.: no trânsito, na varanda...)"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8] mt-1"
                />
              )}
            </div>

            {/* 3. NOTA RÁPIDA (OPCIONAL) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cig-note"
                  className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]"
                >
                  Alguma observação rápida? (opcional)
                </label>
                <span className="text-[10px] text-[#6A7A72] dark:text-[#A0B0A7]">opcional</span>
              </div>
              <input
                id="cig-note"
                type="text"
                placeholder="Ex.: fumei só a metade, estava nervoso..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
              />
            </div>

            {/* Informação sobre a meta do dia e quantos restam */}
            <div className="p-3 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#4CAF7D]" />
                  Meta do dia: {dailyGoal} cigarros
                </span>
                <span className="text-[11px] font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
                  {projectedTotal} com este
                </span>
              </div>
              <p className="text-xs text-[#2F4A3E] dark:text-[#8FCCAE] font-medium">
                {hasPassed
                  ? 'passou um pouco — amanhã é outro dia'
                  : remainingUntilGoal === 0
                    ? 'você atinge a meta do dia com calma'
                    : `restam ${remainingUntilGoal} ${
                        remainingUntilGoal === 1 ? 'cigarro' : 'cigarros'
                      } até a meta do dia`}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <RecomecaButton
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSave}
                className="order-1 sm:order-2"
              >
                Confirmar registro (+{quantity})
              </RecomecaButton>
              <RecomecaButton
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => onOpenChange(false)}
                className="order-2 sm:order-1"
              >
                Cancelar
              </RecomecaButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
