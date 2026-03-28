/**
 * Компонент настройки Google Authenticator (2FA)
 *
 * Шаги:
 * 1. Показываем QR код и secret
 * 2. Пользователь сканирует в Google Authenticator
 * 3. Вводит код для подтверждения
 * 4. 2FA включена
 *
 * Для отключения: вводит текущий TOTP код
 */
import { useState, useEffect, useCallback } from 'react'
import QRCode from 'react-qr-code'
import { useAuth, generateTOTPSecret, verifyTOTPCode, getCurrentTOTPCode } from '../../context/AuthContext'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

// ── Иконки ──────────────────────────────────────────────────────────────────
const ShieldCheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const ShieldOffIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18" />
    <path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const CopyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const EyeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const RefreshIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

// ── TOTP таймер (обратный отсчёт 30 сек) ─────────────────────────────────────
const TOTPTimer = () => {
  const [seconds, setSeconds] = useState(30 - (Math.floor(Date.now() / 1000) % 30))

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(30 - (Math.floor(Date.now() / 1000) % 30))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pct = ((30 - seconds) / 30) * 100
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

// ── Поле ввода кода ──────────────────────────────────────────────────────────
const CodeInput = ({ value, onChange, disabled, onSubmit }) => {
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    onChange(val)
    if (val.length === 6 && onSubmit) onSubmit(val)
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="000000"
        autoComplete="one-time-code"
        className={`
          w-full text-center text-3xl font-mono font-bold tracking-[0.4em] py-4 px-6
          rounded-2xl border-2 bg-white dark:bg-slate-900
          text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
          transition-all duration-200 focus:outline-none
          ${value.length === 6
            ? 'border-violet-500 ring-4 ring-violet-500/20'
            : 'border-slate-200 dark:border-slate-700 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
      {value.length === 6 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg className="w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ── Главный компонент ─────────────────────────────────────────────────────────
const TwoFactorSetup = () => {
  const { user, enable2FA, disable2FA } = useAuth()

  const is2FAEnabled = user?.twoFactorEnabled || !!localStorage.getItem(`totp_secret_${user?.email}`)

  // ── Состояние настройки ──────────────────────────────────────────────────
  const [step,        setStep]        = useState('idle')   // idle | setup | verify | disable | done
  const [totpData,    setTotpData]    = useState(null)      // { secret, uri }
  const [code,        setCode]        = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [message,     setMessage]     = useState(null)      // { type, text }
  const [showSecret,  setShowSecret]  = useState(false)
  const [copied,      setCopied]      = useState(false)

  // Текущий TOTP код (для демонстрации в dev режиме)
  const [liveCode, setLiveCode] = useState('')

  useEffect(() => {
    if (!totpData?.secret) return
    const update = () => setLiveCode(getCurrentTOTPCode(totpData.secret) || '')
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [totpData])

  // ── Начать настройку 2FA ─────────────────────────────────────────────────
  const handleStartSetup = () => {
    const data = generateTOTPSecret(user?.email || 'admin')
    setTotpData(data)
    setCode('')
    setMessage(null)
    setStep('setup')
  }

  // ── Копировать secret ────────────────────────────────────────────────────
  const handleCopySecret = async () => {
    if (!totpData?.secret) return
    await navigator.clipboard.writeText(totpData.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Регенерировать secret ────────────────────────────────────────────────
  const handleRegenerate = () => {
    const data = generateTOTPSecret(user?.email || 'admin')
    setTotpData(data)
    setCode('')
    setMessage(null)
  }

  // ── Подтвердить и включить 2FA ────────────────────────────────────────────
  const handleEnable = useCallback(async (codeVal) => {
    const finalCode = codeVal || code
    if (finalCode.length !== 6) return

    setLoading(true)
    setMessage(null)

    const result = await enable2FA(totpData.secret, finalCode)

    if (result.success) {
      setStep('done')
      setMessage({ type: 'success', text: 'Google Authenticator успешно подключён!' })
    } else {
      setMessage({ type: 'error', text: result.error })
      setCode('')
    }
    setLoading(false)
  }, [code, totpData, enable2FA])

  // ── Отключить 2FA ─────────────────────────────────────────────────────────
  const handleDisable = useCallback(async (codeVal) => {
    const finalCode = codeVal || disableCode
    if (finalCode.length !== 6) return

    setLoading(true)
    setMessage(null)

    const result = await disable2FA(finalCode)

    if (result.success) {
      setStep('idle')
      setDisableCode('')
      setMessage({ type: 'success', text: '2FA отключена' })
    } else {
      setMessage({ type: 'error', text: result.error })
      setDisableCode('')
    }
    setLoading(false)
  }, [disableCode, disable2FA])

  // ── Рендер: 2FA уже включена ──────────────────────────────────────────────
  if (is2FAEnabled && step !== 'done') {
    return (
      <div className="space-y-6">
        {/* Статус */}
        <div className="flex items-center gap-4 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">
              Двухфакторная аутентификация включена
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
              Ваш аккаунт защищён Google Authenticator
            </p>
          </div>
          <div className="ml-auto">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
        </div>

        {message && (
          <Alert type={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {/* Отключение 2FA */}
        {step !== 'disable' ? (
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Отключить 2FA</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Для отключения двухфакторной аутентификации введите текущий код из приложения
            </p>
            <Button
              variant="danger"
              onClick={() => { setStep('disable'); setMessage(null) }}
            >
              <ShieldOffIcon className="w-4 h-4" />
              Отключить двухфакторную аутентификацию
            </Button>
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-800 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <ShieldOffIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-red-700 dark:text-red-400">Подтверждение отключения</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Введите 6-значный код из Google Authenticator
            </p>
            <div className="flex items-center gap-3 mb-2">
              <TOTPTimer />
              <span className="text-xs text-slate-500">Код обновляется каждые 30 секунд</span>
            </div>
            <CodeInput
              value={disableCode}
              onChange={setDisableCode}
              disabled={loading}
              onSubmit={handleDisable}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setStep('idle'); setDisableCode(''); setMessage(null) }}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDisable()}
                loading={loading}
                disabled={disableCode.length !== 6}
              >
                Подтвердить отключение
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Рендер: успех ─────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
          <ShieldCheckIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          2FA успешно включена!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Теперь при входе в панель управления потребуется код из Google Authenticator
        </p>
        <Button onClick={() => setStep('idle')}>
          Готово
        </Button>
      </div>
    )
  }

  // ── Рендер: настройка (шаги 1–2) ──────────────────────────────────────────
  if (step === 'setup') {
    return (
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setStep('idle'); setTotpData(null) }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Настройка Google Authenticator
          </h3>
        </div>

        {message && (
          <Alert type={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {/* Шаг 1: QR код */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Отсканируйте QR код</h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Откройте <strong className="text-slate-800 dark:text-slate-200">Google Authenticator</strong> на телефоне, 
            нажмите «+» → «Сканировать QR-код» и наведите камеру
          </p>

          {/* QR код */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm mx-auto sm:mx-0">
              {totpData?.uri && (
                <QRCode
                  value={totpData.uri}
                  size={160}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                />
              )}
            </div>

            <div className="flex-1 space-y-4">
              {/* Ручной ввод */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Или введите secret вручную:
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
                    <code className={`text-sm font-mono text-slate-700 dark:text-slate-300 break-all ${!showSecret ? 'blur-sm select-none' : ''}`}>
                      {totpData?.secret?.match(/.{1,4}/g)?.join(' ') || ''}
                    </code>
                  </div>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    title={showSecret ? 'Скрыть' : 'Показать'}
                  >
                    {showSecret ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopySecret}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 hover:text-violet-600 transition-colors"
                    title="Копировать"
                  >
                    {copied
                      ? <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      : <CopyIcon className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Регенерация */}
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <RefreshIcon className="w-4 h-4" />
                Сгенерировать новый ключ
              </button>

              {/* Live код (dev helper) */}
              {liveCode && (
                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">Текущий код (для проверки):</p>
                  <div className="flex items-center gap-3">
                    <code className="text-2xl font-mono font-bold text-violet-700 dark:text-violet-300 tracking-widest">
                      {liveCode.slice(0, 3)} {liveCode.slice(3)}
                    </code>
                    <TOTPTimer />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Шаг 2: Подтверждение */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Введите код для подтверждения</h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Введите 6-значный код из Google Authenticator для подтверждения настройки
          </p>

          <div className="flex items-center gap-3 mb-4">
            <TOTPTimer />
            <span className="text-xs text-slate-500 dark:text-slate-400">Код обновляется каждые 30 секунд</span>
          </div>

          <CodeInput
            value={code}
            onChange={setCode}
            disabled={loading}
            onSubmit={handleEnable}
          />

          <div className="mt-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleEnable()}
              loading={loading}
              disabled={code.length !== 6}
            >
              <ShieldCheckIcon className="w-5 h-5" />
              Включить двухфакторную аутентификацию
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Рендер: начальный экран ───────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {message && (
        <Alert type={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Статус: выключена */}
      <div className="flex items-center gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
          <ShieldOffIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            Двухфакторная аутентификация отключена
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
            Рекомендуем включить 2FA для защиты аккаунта
          </p>
        </div>
      </div>

      {/* Инструкция */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Как работает 2FA?</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Установите Google Authenticator на телефон (iOS / Android)' },
            { step: '2', text: 'Отсканируйте QR-код или введите ключ вручную' },
            { step: '3', text: 'При каждом входе вводите 6-значный код из приложения' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Ссылки на приложения */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://apps.apple.com/ru/app/google-authenticator/id388497605"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.31.17.67.22 1.05.11l12.34-7.13L13.8 14l-10.62 9.76zM20.43 10.5L17.2 8.63l-3.5 3.22 3.5 3.22 3.26-1.88c.93-.54.93-1.95-.03-2.69zM3.21.23C2.93.36 2.7.62 2.7.97v22.06l10.62-9.76L3.21.23z"/>
            </svg>
            Google Play
          </a>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={handleStartSetup}>
        <ShieldCheckIcon className="w-5 h-5" />
        Настроить Google Authenticator
      </Button>
    </div>
  )
}

export default TwoFactorSetup
