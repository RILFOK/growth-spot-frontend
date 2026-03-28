/**
 * Таблица заявок
 *
 * Получает leads как prop от Dashboard (который делает polling)
 * Локально меняет статус и удаляет — сразу отражает в UI, уведомляет родителя
 */
import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'
import Alert from '../ui/Alert'

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const formatSpamReason = (reason) => {
  switch (reason) {
    case 'ip_limit_reached':
      return 'Спам заявок'
    default:
      return reason || 'Спам'
  }
}

const LeadsTable = ({ leads = [], loading = false, onUpdate, onLeadUpdate, onLeadDelete }) => {
  const { canEditLeads, canDeleteLeads } = useAuth()

  const [error,         setError]         = useState('')
  const [updatingId,    setUpdatingId]    = useState(null)
  const [deletingId,    setDeletingId]    = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // ── Изменение статуса ─────────────────────────────────────────────────────
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setUpdatingId(leadId)
      await api.patch(`/leads/${leadId}`, { status: newStatus })

      // Оптимистичное обновление через коллбэк
      const lead = leads.find(l => l.id === leadId)
      if (lead && onLeadUpdate) {
        onLeadUpdate({ ...lead, status: newStatus })
      }
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Ошибка изменения статуса:', err)
      setError('Не удалось изменить статус')
      setTimeout(() => setError(''), 3000)
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Удаление ──────────────────────────────────────────────────────────────
  const handleDelete = async (leadId) => {
    try {
      setDeletingId(leadId)
      await api.delete(`/leads/${leadId}`)
      if (onLeadDelete) onLeadDelete(leadId)
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Ошибка удаления:', err)
      setError('Не удалось удалить заявку')
      setTimeout(() => setError(''), 3000)
    } finally {
      setDeletingId(null)
      setDeleteConfirm(null)
    }
  }

  // ── Стили статуса ─────────────────────────────────────────────────────────
  const getStatusBadge = (status) => ({
    new:         { bg: 'bg-amber-50 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-300',   label: 'Новая' },
    in_progress: { bg: 'bg-blue-50 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-300',     label: 'В работе' },
    completed:   { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Завершена' },
  }[status] || { bg: 'bg-slate-50', text: 'text-slate-700', label: status })

  // ── Форматирование даты ───────────────────────────────────────────────────
  const formatDate = (s) => {
    try {
      const d = new Date(s)
      if (isNaN(d)) return '—'
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return '—' }
  }

  const { activeLeads, completedLeads } = useMemo(() => {
    const sortByDateAsc = (a, b) => {
      const aTime = new Date(a.created_at).getTime() || 0
      const bTime = new Date(b.created_at).getTime() || 0
      return aTime - bTime
    }

    const sortByDateDesc = (a, b) => {
      const aTime = new Date(a.created_at).getTime() || 0
      const bTime = new Date(b.created_at).getTime() || 0
      return bTime - aTime
    }

    const statusPriority = {
      new: 0,
      in_progress: 1,
    }

    const active = leads
      .filter((lead) => lead.status !== 'completed')
      .sort((a, b) => {
        const byStatus = (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99)
        if (byStatus !== 0) return byStatus
        return sortByDateAsc(a, b)
      })
      .map((lead, index) => ({
        ...lead,
        displayNumber: index + 1,
      }))

    const completed = leads
      .filter((lead) => lead.status === 'completed')
      .sort(sortByDateDesc)
      .map((lead) => ({
        ...lead,
        displayNumber: null,
      }))

    return { activeLeads: active, completedLeads: completed }
  }, [leads])

  // ── Загрузка ──────────────────────────────────────────────────────────────
  const deleteLead = [...activeLeads, ...completedLeads].find(
    (lead) => lead.id === deleteConfirm
  )

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Загрузка заявок...</p>
      </div>
    )
  }

  // ── Пусто ─────────────────────────────────────────────────────────────────
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Заявок пока нет</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
          Когда пользователи отправят заявки через форму на сайте, они появятся здесь
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Ошибка */}
      {error && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <Alert type="error" onClose={() => setError('')}>{error}</Alert>
        </div>
      )}

      {/* Модал подтверждения удаления */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Удалить заявку?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Это действие нельзя отменить.{' '}
                {deleteLead?.displayNumber
                  ? <>Заявка #{deleteLead.displayNumber} будет удалена навсегда.</>
                  : <>Завершённая заявка будет удалена навсегда.</>
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deletingId === deleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deletingId === deleteConfirm ? 'Удаление...' : 'Удалить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
              {['№', 'Имя', 'Телефон', 'Сообщение', 'Статус', 'Дата', 'Действия'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeLeads.map(lead => {
              const status     = getStatusBadge(lead.status)
              const isUpdating = updatingId === lead.id
              const isDeleting = deletingId === lead.id

              return (
                <tr key={lead.id} className={`transition-colors ${lead.is_spam ? "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"}`}>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.displayNumber ? `#${lead.displayNumber}` : "—"}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {lead.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="text-sm text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={lead.message}>
                      {lead.message || <span className="text-slate-400 italic">—</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {canEditLeads() ? (
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value)}
                          disabled={isUpdating}
                          className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer ${status.bg} ${status.text} disabled:opacity-50`}
                        >
                          <option value="new">Новая</option>
                          <option value="in_progress">В работе</option>
                          <option value="completed">Завершена</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-medium rounded-full px-3 py-1.5 ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      )}

                      {lead.is_spam && (
                        <span
                          title={formatSpamReason(lead.spam_reason)}
                          className="text-[10px] font-semibold rounded-full px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 uppercase tracking-wide"
                        >
                          СПАМ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(lead.created_at)}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {canDeleteLeads() ? (
                      <button
                        onClick={() => setDeleteConfirm(lead.id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                        title="Удалить заявку"
                      >
                        {isDeleting
                          ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                          : <TrashIcon className="w-4 h-4" />
                        }
                      </button>
                    ) : (
                      <span className="p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed" title="Нет прав на удаление">
                        <TrashIcon className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}

            {completedLeads.length > 0 && activeLeads.length > 0 && (
              <tr>
                <td colSpan={7} className="px-5 pt-8 pb-3">
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Завершённые заявки
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {completedLeads.map(lead => {
              const status     = getStatusBadge(lead.status)
              const isUpdating = updatingId === lead.id
              const isDeleting = deletingId === lead.id

              return (
                <tr key={lead.id} className={`transition-colors ${lead.is_spam ? "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"}`}>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.displayNumber ? `#${lead.displayNumber}` : "—"}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {lead.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="text-sm text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={lead.message}>
                      {lead.message || <span className="text-slate-400 italic">—</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {canEditLeads() ? (
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value)}
                          disabled={isUpdating}
                          className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer ${status.bg} ${status.text} disabled:opacity-50`}
                        >
                          <option value="new">Новая</option>
                          <option value="in_progress">В работе</option>
                          <option value="completed">Завершена</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-medium rounded-full px-3 py-1.5 ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      )}

                      {lead.is_spam && (
                        <span
                          title={formatSpamReason(lead.spam_reason)}
                          className="text-[10px] font-semibold rounded-full px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 uppercase tracking-wide"
                        >
                          СПАМ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(lead.created_at)}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {canDeleteLeads() ? (
                      <button
                        onClick={() => setDeleteConfirm(lead.id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                        title="Удалить заявку"
                      >
                        {isDeleting
                          ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                          : <TrashIcon className="w-4 h-4" />
                        }
                      </button>
                    ) : (
                      <span className="p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed" title="Нет прав на удаление">
                        <TrashIcon className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LeadsTable
