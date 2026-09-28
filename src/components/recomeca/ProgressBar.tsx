import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 a 100
  label?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

/**
 * Barra de progresso do Recomeça
 * Suave, cantos arredondados, verde-água acolhedor (#7FBFA8 / #4CAF7D).
 * Nunca punitiva ou estressante.
 */
export function ProgressBar({
  value,
  label,
  helperText,
  size = 'md',
  showPercentage = false,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9]">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="tabular-nums font-bold text-[#6A7A72] dark:text-[#A0B0A7] ml-auto">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'w-full bg-[#E1E8E2] dark:bg-[#2D3A34] rounded-full overflow-hidden p-0.5',
          heightStyles[size],
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-[#7FBFA8] to-[#4CAF7D] dark:from-[#8FCCAE] dark:to-[#5DBF8C] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>

      {helperText && <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">{helperText}</p>}
    </div>
  )
}
