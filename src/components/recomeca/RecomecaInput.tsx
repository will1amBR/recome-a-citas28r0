import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RecomecaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Campo de texto do Recomeça
 * Labels simples e gentis, bordas arredondadas (radius-md 12px),
 * estados de foco visível suave (#6DA98F) e erro acolhedor (#D96C68).
 */
export const RecomecaInput = React.forwardRef<HTMLInputElement, RecomecaInputProps>(
  (
    { className, label, helperText, errorMessage, id, disabled, leftIcon, rightIcon, ...props },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const hasError = Boolean(errorMessage)

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[#2F4A3E] dark:text-[#E8EFE9] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#6A7A72] dark:text-[#A0B0A7] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full min-h-[46px] rounded-xl px-4 py-2.5 text-base transition-all duration-200',
              'bg-[#F4F7F2] dark:bg-[#242E29]',
              'text-[#2F4A3E] dark:text-[#E8EFE9]',
              'placeholder:text-[#6A7A72]/70 dark:placeholder:text-[#A0B0A7]/70',
              'border',
              hasError
                ? 'border-[#D96C68] dark:border-[#E57D7A] focus:border-[#D96C68] focus:ring-2 focus:ring-[#D96C68]/20'
                : 'border-[#E1E8E2] dark:border-[#2D3A34] focus:border-[#6DA98F] focus:ring-2 focus:ring-[#7FBFA8]/25',
              'outline-none',
              'disabled:bg-[#C4CFC8]/40 disabled:text-[#8FA096] disabled:border-[#C4CFC8]/60 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 text-[#6A7A72] dark:text-[#A0B0A7] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {hasError ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-semibold text-[#D96C68] dark:text-[#E57D7A] animate-fade-in"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)

RecomecaInput.displayName = 'RecomecaInput'
