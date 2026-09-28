import * as React from 'react'
import { cn } from '@/lib/utils'

export type RecomecaCardVariant = 'default' | 'highlight' | 'subtle'

export interface RecomecaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RecomecaCardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

/**
 * Card Recomeça
 * Superfície arredondada (radius-xl/16-20px), sombra suave e borda sutil.
 * Fundo claro #F4F7F2 / escuro #242E29.
 */
export const RecomecaCard = React.forwardRef<HTMLDivElement, RecomecaCardProps>(
  (
    { className, variant = 'default', padding = 'md', hoverable = false, children, ...props },
    ref,
  ) => {
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    }

    const variantStyles: Record<RecomecaCardVariant, string> = {
      default:
        'bg-[#F4F7F2] dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-[0_2px_8px_rgba(47,74,62,0.06)]',
      highlight:
        'bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 dark:border-[#8FCCAE]/30 text-[#2F4A3E] dark:text-[#E8EFE9] shadow-[0_2px_8px_rgba(47,74,62,0.06)]',
      subtle:
        'bg-[#FDFAF5]/80 dark:bg-[#1C2420]/70 border border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 text-[#2F4A3E] dark:text-[#E8EFE9]',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable &&
            'hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(47,74,62,0.1)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)] cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

RecomecaCard.displayName = 'RecomecaCard'
