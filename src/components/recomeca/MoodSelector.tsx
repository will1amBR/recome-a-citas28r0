import * as React from 'react'
import { cn } from '@/lib/utils'

export type MoodOption = {
  id: string
  emoji: string
  label: string
  description?: string
}

export const DEFAULT_MOODS: MoodOption[] = [
  { id: 'otimo', emoji: '😊', label: 'Ótimo', description: 'Em paz e com energia' },
  { id: 'bem', emoji: '🙂', label: 'Bem', description: 'Tranquilo e focado' },
  { id: 'neutro', emoji: '😐', label: 'Neutro', description: 'Seguindo um momento por vez' },
  { id: 'dificil', emoji: '😔', label: 'Difícil', description: 'Cansado ou com vontade' },
  { id: 'crise', emoji: '😣', label: 'Com crise', description: 'Precisando de calma e apoio' },
]

export interface MoodSelectorProps {
  value?: string
  onChange?: (moodId: string) => void
  options?: MoodOption[]
  className?: string
  label?: string
  disabled?: boolean
}

/**
 * Seletor de humor acolhedor com emojis
 * Mobile-first: botões grandes, toque acessível (min 44px), sem julgamento.
 */
export function MoodSelector({
  value,
  onChange,
  options = DEFAULT_MOODS,
  className,
  label = 'Como você está se sentindo agora?',
  disabled = false,
}: MoodSelectorProps) {
  const selectedOption = options.find((opt) => opt.id === value)

  return (
    <div className={cn('w-full flex flex-col gap-2.5 text-left', className)}>
      {label && (
        <span className="text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">{label}</span>
      )}

      <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2 sm:gap-3 w-full">
        {options.map((opt) => {
          const isSelected = value === opt.id

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange?.(opt.id)}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-2xl min-h-[64px] touch-target transition-all duration-200 select-none border',
                isSelected
                  ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] shadow-[0_2px_8px_rgba(127,191,168,0.25)] scale-[1.02]'
                  : 'bg-[#F4F7F2] dark:bg-[#242E29] border-[#E1E8E2] dark:border-[#2D3A34] hover:bg-[#E8F3EC]/60 dark:hover:bg-[#2A3831]/60',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <span className="text-2xl sm:text-3xl leading-none mb-1 transition-transform duration-150">
                {opt.emoji}
              </span>
              <span
                className={cn(
                  'text-[11px] sm:text-xs font-semibold text-center truncate max-w-full',
                  isSelected
                    ? 'text-[#2F4A3E] dark:text-[#E8EFE9]'
                    : 'text-[#6A7A72] dark:text-[#A0B0A7]',
                )}
              >
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      {selectedOption?.description && (
        <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] animate-fade-in pl-1">
          {selectedOption.description}
        </p>
      )}
    </div>
  )
}
