import * as React from 'react'
import {
  isPinSet,
  verifyPin,
  isBiometricsConfigured,
  isBiometricsAvailableOnDevice,
  authenticateWithBiometrics,
} from '@/lib/securityPin'
import { RecomecaCard, RecomecaButton } from '@/components/recomeca'
import { Lock, Fingerprint, Delete, ShieldCheck, Heart } from 'lucide-react'

interface PinUnlockScreenProps {
  onUnlocked: () => void
}

export function PinUnlockScreen({ onUnlocked }: PinUnlockScreenProps) {
  const [pin, setPin] = React.useState<string>('')
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [biometricsAvailable, setBiometricsAvailable] = React.useState(false)
  const biometricsConfigured = isBiometricsConfigured()

  React.useEffect(() => {
    isBiometricsAvailableOnDevice().then((supported) => {
      setBiometricsAvailable(supported)
      // Se biometria estiver ativa e suportada, tenta abrir suavemente
      if (supported && biometricsConfigured) {
        handleBiometricPrompt()
      }
    })
  }, [biometricsConfigured])

  const handleBiometricPrompt = async () => {
    const success = await authenticateWithBiometrics()
    if (success) {
      onUnlocked()
    }
  }

  const handleDigit = (digit: string) => {
    if (pin.length >= 6) return
    const nextPin = pin + digit
    setPin(nextPin)
    setErrorMsg(null)

    // Se atingiu entre 4 e 6 dígitos, podemos testar automaticamente se bater
    if (nextPin.length >= 4) {
      if (verifyPin(nextPin)) {
        onUnlocked()
      } else if (nextPin.length === 6) {
        setErrorMsg('PIN incorreto. Tenta com calma.')
        setTimeout(() => setPin(''), 600)
      }
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setErrorMsg(null)
  }

  const handleManualCheck = () => {
    if (verifyPin(pin)) {
      onUnlocked()
    } else {
      setErrorMsg('PIN incorreto. Tenta com calma.')
      setTimeout(() => setPin(''), 600)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFAF5] dark:bg-[#1C2420] flex flex-col items-center justify-center p-4 selection:bg-[#7FBFA8]/30">
      <div className="max-w-[360px] w-full space-y-6 text-center animate-fade-in">
        {/* Ícone discreto e acolhedor */}
        <div className="w-16 h-16 rounded-full bg-[#E8F3EC] dark:bg-[#2A3831] text-[#7FBFA8] dark:text-[#8FCCAE] flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        {/* Título Neutro conforme PRP */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#2F4A3E] dark:text-[#E8EFE9]">
            Seu espaço está protegido
          </h1>
          <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
            Digite seu PIN para continuar seu acompanhamento com tranquilidade.
          </p>
        </div>

        {/* Indicadores de PIN */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const hasValue = index < pin.length
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  hasValue
                    ? 'bg-[#7FBFA8] scale-110'
                    : 'border-2 border-[#C4CFC8] dark:border-[#3D4C44] bg-transparent'
                }`}
              />
            )
          })}
        </div>

        {/* Mensagem de Erro Gentil */}
        {errorMsg && (
          <div className="text-xs font-semibold text-[#D96C68] animate-shake">{errorMsg}</div>
        )}

        {/* Teclado Numérico */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] active:scale-95 transition-all shadow-xs touch-target"
            >
              {digit}
            </button>
          ))}

          {/* Botão Biometria ou vazio */}
          {biometricsConfigured && biometricsAvailable ? (
            <button
              type="button"
              onClick={handleBiometricPrompt}
              className="h-14 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/40 text-[#4CAF7D] dark:text-[#8FCCAE] flex items-center justify-center active:scale-95 transition-all touch-target"
              title="Entrar com biometria"
            >
              <Fingerprint className="w-6 h-6" />
            </button>
          ) : (
            <div className="h-14" />
          )}

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-lg font-bold text-[#2F4A3E] dark:text-[#E8EFE9] hover:bg-[#E8F3EC] dark:hover:bg-[#2A3831] active:scale-95 transition-all shadow-xs touch-target"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Apagar dígito"
            className="h-14 rounded-2xl bg-white dark:bg-[#242E29] border border-[#E1E8E2] dark:border-[#2D3A34] text-[#6A7A72] dark:text-[#A0B0A7] flex items-center justify-center hover:bg-[#F4F7F2] active:scale-95 transition-all shadow-xs touch-target"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {pin.length >= 4 && (
          <div className="pt-2">
            <RecomecaButton variant="primary" size="md" fullWidth onClick={handleManualCheck}>
              Desbloquear
            </RecomecaButton>
          </div>
        )}

        <div className="text-[11px] text-[#6A7A72] dark:text-[#A0B0A7] pt-2">
          <span>Seus dados continuam no seu aparelho e protegidos.</span>
        </div>
      </div>
    </div>
  )
}
