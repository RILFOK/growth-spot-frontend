/**
 * Страница настроек сайта в админке
 * 
 * Компактный вид: 2 колонки
 * Textarea для описания Hero
 */
import { useState, useEffect, useCallback } from 'react'
import api from '../../api/client'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'

// SVG-иконки секций
const DocumentIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
)

const PhoneIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.48-1.24a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MessageIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ClockIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 16 14" />
  </svg>
)

const TargetIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const ChartIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)


// Дефолтные значения настроек
const DEFAULT_SETTINGS = {
  site_name: 'Точка Роста',
  site_description: 'Создаю сайты, которые работают на ваш бизнес',
  phone: '+7 (996) 765-12-68',
  phone_raw: '+79967651268',
  email: 'oleg.varfolomeev.00@bk.ru',
  telegram_url: 'https://t.me/tochkarosta',
  telegram_label: '@tochkarosta',
  whatsapp_url: 'https://wa.me/79967651268',
  whatsapp_number: '+7 (996) 765-12-68',
  vk_url: 'https://vk.com/tochkarosta',
  vk_label: 'vk.com/tochkarosta',
  work_hours: 'Каждый день, 9:00–21:00',
  response_time: 'Обычно отвечаю в течение дня в рабочее время',
  hero_title: 'Сайт под ключ',
  hero_subtitle: '— с запуском и поддержкой',
  hero_description: 'Разрабатываю, запускаю и сопровождаю сайты для бизнеса. Вы получаете готовый проект и техническую поддержку после старта.',
  yandex_metrika_id: '108251909',
  google_analytics_id: '',
  yandex_verification: 'c343fac8f0bb8c8e',
  google_verification: '',
}

const STORAGE_KEY = 'site_settings_local'

