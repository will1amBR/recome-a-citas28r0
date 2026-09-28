import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MilestoneBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number
  label?: string
  achieved?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Badge de marco de dias (21, 30, 60, 90...)
 * Realça conquistas sem ostentação tóxica, reforçando: "esse progresso é seu".
 */
export function MilestoneBadge({
  days,
  label,
  achieved = true,
  size = 'md',
  className,
  ...props
}: MilestoneBadgeProps) {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const numberSize = {
    sm: 'text-xs font-bold',
    md: 'text-sm font-bold',
    lg: 'text-base font-bold',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-semibold border transition-all duration-200 select-none',
        sizeStyles[size],
        achieved
          ? 'bg-[#E8F3EC] dark:bg-[#2A3831] border-[#7FBFA8] dark:border-[#8FCCAE] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-sm'
          : 'bg-[#F4F7F2]/60 dark:bg-[#242E29]/60 border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] opacity-75',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#4CAF7D] dark:bg-[#5DBF8C]" />
      <span className={cn('tabular-nums tracking-tight', numberSize[size])}>
        {days} {days === 1 ? 'dia' : 'dias'}
      </span>
      {label && <span className="text-xs font-normal opacity-85 ml-0.5">• {label}</span>}
    </div>
  )
}
