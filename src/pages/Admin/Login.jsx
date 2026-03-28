/**
 * Страница авторизации администратора
 *
 * Шаги:
 * 1. Email + Пароль → API /auth/login
 * 2. Если require2FA=true → ввод TOTP кода из Google Authenticator
 *
 * Fallback: если API недоступен — локальная проверка credentials
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { LogoIcon } from '../../components/icons'
import { AUTH_MESSAGE_KEY } from '../../api/client'

// ── TOTP таймер (кольцо обратного отсчёта) ──────────────────────────────────
const TOTPTimer = () => {
  const [seconds, setSeconds] = useState(30 - (Math.floor(Date.now() / 1000) % 30))

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(30 - (Math.floor(Date.now() / 1000) % 30))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pct   = ((30 - seconds) / 30) * 100
  const color = seconds <= 5 ? '#ef4444' : seconds <= 10 ? '#f59e0b' : '#10b981'

  return (
    <div className="flex items-center gap-2">
      <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
        <circle
          cx="12" cy="12" r="10"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={`${2 * Math.PI * 10}`}
          strokeDashoffset={`${2 * Math.PI * 10 * (1 - pct / 100)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className="text-sm font-mono font-semibold" style={{ color }}>
        {seconds}с
      </span>
    </div>
  )
}

// ── Поле ввода 6-значного TOTP кода ─────────────────────────────────────────
const CodeInput = ({ value, onChange, disabled }) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={6}
    value={value}
    onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
    disabled={disabled}
    placeholder="000000"
    autoComplete="one-time-code"
    autoFocus
    className={`
      w-full text-center text-4xl font-mono font-bold tracking-[0.5em] py-5 px-4
      rounded-2xl border-2 bg-white dark:bg-slate-900
      text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
      transition-all duration-200 focus:outline-none
      ${value.length === 6
        ? 'border-violet-500 ring-4 ring-violet-500/20'
        : 'border-slate-200 dark:border-slate-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10'
      }
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
  />
)

// ── Иконка щита ─────────────────────────────────────────────────────────────
const ShieldIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

// ── Главный компонент ────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate()
  const { login, verify2FA, cancel2FA, require2FA, loading: authLoading, pendingUser, apiAvailable } = useAuth()

  // Шаг 1: email + пароль
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  // Шаг 2: TOTP код
  const [totpCode,    setTotpCode]    = useState('')
  const [totpError,   setTotpError]   = useState('')
  const [totpLoading, setTotpLoading] = useState(false)

  useEffect(() => {
    const message = sessionStorage.getItem(AUTH_MESSAGE_KEY)
    if (message) {
      setAuthMessage(message)
      sessionStorage.removeItem(AUTH_MESSAGE_KEY)
    }
  }, [])

  // Редирект если уже залогинен
  useEffect(() => {
    if (authLoading) return
    const token = localStorage.getItem('token')
    if (token) navigate('/admin', { replace: true })
  }, [navigate, authLoading])

  // ── Шаг 1: Авторизация ────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email.trim(), password)

    if (result.success) {
      if (!result.require2FA) {
        navigate('/admin', { replace: true })
      }
      // Если require2FA=true — AuthContext уже обновил состояние, компонент перерендерится
    } else {
      setError(result.error || 'Неверный email или пароль')
    }
    setLoading(false)
  }

  // ── Шаг 2: Верификация TOTP ───────────────────────────────────────────────
  const handleVerify2FA = useCallback(async (code) => {
    const codeToVerify = code || totpCode
    if (codeToVerify.length !== 6) return
    
    setTotpError('')
    setTotpLoading(true)

    const result = await verify2FA(codeToVerify)

    if (result.success) {
      navigate('/admin', { replace: true })
    } else {
      setTotpError(result.error || 'Неверный код')
      setTotpCode('')
    }
    setTotpLoading(false)
  }, [verify2FA, navigate, totpCode])

  // Автосабмит когда введено 6 цифр
  useEffect(() => {
    if (totpCode.length === 6 && !totpLoading) {
      handleVerify2FA(totpCode)
    }
  }, [totpCode, totpLoading, handleVerify2FA])

  // ── Декорации фона ────────────────────────────────────────────────────────
  const BgDecor = () => (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 dark:bg-violet-900/30 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
    </>
  )

  // ── РЕНДЕР: Шаг 2 — Ввод TOTP ────────────────────────────────────────────
  if (require2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 relative overflow-hidden">
        <BgDecor />

        <div className="relative z-10 w-full max-w-md">
          {/* Логотип */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2.5 group">
              <LogoIcon className="w-10 h-10 transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Точка Роста
              </span>
            </a>
          </div>

          <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-white/60 dark:border-slate-700/50 p-8 sm:p-10">
            {/* Иконка */}
            <div className="text-center mb-6">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/40 items-center justify-center mb-4">
                <ShieldIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                Двухфакторная аутентификация
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Войдите как <strong className="text-slate-700 dark:text-slate-300">{pendingUser?.email}</strong>
              </p>
            </div>

            {totpError && (
              <div className="mb-5">
                <Alert type="error" onClose={() => setTotpError('')}>{totpError}</Alert>
              </div>
            )}

            <div className="space-y-5">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Введите 6-значный код из <strong className="text-slate-800 dark:text-slate-200">Google Authenticator</strong>
              </p>

              {/* Таймер */}
              <div className="flex justify-center">
                <TOTPTimer />
              </div>

              {/* Поле кода */}
              <CodeInput
                value={totpCode}
                onChange={(val) => { setTotpCode(val); setTotpError('') }}
                disabled={totpLoading}
              />

              <Button
                className="w-full"
                size="lg"
                onClick={handleVerify2FA}
                loading={totpLoading}
                disabled={totpCode.length !== 6}
              >
                Подтвердить
              </Button>

              <button
                onClick={() => {
                  cancel2FA()
                  setTotpCode('')
                  setTotpError('')
                }}
                className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                ← Вернуться к вводу пароля
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm">
            <a href="/" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium hover:underline">
              ← На главную
            </a>
          </p>
        </div>
      </div>
    )
  }

  // ── РЕНДЕР: Шаг 1 — Email + Пароль ───────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 relative overflow-hidden">
      <BgDecor />

      <div className="relative z-10 w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <LogoIcon className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Точка Роста
            </span>
          </a>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Панель управления</p>
        </div>

        <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-white/60 dark:border-slate-700/50 p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">
            Вход в админку
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">
            Введите данные для входа
          </p>

          {/* Индикатор режима API */}
          {!apiAvailable && (
            <div className="mb-5 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Локальный режим — API недоступен
            </div>
          )}

          {authMessage && (
            <div className="mb-5">
              <Alert type="error" onClose={() => setAuthMessage('')}>{authMessage}</Alert>
            </div>
          )}

          {error && (
            <div className="mb-5">
              <Alert type="error" onClose={() => setError('')}>{error}</Alert>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@site.ru"
              required
              autoComplete="email"
              autoFocus
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Проверяем...' : 'Войти'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm">
          <a href="/" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium hover:underline">
            ← Вернуться на сайт
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
