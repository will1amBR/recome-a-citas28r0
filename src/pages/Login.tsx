import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RecomecaCard,
  RecomecaButton,
  RecomecaInput,
  ScreenHeader,
  LegalNoticeFooter,
} from '@/components/recomeca'
import { useAuth } from '@/lib/authContext'
import { Lock, Mail, User, ArrowRight, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login, signup, requestPasswordReset, isAuthenticated, user } = useAuth()

  const [mode, setMode] = React.useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [lgpdConsent, setLgpdConsent] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  // Se já estiver logado, redireciona para /hoje
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/hoje', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.')
      return
    }

    if (mode === 'reset') {
      setLoading(true)
      await requestPasswordReset(email)
      setLoading(false)
      setSuccessMessage(
        'Se o e-mail estiver cadastrado, enviamos as instruções para você redefinir sua senha com calma.',
      )
      return
    }

    if (!password) {
      setErrorMessage('Por favor, digite sua senha.')
      return
    }

    if (mode === 'signup' && password.length < 8) {
      setErrorMessage('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (mode === 'signup' && !lgpdConsent) {
      setErrorMessage('Por favor, confirme o consentimento para proteção de seus dados de saúde.')
      return
    }

    setLoading(true)
    if (mode === 'login') {
      const res = await login(email, password)
      setLoading(false)
      if (res.success) {
        navigate('/hoje')
      } else {
        setErrorMessage(res.error || 'Não deu agora. Tenta de novo em instantes.')
      }
    } else {
      const res = await signup(email, password, name)
      setLoading(false)
      if (res.success) {
        navigate('/hoje')
      } else {
        setErrorMessage(res.error || 'Não deu agora. Tenta de novo em instantes.')
      }
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans selection:bg-[#7FBFA8]/30">
      <ScreenHeader
        title={
          mode === 'signup'
            ? 'Criar minha conta'
            : mode === 'reset'
              ? 'Recuperar acesso'
              : 'Entrar no Recomeça'
        }
        subtitle={
          mode === 'signup'
            ? 'Vamos começar. Sem pressa e no seu ritmo.'
            : mode === 'reset'
              ? 'Tudo bem esquecer a senha. A gente resolve juntos.'
              : 'Bem-vindo de volta. Um dia de cada vez.'
        }
      />

      <div className="px-4 py-4 space-y-6 max-w-[460px] mx-auto w-full">
        {/* Banner de acolhimento */}
        <div className="p-3.5 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30 flex items-start gap-2.5 text-xs text-[#2F4A3E] dark:text-[#8FCCAE] leading-relaxed">
          <Heart className="w-4 h-4 text-[#4CAF7D] shrink-0 mt-0.5" />
          <span>
            {mode === 'signup'
              ? 'Seus dados de saúde são estritamente confidenciais e protegidos pela LGPD. Cada linha é só sua.'
              : 'Seu espaço individual continua seguro. Nada da sua história é apagado.'}
          </span>
        </div>

        {/* Abas alternadas Login / Cadastro */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#E8F3EC] dark:bg-[#2A3831] border border-[#7FBFA8]/30">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                  : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]'
              }`}
            >
              Já tenho conta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all touch-target ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#1C2420] text-[#2F4A3E] dark:text-[#E8EFE9] shadow-xs'
                  : 'text-[#6A7A72] dark:text-[#A0B0A7] hover:text-[#2F4A3E]'
              }`}
            >
              Criar conta
            </button>
          </div>
        )}

        <RecomecaCard variant="default" padding="lg" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <RecomecaInput
                label="Como quer ser chamado(a)? (opcional)"
                placeholder="Ex.: Diego, Camila, Leo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-[#7FBFA8]" />}
              />
            )}

            <RecomecaInput
              label="Seu e-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4 text-[#7FBFA8]" />}
            />

            {mode !== 'reset' && (
              <div className="space-y-1">
                <RecomecaInput
                  label="Sua senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftIcon={<Lock className="w-4 h-4 text-[#7FBFA8]" />}
                />
                {mode === 'login' && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset')
                        setErrorMessage(null)
                      }}
                      className="text-xs text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div className="p-3 rounded-xl bg-[#FDFAF5] dark:bg-[#1C2420] border border-[#E1E8E2] dark:border-[#2D3A34] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={(e) => setLgpdConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#7FBFA8] focus:ring-[#7FBFA8]"
                  />
                  <span className="text-xs text-[#2F4A3E] dark:text-[#E8EFE9] leading-snug">
                    Autorizo o armazenamento dos meus registros pessoais e dados de saúde com sigilo
                    absoluto, conforme a Lei Geral de Proteção de Dados (LGPD).
                  </span>
                </label>
              </div>
            )}

            {/* Mensagem de Erro Gentil */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#FBEBEA] dark:bg-[#331C1A] text-xs font-semibold text-[#D96C68] border border-[#D96C68]/30 animate-fade-in">
                {errorMessage}
              </div>
            )}

            {/* Mensagem de Sucesso */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-[#E8F3EC] dark:bg-[#2A3831] text-xs font-semibold text-[#4CAF7D] border border-[#4CAF7D]/30 animate-fade-in">
                {successMessage}
              </div>
            )}

            <div className="pt-2">
              <RecomecaButton
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                disabled={loading}
                rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                {loading
                  ? 'Aguarde um instante...'
                  : mode === 'signup'
                    ? 'Criar conta segura'
                    : mode === 'reset'
                      ? 'Enviar link por e-mail'
                      : 'Entrar com calma'}
              </RecomecaButton>
            </div>

            {mode === 'reset' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setErrorMessage(null)
                    setSuccessMessage(null)
                  }}
                  className="text-xs font-semibold text-[#7FBFA8] dark:text-[#8FCCAE] hover:underline"
                >
                  ← Voltar para o login
                </button>
              </div>
            )}
          </form>
        </RecomecaCard>

        {/* Informação sobre demonstração */}
        <div className="text-center space-y-1">
          <p className="text-xs text-[#6A7A72] dark:text-[#A0B0A7]">
            Prefere explorar antes de criar uma conta?
          </p>
          <button
            type="button"
            onClick={() => navigate('/hoje')}
            className="text-xs font-bold text-[#4CAF7D] dark:text-[#8FCCAE] hover:underline"
          >
            Acessar demonstração com dados de exemplo →
          </button>
        </div>

        <LegalNoticeFooter />
      </div>
    </div>
  )
}
