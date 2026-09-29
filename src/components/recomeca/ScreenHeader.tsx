import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  rightAction?: React.ReactNode
}

export function ScreenHeader({ title, subtitle, backHref, rightAction }: ScreenHeaderProps) {
  return (
    <header className="px-4 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 bg-[#FDFAF5]/80 dark:bg-[#1C2420]/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        {backHref && (
          <Link
            to={backHref}
            aria-label="Voltar para a página anterior"
            className="w-10 h-10 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] text-[#2F4A3E] dark:text-[#8FCCAE] flex items-center justify-center shrink-0 hover:bg-[#7FBFA8]/20 transition-colors focus-visible:outline-2 focus-visible:outline-[#7FBFA8]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[#2F4A3E] dark:text-[#E8EFE9] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7] mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </header>
  )
}

export function LegalNoticeFooter() {
  return (
    <footer className="mt-8 pt-4 pb-6 px-4 text-center border-t border-[#E1E8E2]/60 dark:border-[#2D3A34]/60 space-y-1.5">
      <p className="text-xs font-semibold text-[#6A7A72] dark:text-[#A0B0A7]">
        Este app não substitui tratamento. Em emergência, ligue 192.
      </p>
      <p className="text-[11px] text-[#6A7A72]/80 dark:text-[#A0B0A7]/80">
        Um dia de cada vez. Recomeçar faz parte. • LGPD confidencial
      </p>
    </footer>
  )
}
