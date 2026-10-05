// Utilitários para gerenciamento do PIN e autenticação biométrica local
// Design system neutro: sem culpa, acolhedor, segurança suave.

const PIN_KEY = 'recomeca_security_pin'
const BIOMETRICS_KEY = 'recomeca_biometrics_enabled'
const SESSION_UNLOCKED_KEY = 'recomeca_session_unlocked'

export function isPinSet(): boolean {
  try {
    const pin = localStorage.getItem(PIN_KEY)
    return !!pin && pin.length >= 4
  } catch {
    return false
  }
}

export function savePin(pin: string): boolean {
  try {
    localStorage.setItem(PIN_KEY, pin)
    sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true')
    return true
  } catch {
    return false
  }
}

export function removePin(): boolean {
  try {
    localStorage.removeItem(PIN_KEY)
    localStorage.removeItem(BIOMETRICS_KEY)
    sessionStorage.removeItem(SESSION_UNLOCKED_KEY)
    return true
  } catch {
    return false
  }
}

export function verifyPin(input: string): boolean {
  try {
    const stored = localStorage.getItem(PIN_KEY)
    if (!stored) return true
    const ok = stored === input
    if (ok) {
      sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true')
    }
    return ok
  } catch {
    return false
  }
}

export function isSessionUnlocked(): boolean {
  try {
    if (!isPinSet()) return true
    return sessionStorage.getItem(SESSION_UNLOCKED_KEY) === 'true'
  } catch {
    return true
  }
}

export function lockSession(): void {
  try {
    sessionStorage.removeItem(SESSION_UNLOCKED_KEY)
  } catch {
    // noop
  }
}

export function isBiometricsConfigured(): boolean {
  try {
    return localStorage.getItem(BIOMETRICS_KEY) === 'true'
  } catch {
    return false
  }
}

export function setBiometricsConfigured(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(BIOMETRICS_KEY, 'true')
    } else {
      localStorage.removeItem(BIOMETRICS_KEY)
    }
  } catch {
    // noop
  }
}

export async function isBiometricsAvailableOnDevice(): Promise<boolean> {
  try {
    if (
      typeof window !== 'undefined' &&
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    }
    return false
  } catch {
    return false
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) return false
    // Desafio fictício local usando WebAuthn standard
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge)

    // Tenta obter credencial ou simular com sucesso seguro
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
      },
    })
    if (credential) {
      sessionStorage.setItem(SESSION_UNLOCKED_KEY, 'true')
      return true
    }
    return false
  } catch {
    // Se o WebAuthn falhar ou for cancelado pelo usuário
    return false
  }
}
