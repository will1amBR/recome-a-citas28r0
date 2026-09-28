import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TriggerChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onToggle'
> {
  selected?: boolean
  label: string
  icon?: React.ReactNode
  onToggle?: (selected: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Chip de gatilho (ex.: "briga", "estresse", "tédio", "festa", "solidão", "outro")
 * Toque acessível, cantos arredondados (radius-full), sem julgamento visual.
 */
export const TriggerChip = React.forwardRef<HTMLButtonElement, TriggerChipProps>(
  (
    {
      className,
      selected = false,
      label,
      icon,
      onToggle,
      disabled,
      size = 'md',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs min-h-[32px] gap-1',
      md: 'px-3.5 py-1.5 text-xs sm:text-sm min-h-[36px] gap-1.5',
      lg: 'px-4 py-2 text-sm sm:text-base min-h-[44px] gap-2',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={selected}
        onClick={(e) => {
          props.onClick?.(e)
          onToggle?.(!selected)
        }}
        className={cn(
          'inline-flex items-center rounded-full font-semibold transition-all duration-200 select-none touch-target border',
          sizeStyles[size],
          selected
            ? 'bg-[#7FBFA8] dark:bg-[#8FCCAE] text-[#2F4A3E] dark:text-[#1C2420] border-[#6DA98F] dark:border-[#A3D9C0] shadow-sm'
            : 'bg-[#F4F7F2] dark:bg-[#242E29] text-[#2F4A3E] dark:text-[#E8EFE9] border-[#E1E8E2] dark:border-[#2D3A34] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831]',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
        <span>{label}</span>
      </button>
    )
  },
)

TriggerChip.displayName = 'TriggerChip'
