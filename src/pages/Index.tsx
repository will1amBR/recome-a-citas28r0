/**
 * Página inicial base / preview do tema Recomeça
 * Fase 1: Apenas reflete a fundação de tokens, tipografia e cores do Design System.
 * Não cria rotas ou componentes de interface adicionais.
 */
export default function Index() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center justify-center space-y-4">
        {/* Badge discreto com highlight do design system */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-highlight)] text-[var(--color-text-primary)]">
          Recomeça • Design System
        </span>

        {/* Título com escala e tom de voz do produto */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Um dia de cada vez.
        </h1>

        {/* Frase gentil e acolhedora em português real */}
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
          Recomeçar faz parte do caminho. Este espaço está sendo preparado com calma e carinho para
          apoiar você.
        </p>

        {/* Aviso de apoio e segurança */}
        <p className="text-xs text-[var(--color-text-secondary)] opacity-80 pt-4">
          Este app não substitui tratamento. Em emergência, ligue 192.
        </p>
      </div>
    </div>
  )
}
