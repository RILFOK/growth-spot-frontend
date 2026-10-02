/**
 * Панель управления — Dashboard
 *
 * Функции:
 * - Вкладки: Заявки | Настройки | Пользователи | Безопасность
 * - Real-time обновление заявок (polling каждые 30 сек)
 * - Статусы в правом нижнем углу
 * - Управление пользователями
 * - Смена пароля
 * - Уведомление о необходимости 2FA
 */
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import LeadsTable from '../../components/admin/LeadsTable'
import TwoFactorSetup from '../../components/admin/TwoFactorSetup'
import ChangePassword from '../../components/admin/ChangePassword'
import UsersManager from '../../components/admin/UsersManager'
import IPWhitelistManager from '../../components/admin/IPWhitelistManager'
import Settings from './Settings'
import { LogoIcon, LogoutIcon, UsersIcon } from '../../components/icons'
import Button from '../../components/ui/Button'
import api from '../../api/client'

const POLL_INTERVAL = 30_000 // 30 секунд

// ── Иконки ──────────────────────────────────────────────────────────────────
const SettingsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const ListIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)
const ShieldIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const UserIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const UsersTabIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const RefreshIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)
const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const WifiIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
)
const WifiOffIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
)
const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ── Плавающие статусы (правый нижний угол) ───────────────────────────────────
const FloatingStatus = ({ isOnline, isSettingsOnline, is2FAEnabled, onNavigate2FA }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {/* 2FA статус */}
      <button
        onClick={onNavigate2FA}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium shadow-lg backdrop-blur-sm transition-all hover:scale-105 ${
          is2FAEnabled
            ? 'bg-emerald-500/90 text-white'
            : 'bg-amber-500/90 text-white animate-pulse'
        }`}
      >
        <ShieldIcon className="w-4 h-4" />
        {is2FAEnabled ? '2FA вкл' : '2FA выкл'}
      </button>

      {/* API Заявок */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium shadow-lg backdrop-blur-sm ${
        isOnline
          ? 'bg-emerald-500/90 text-white'
          : 'bg-red-500/90 text-white'
      }`}>
        {isOnline ? <WifiIcon className="w-4 h-4" /> : <WifiOffIcon className="w-4 h-4" />}
        Заявки: {isOnline ? 'онлайн' : 'оффлайн'}
      </div>

      {/* API Настроек */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium shadow-lg backdrop-blur-sm ${
        isSettingsOnline
          ? 'bg-emerald-500/90 text-white'
          : 'bg-amber-500/90 text-white'
      }`}>
        <SettingsIcon className="w-4 h-4" />
        Настройки: {isSettingsOnline ? 'онлайн' : 'локально'}
      </div>
    </div>
  )
}

// ── Модальное окно 2FA предупреждения ────────────────────────────────────────
const TwoFAWarningModal = ({ onSetup, onDismiss, dismissCount }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            ⚠️ Защитите свой аккаунт!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Двухфакторная аутентификация не включена. Настоятельно рекомендуем включить 2FA через Google Authenticator для защиты вашего аккаунта.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={onSetup} className="w-full" size="lg">
              <ShieldIcon className="w-5 h-5" />
              Настроить 2FA сейчас
            </Button>
            <button
              onClick={onDismiss}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Напомнить позже {dismissCount > 0 && `(отложено ${dismissCount} раз)`}
            </button>
          </div>

          {dismissCount >= 3 && (
            <p className="mt-4 text-xs text-red-500 dark:text-red-400 font-medium">
              Вы уже {dismissCount} раз отложили настройку 2FA. Это серьёзный риск безопасности!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Главный компонент ────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading, logout, canEditSettings } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()

  const [leads,        setLeads]        = useState([])
  const [stats,        setStats]        = useState({ total: 0, new: 0, in_progress: 0, completed: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem('admin_active_tab') || 'leads'
})
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isOnline,     setIsOnline]     = useState(true)
  const [isSettingsOnline, setIsSettingsOnline] = useState(true)
  const [lastUpdate,   setLastUpdate]   = useState(null)
  const [nextUpdate,   setNextUpdate]   = useState(null)
  const [countdown,    setCountdown]    = useState(0)
  const [prevNewCount, setPrevNewCount] = useState(0)
  const [flashNew,     setFlashNew]     = useState(0)

  // 2FA Warning
  const [show2FAWarning, setShow2FAWarning] = useState(false)
  const [dismissCount, setDismissCount] = useState(0)

  const pollRef = useRef(null)

  const is2FAEnabled = user?.twoFactorEnabled === true

  // ── Проверка авторизации ──────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return
    const token = localStorage.getItem('token')
    if (!token || !user) {
      setIsAuthorized(false)
      navigate('/admin/login', { replace: true })
    } else {
      setIsAuthorized(true)
      
      // Показываем предупреждение о 2FA
      const dismissed = localStorage.getItem('2fa_warning_dismissed')
      const count = parseInt(localStorage.getItem('2fa_dismiss_count') || '0')
      setDismissCount(count)
      
      if (!is2FAEnabled && dismissed !== 'permanent') {
        setShow2FAWarning(true)
      }
    }
  }, [navigate, authLoading, is2FAEnabled, user])

  useEffect(() => {
    localStorage.setItem('admin_active_tab', activeTab)
  }, [activeTab])

  const handleTabChange = async (tabId) => {
    try {
      await api.get('/auth/me')
      setActiveTab(tabId)
    } catch (err) {
      console.error('Ошибка проверки сессии при смене вкладки:', err)
    }
  }

  // ── Обратный отсчёт ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!nextUpdate) return
    const tick = () => setCountdown(Math.max(0, Math.ceil((nextUpdate - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextUpdate])

  // ── Загрузка заявок ───────────────────────────────────────────────────────
  const fetchLeads = useCallback(async (silent = false) => {
    try {
      if (!silent) setStatsLoading(true)
      else         setRefreshing(true)

      const response = await api.get('/leads')
      const data     = response.data

      setLeads(data)

      const newCount = data.filter(l => l.status === 'new').length
      setStats({
        total:       data.length,
        new:         newCount,
        in_progress: data.filter(l => l.status === 'in_progress').length,
        completed:   data.filter(l => l.status === 'completed').length,
      })

      // Уведомление о новых заявках
      if (silent && newCount > prevNewCount) {
        setFlashNew(newCount - prevNewCount)
        setTimeout(() => setFlashNew(0), 5000)
      }
      setPrevNewCount(newCount)

      setIsOnline(true)
      setLastUpdate(new Date())
      setNextUpdate(new Date(Date.now() + POLL_INTERVAL))
    } catch (err) {
      console.warn('Ошибка загрузки заявок:', err.message)
      setIsOnline(false)
    } finally {
      setStatsLoading(false)
      setRefreshing(false)
    }
  }, [prevNewCount])

  // ── Polling ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthorized) return
    fetchLeads(false)
    pollRef.current = setInterval(() => fetchLeads(true), POLL_INTERVAL)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [isAuthorized, fetchLeads])

  // ── Online / Offline ──────────────────────────────────────────────────────
  useEffect(() => {
    const up   = () => { setIsOnline(true);  fetchLeads(true) }
    const down = () => setIsOnline(false)
    window.addEventListener('online',  up)
    window.addEventListener('offline', down)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down) }
  }, [fetchLeads])

  // ── Ручное обновление ─────────────────────────────────────────────────────
  const handleManualRefresh = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    fetchLeads(true)
    pollRef.current = setInterval(() => fetchLeads(true), POLL_INTERVAL)
  }, [fetchLeads])

  // ── Выход ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    localStorage.removeItem('admin_active_tab')
    logout()
    navigate('/admin/login', { replace: true })
  }

  // ── Callback при изменении заявки в таблице ───────────────────────────────
  const handleLeadUpdate = useCallback((updatedLead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l))
    setLeads(prev => {
      const data = prev
      setStats({
        total:       data.length,
        new:         data.filter(l => l.status === 'new').length,
        in_progress: data.filter(l => l.status === 'in_progress').length,
        completed:   data.filter(l => l.status === 'completed').length,
      })
      return data
    })
  }, [])

  const handleLeadDelete = useCallback((leadId) => {
    setLeads(prev => {
      const data = prev.filter(l => l.id !== leadId)
      setStats({
        total:       data.length,
        new:         data.filter(l => l.status === 'new').length,
        in_progress: data.filter(l => l.status === 'in_progress').length,
        completed:   data.filter(l => l.status === 'completed').length,
      })
      return data
    })
  }, [])

  // ── 2FA Warning handlers ──────────────────────────────────────────────────
  const handle2FASetup = () => {
    setShow2FAWarning(false)
    setActiveTab('security')
  }

  const handle2FADismiss = () => {
    const newCount = dismissCount + 1
    setDismissCount(newCount)
    localStorage.setItem('2fa_dismiss_count', newCount.toString())
    setShow2FAWarning(false)
  }

  // ── Загрузочный экран ─────────────────────────────────────────────────────
  if (!isAuthorized || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Загрузка...</p>
        </div>
      </div>
    )
  }

  // ── Данные пользователя ───────────────────────────────────────────────────
  const role = user?.role ?? null
  const displayName = user?.name || user?.nickname || user?.email || 'Пользователь'

  const roleBadge = {
    admin:   { label: 'Администратор', color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    moderator: { label: 'Модератор', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
    manager: { label: 'Менеджер',      color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    viewer:  { label: 'Просмотр',      color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
  }[role] ?? { label: 'Роль не определена', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' }

  // ── Вкладки ───────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'leads',    label: 'Заявки',       icon: ListIcon,     badge: stats.new > 0 ? stats.new : null },
    { id: 'settings', label: 'Настройки',    icon: SettingsIcon, badge: null },
    { id: 'users',    label: 'Пользователи', icon: UsersTabIcon, badge: null, roles: ['admin', 'moderator', 'viewer'] },
    { id: 'ip-filter', label: 'IP-фильтр', icon: ShieldIcon, badge: null, roles: ['admin'] },
    { id: 'security', label: 'Безопасность', icon: ShieldIcon,
      badge: !is2FAEnabled ? '!' : null,
      badgeColor: !is2FAEnabled ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : ''
    },
  ].filter(tab => !tab.roles || tab.roles.includes(role))

  // ── Карточки статистики ───────────────────────────────────────────────────
  const statCards = [
    { title: 'Всего заявок', value: stats.total,       color: 'from-violet-500 to-indigo-600', shadow: 'shadow-violet-500/20' },
    { title: 'Новых',        value: stats.new,          color: 'from-amber-400 to-orange-500',  shadow: 'shadow-amber-500/20'  },
    { title: 'В работе',     value: stats.in_progress,  color: 'from-blue-500 to-cyan-600',     shadow: 'shadow-blue-500/20'   },
    { title: 'Завершено',    value: stats.completed,    color: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-500/20'},
  ]

  const fmt = (d) => d?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) || '—'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

      {/* 2FA Warning Modal */}
      {show2FAWarning && (
        <TwoFAWarningModal
          onSetup={handle2FASetup}
          onDismiss={handle2FADismiss}
          dismissCount={dismissCount}
        />
      )}

      {/* Floating Status */}
      <FloatingStatus
        isOnline={isOnline}
        isSettingsOnline={isSettingsOnline}
        is2FAEnabled={is2FAEnabled}
        onNavigate2FA={() => setActiveTab('security')}
      />

      {/* ── Шапка ──────────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Логотип */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2.5 group">
                <LogoIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Точка Роста
                </span>
              </a>
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-600" />
              <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 font-medium">
                Панель управления
              </span>
            </div>

            {/* Правая часть */}
            <div className="flex items-center gap-2">
              {/* Переключатель темы */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Сменить тему"
              >
                {resolvedTheme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {/* Пользователь */}
              <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[140px] truncate">
                    {displayName}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>

              {/* Выход */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogoutIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Основной контент ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Добро пожаловать, {displayName}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {roleBadge.label}
          </p>
        </div>

        {/* Вкладки */}
        <div className="mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex gap-1 overflow-x-auto">
              {tabs.map(tab => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                    {tab.badge !== null && tab.badge !== undefined && (
                      <span className={`min-w-[24px] h-5 px-1.5 inline-flex items-center justify-center text-xs font-semibold rounded-full tabular-nums ${
                        tab.badgeColor || 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Статистика (под вкладками, только для заявок) */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="min-h-[124px] bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} shadow-md ${card.shadow} flex items-center justify-center mb-2`}>
                  <UsersIcon className="w-4 h-4 text-white" />
                </div>
                <div className="h-6 flex items-center text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {statsLoading
                    ? <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    : card.value
                  }
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{card.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Контент вкладки: Заявки ──────────────────────────────────────── */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Заголовок с таймером обновления */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Список заявок</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Управляйте заявками с сайта
                </p>
              </div>
              
              {/* Время обновления + кнопка */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Обновлено: <span className="text-slate-700 dark:text-slate-200 font-medium">{fmt(lastUpdate)}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span>
                    Следующее через: <span className="text-slate-700 dark:text-slate-200 font-medium tabular-nums">{countdown}с</span>
                  </span>
                </div>
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  <RefreshIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Обновить
                </button>
              </div>
            </div>
            
            <LeadsTable
              leads={leads}
              loading={statsLoading}
              onUpdate={handleManualRefresh}
              onLeadUpdate={handleLeadUpdate}
              onLeadDelete={handleLeadDelete}
            />
          </div>
        )}

        {/* ── Контент вкладки: Настройки ────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <Settings onApiStatusChange={setIsSettingsOnline} />
        )}

        {/* ── Контент вкладки: Пользователи ─────────────────────────────────── */}
        {activeTab === 'users' && (
          <UsersManager currentUser={user} />
        )}

        {/* ── Контент вкладки: IP-фильтр ───────────────────────────────────── */}
        {activeTab === 'ip-filter' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">IP-фильтр</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Управление доверенными IP-адресами и исключениями антиспама
              </p>
            </div>

            <IPWhitelistManager />
          </div>
        )}

        {/* ── Контент вкладки: Безопасность (2FA + Смена пароля) ───────────── */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Безопасность</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Настройки безопасности вашего аккаунта
              </p>
            </div>

            {/* Смена пароля */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Смена пароля</h3>
              <ChangePassword />
            </div>

            {/* 2FA */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Двухфакторная аутентификация</h3>
              <TwoFactorSetup />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
