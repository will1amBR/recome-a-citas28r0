import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export interface AuthContextType {
  user: RecordModel | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    email: string,
    pass: string,
    name?: string,
  ) => Promise<{ success: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [token, setToken] = useState<string | null>(pb.authStore.token)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Escuta mudanças de authStore do PocketBase
    const unsub = pb.authStore.onChange((newToken, newRecord) => {
      setToken(newToken || null)
      setUser(newRecord || null)
    })

    // Checagem inicial
    setUser(pb.authStore.record)
    setToken(pb.authStore.token)
    setIsLoading(false)

    return () => {
      unsub()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase()
      await pb.collection('users').authWithPassword(cleanEmail, pass)
      return { success: true }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error && err.message.toLowerCase().includes('failed to authenticate')
          ? 'E-mail ou senha incorretos. Tenta de novo com calma.'
          : 'Não deu agora. Tenta de novo em instantes.'
      return { success: false, error: errorMsg }
    }
  }

  const signup = async (email: string, pass: string, name?: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase()
      await pb.collection('users').create({
        email: cleanEmail,
        password: pass,
        passwordConfirm: pass,
        name: name?.trim() || '',
      })
      // Auto login após cadastro
      await pb.collection('users').authWithPassword(cleanEmail, pass)
      return { success: true }
    } catch (err: unknown) {
      const errStr = String(err)
      let msg = 'Não deu agora. Tenta de novo em instantes.'
      if (errStr.includes('already in use') || errStr.includes('validation_not_unique')) {
        msg = 'Este e-mail já está em uso. Quer fazer login?'
      } else if (errStr.includes('password') && errStr.includes('length')) {
        msg = 'A senha precisa de pelo menos 8 caracteres.'
      }
      return { success: false, error: msg }
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase()
      await pb.collection('users').requestPasswordReset(cleanEmail)
      return { success: true }
    } catch {
      // Por segurança e acolhimento, resposta neutra
      return { success: true }
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        signup,
        requestPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
