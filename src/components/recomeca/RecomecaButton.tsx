import * as React from 'react'
import { cn } from '@/lib/utils'

export type RecomecaButtonVariant = 'primary' | 'secondary' | 'sos'
export type RecomecaButtonSize = 'sm' | 'md' | 'lg'

export interface RecomecaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RecomecaButtonVariant
  size?: RecomecaButtonSize
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Botões do Recomeça
 * - primary: Verde-água acolhedor (#7FBFA8)
 * - secondary: Contorno suave com superfície clara (#F4F7F2 / borda #E1E8E2)
 * - sos: Coral #E86A4C EXCLUSIVO para emergência/apoio imediato, com sombra permanente e destaque
 */
export const RecomecaButton = React.forwardRef<HTMLButtonElement, RecomecaButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold select-none transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:active:scale-100 touch-target focus-visible:outline-2 focus-visible:outline-offset-2'

    const sizeStyles: Record<RecomecaButtonSize, string> = {
      sm: 'text-sm py-2 px-3.5 rounded-xl gap-1.5 min-h-[40px]',
      md: 'text-base py-3 px-5 rounded-2xl gap-2 min-h-[48px]',
      lg: 'text-lg py-4 px-6 rounded-2xl gap-2.5 min-h-[54px]',
    }

    const variantStyles: Record<RecomecaButtonVariant, string> = {
      primary:
        'bg-[#7FBFA8] hover:bg-[#6DA98F] text-[#2F4A3E] dark:bg-[#8FCCAE] dark:hover:bg-[#A3D9C0] dark:text-[#1C2420] shadow-[0_2px_8px_rgba(47,74,62,0.08)] hover:shadow-[0_4px_12px_rgba(47,74,62,0.12)] disabled:bg-[#C4CFC8] disabled:text-[#8FA096] dark:disabled:bg-[#35433C] dark:disabled:text-[#6B7D73]',
      secondary:
        'bg-[#F4F7F2] hover:bg-[#E8F3EC] text-[#2F4A3E] border border-[#E1E8E2] dark:bg-[#242E29] dark:hover:bg-[#2A3831] dark:text-[#E8EFE9] dark:border-[#2D3A34] disabled:bg-transparent disabled:text-[#8FA096] disabled:border-[#C4CFC8] dark:disabled:text-[#6B7D73] dark:disabled:border-[#35433C]',
      sos: 'bg-[#E86A4C] hover:bg-[#D95C3F] text-white dark:bg-[#F07856] dark:hover:bg-[#FF8A6A] dark:text-white shadow-[0_8px_24px_rgba(232,106,76,0.32)] hover:shadow-[0_12px_28px_rgba(232,106,76,0.42)] font-bold tracking-wide disabled:bg-[#C4CFC8] disabled:text-[#8FA096] disabled:shadow-none',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

RecomecaButton.displayName = 'RecomecaButton'
