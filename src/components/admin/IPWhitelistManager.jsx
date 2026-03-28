import { useEffect, useState } from 'react'
import api from '../../api/client'
import Alert from '../ui/Alert'
import { Input } from '../ui/Input'
import Button from '../ui/Button'

const formatBlockedReason = (reason) => {
  switch (reason) {
    case 'ip_limit_reached':
      return 'Спам заявок'
    default:
      return reason || 'Не указана'
  }
}

const IPWhitelistManager = () => {
  const [myIp, setMyIp] = useState('')
  const [myIpWhitelisted, setMyIpWhitelisted] = useState(false)
  const [entries, setEntries] = useState([])
  const [blockedIps, setBlockedIps] = useState([])
  const [ipAddress, setIpAddress] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [disablingId, setDisablingId] = useState(null)
  const [unblockingId, setUnblockingId] = useState(null)
  const [message, setMessage] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [ipInfoRes, whitelistRes, blockedRes] = await Promise.all([
        api.get('/ip-info'),
        api.get('/ip-whitelist'),
        api.get('/blocked-ips'),
      ])

      setMyIp(ipInfoRes.data?.ip || '')
      setMyIpWhitelisted(Boolean(ipInfoRes.data?.whitelisted))
      setEntries(Array.isArray(whitelistRes.data) ? whitelistRes.data : [])
      setBlockedIps(Array.isArray(blockedRes.data) ? blockedRes.data : [])
    } catch (err) {
      console.error('Ошибка загрузки IP-данных:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Не удалось загрузить IP-настройки',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!ipAddress.trim()) {
      setMessage({ type: 'error', text: 'Укажите IP адрес' })
      return
    }

    setSaving(true)
    try {
      await api.post('/ip-whitelist', {
        ip_address: ipAddress.trim(),
        comment: comment.trim() || null,
      })

      setMessage({ type: 'success', text: 'IP добавлен в исключения' })
      setIpAddress('')
      setComment('')
      await loadData()
    } catch (err) {
      console.error('Ошибка добавления IP:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Не удалось добавить IP в исключения',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDisable = async (id) => {
    setMessage(null)
    setDisablingId(id)

    try {
      await api.post(`/ip-whitelist/${id}/disable`)
      setMessage({ type: 'success', text: 'Исключение удалено' })
      await loadData()
    } catch (err) {
      console.error('Ошибка удаления исключения:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Не удалось удалить исключение',
      })
    } finally {
      setDisablingId(null)
    }
  }

  const handleUnblock = async (id) => {
    setMessage(null)
    setUnblockingId(id)

    try {
      const response = await api.post(`/blocked-ips/${id}/unblock`)
      setMessage({
        type: 'success',
        text: response.data?.message || 'IP разблокирован',
      })
      await loadData()
    } catch (err) {
      console.error('Ошибка разблокировки IP:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Не удалось разблокировать IP',
      })
    } finally {
      setUnblockingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert type={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ваш текущий IP</h3>

        {loading ? (
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm">
              {myIp || 'Не удалось определить'}
            </div>

            {myIpWhitelisted ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                В исключениях
              </span>
            ) : (
              <button
                onClick={() => {
                  setIpAddress(myIp || '')
                  setComment('Мой текущий IP')
                }}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Добавить мой IP в исключения
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Добавить IP в исключения</h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="IP адрес"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Например: 123.123.123.123"
          />

          <Input
            label="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: офис, мой ноутбук, тестовый IP"
          />

          <Button type="submit" loading={saving}>
            {saving ? 'Сохраняем...' : 'Добавить в исключения'}
          </Button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Список исключений</h3>

        {loading ? (
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Исключений пока нет
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                      {entry.ip_address}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 uppercase">
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {entry.comment || 'Без комментария'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDisable(entry.id)}
                    disabled={disablingId === entry.id}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {disablingId === entry.id ? 'Удаляем...' : 'Удалить'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Заблокированные IP</h3>

        {loading ? (
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        ) : blockedIps.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Заблокированных IP пока нет
          </p>
        ) : (
          <div className="space-y-3">
            {blockedIps.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/60 dark:bg-red-900/10"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                      {entry.ip_address}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 uppercase">
                      Blocked
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Причина: {formatBlockedReason(entry.reason)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUnblock(entry.id)}
                    disabled={unblockingId === entry.id}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {unblockingId === entry.id ? 'Разблокируем...' : 'Разблокировать'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IPWhitelistManager
