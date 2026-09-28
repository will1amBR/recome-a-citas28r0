import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { RecomecaButton } from './RecomecaButton'
import { cn } from '@/lib/utils'

export interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  icon?: React.ReactNode
  confirmVariant?: 'primary' | 'secondary'
  isLoading?: boolean
  className?: string
}

/**
 * Modal de confirmação acolhedor do Recomeça
 * Botões grandes, linguagem gentil, cantos arredondados (radius-xl),
 * sem mensagens punitivas.
 */
export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar com calma',
  cancelText = 'Voltar',
  onConfirm,
  onCancel,
  icon,
  confirmVariant = 'primary',
  isLoading = false,
  className,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[440px] w-[calc(100%-32px)] rounded-3xl p-6 sm:p-8',
          'bg-[#FDFAF5] dark:bg-[#1C2420] border-[#E1E8E2] dark:border-[#2D3A34]',
          'text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xl',
          className,
        )}
      >
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center mb-1">
              {icon}
            </div>
          )}
          <DialogTitle className="text-xl sm:text-2xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9] leading-snug">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm sm:text-base text-[#6A7A72] dark:text-[#A0B0A7] leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-col gap-2.5 mt-6 sm:space-x-0 w-full">
          <RecomecaButton
            variant={confirmVariant}
            size="lg"
            fullWidth
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {confirmText}
          </RecomecaButton>

          <RecomecaButton
            variant="secondary"
            size="md"
            fullWidth
            disabled={isLoading}
            onClick={handleCancel}
          >
            {cancelText}
          </RecomecaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