const Settings = ({ onSaved, onApiStatusChange }) => {
  const { refresh: refreshSettings } = useSettings()
  const { canEditSettings } = useAuth()
  const readOnly = !canEditSettings()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  // Сообщаем родителю о статусе API
  useEffect(() => {
    if (onApiStatusChange) {
      onApiStatusChange(apiAvailable)
    }
  }, [apiAvailable, onApiStatusChange])

  /**
   * Загрузка настроек: сначала API, потом localStorage, потом defaults
   */
  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/settings')
      const obj = {}
      if (Array.isArray(response.data)) {
        response.data.forEach(item => { obj[item.key] = item.value })
      } else {
        Object.assign(obj, response.data)
      }
      const merged = { ...DEFAULT_SETTINGS, ...obj }
      setSettings(merged)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      setApiAvailable(true)
    } catch {
      console.warn('API настроек недоступен, загружаем из localStorage')
      setApiAvailable(false)
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
        } catch {
          setSettings(DEFAULT_SETTINGS)
        }
      } else {
        setSettings(DEFAULT_SETTINGS)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  /**
   * Сохранение: пробуем API, при ошибке — только localStorage
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (readOnly) return
    setSaving(true)
    setMessage(null)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

    try {
      await api.put('/settings', settings)
      setMessage({ type: 'success', text: '✅ Настройки сохранены!' })
      setApiAvailable(true)
    } catch {
      setMessage({ type: 'warning', text: '💾 Сохранено локально. API недоступен.' })
      setApiAvailable(false)
    }

    try { await refreshSettings() } catch { /* ignore */ }

    setHasChanges(false)
    if (onSaved) onSaved()

    setTimeout(() => setMessage(null), 5000)
    setSaving(false)
  }

  const handleReset = () => {
    if (readOnly) return
    setSettings(DEFAULT_SETTINGS)
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Загрузка настроек...</p>
      </div>
    )
  }

  // Секции с 2 колонками
  const sections = [
    {
      title: 'Основная информация',
      icon: <DocumentIcon />,
      columns: 2,
      fields: [
        { key: 'site_name',        label: 'Название сайта',  placeholder: 'Точка Роста' },
        { key: 'site_description', label: 'Описание сайта',  placeholder: 'Создаю сайты...' },
      ]
    },
    {
      title: 'Контакты',
      icon: <PhoneIcon />,
      columns: 2,
      fields: [
        { key: 'phone',     label: 'Телефон (форматированный)',    placeholder: '+7 (996) 765-12-68' },
        { key: 'phone_raw', label: 'Телефон (для href tel:)',       placeholder: '+79967651268' },
        { key: 'email',     label: 'Email',                        placeholder: 'email@example.com', type: 'email', fullWidth: true },
      ]
    },
    {
      title: 'Мессенджеры',
      icon: <MessageIcon />,
      columns: 2,
      fields: [
        { key: 'telegram_url',   label: 'Telegram URL',      placeholder: 'https://t.me/username' },
        { key: 'telegram_label', label: 'Telegram @',        placeholder: '@username' },
        { key: 'whatsapp_url',    label: 'WhatsApp URL',     placeholder: 'https://wa.me/79001234567' },
        { key: 'whatsapp_number', label: 'WhatsApp номер',   placeholder: '+7 (900) 123-45-67' },
        { key: 'vk_url',   label: 'VK URL',       placeholder: 'https://vk.com/username' },
        { key: 'vk_label', label: 'VK отображение',   placeholder: 'vk.com/username' },
      ]
    },
    {
      title: 'График работы',
      icon: <ClockIcon />,
      columns: 2,
      fields: [
        { key: 'work_hours',    label: 'График работы', placeholder: 'Каждый день, 9:00–21:00' },
        { key: 'response_time', label: 'Время ответа',  placeholder: 'Обычно отвечаю в течение дня' },
      ]
    },
    {
      title: 'Hero-секция',
      icon: <TargetIcon />,
      columns: 2,
      fields: [
        { key: 'hero_title',       label: 'Заголовок',    placeholder: 'Сайт под ключ' },
        { key: 'hero_subtitle',    label: 'Подзаголовок', placeholder: '— с запуском и поддержкой' },
        { key: 'hero_description', label: 'Описание',     placeholder: 'Разрабатываю, запускаю...', textarea: true, rows: 4, fullWidth: true },
      ]
    },
    {
      title: 'Аналитика и верификация',
      icon: <ChartIcon />,
      columns: 2,
      fields: [
        { key: 'yandex_metrika_id',   label: 'ID Яндекс.Метрики',     placeholder: '108251909' },
        { key: 'google_analytics_id', label: 'ID Google Analytics',  placeholder: 'G-XXXXXXXXXX' },
        { key: 'yandex_verification', label: 'Верификация Яндекс',   placeholder: 'c343fac8f0bb8c8e' },
        { key: 'google_verification', label: 'Верификация Google',   placeholder: 'XXXXXXXXXXXX' },
      ]
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Настройки сайта
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Изменения применяются на сайте в реальном времени
          </p>
        </div>
      </div>

      {/* Уведомление */}
      {message && (
        <div className="mb-4">
          <Alert type={message.type === 'warning' ? 'warning' : message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-violet-600 dark:text-violet-400">{section.icon}</span>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{section.title}</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className={`p-4 grid gap-4 ${section.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
                {section.fields.map(field => (
                  <div key={field.key} className={field.fullWidth ? 'sm:col-span-2' : ''}>
                    {field.textarea ? (
                      <Textarea
                        label={field.label}
                        value={settings[field.key] ?? ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        disabled={readOnly}
                      />
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type || 'text'}
                        value={settings[field.key] ?? ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        disabled={readOnly}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Панель сохранения */}
        {!readOnly && (
          <div className={`sticky bottom-4 rounded-xl border shadow-lg p-3 transition-all ${
          hasChanges
            ? 'bg-white dark:bg-slate-800 border-violet-200 dark:border-violet-700'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {hasChanges ? (
                <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Есть изменения
                </span>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Все сохранено
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Сбросить
              </button>
              <Button type="submit" loading={saving} size="sm">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      )}
      </form>
    </div>
  )
}

export default Settings
