/**
 * Компонент управления пользователями
 * 
 * Функции:
 * - Список пользователей
 * - Создание нового пользователя
 * - Удаление пользователя
 * - Смена пароля (по ролям)
 * - Изменение роли (только админ)
 */
import { useState, useEffect, useCallback } from 'react'
import api from '../../api/client'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

// Иконки
const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)
const KeyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)
const UserIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const ShieldIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Роли и их иерархия (чем выше число, тем выше права)
const ROLES = {
  viewer: { level: 1, label: 'Просмотр', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
  manager: { level: 2, label: 'Менеджер', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  moderator: { level: 3, label: 'Модератор', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  admin: { level: 4, label: 'Администратор', color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
}

const ROLE_ORDER = ['admin', 'moderator', 'manager', 'viewer']

const sortUsers = (list) => {
  return [...list].sort((a, b) => {
    const roleA = ROLE_ORDER.indexOf(a.role)
    const roleB = ROLE_ORDER.indexOf(b.role)
    if (roleA !== roleB) return roleA - roleB

    const nameA = (a.name || a.nickname || a.email || '').toLowerCase()
    const nameB = (b.name || b.nickname || b.email || '').toLowerCase()
    return nameA.localeCompare(nameB, 'ru')
  })
}

const UsersManager = ({ currentUser }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Модальные окна
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(null) // userId
  const [showPasswordModal, setShowPasswordModal] = useState(null) // user object

  // Форма создания
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'manager' })
  const [creating, setCreating] = useState(false)

  // Форма смены пароля
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const currentRole = currentUser?.role || 'admin'
  const currentLevel = ROLES[currentRole]?.level || 0
  const readOnly = currentRole === 'viewer'

  // Загрузка пользователей
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(sortUsers(response.data))
      setError(null)
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err)
      setError('Не удалось загрузить список пользователей')
      // Мок-данные для локального режима
      setUsers(sortUsers([
        { id: 1, email: 'admin@site.ru', name: 'Администратор', role: 'admin', twoFactorEnabled: true },
        { id: 2, email: 'manager@site.ru', name: 'Менеджер', role: 'manager', twoFactorEnabled: false },
      ]))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Может ли текущий пользователь управлять целевым
  const canManageUser = (targetUser) => {
    if (currentUser?.id === targetUser.id) return false // Нельзя управлять собой
    const targetLevel = ROLES[targetUser.role]?.level || 0
    return currentLevel > targetLevel
  }

  // Может ли менять пароль
  const canChangePassword = (targetUser) => {
    if (currentRole === 'admin') return true
    if (currentRole === 'moderator') {
      const targetLevel = ROLES[targetUser.role]?.level || 0
      return targetLevel < ROLES.moderator.level
    }
    return false
  }

  // Создание пользователя
  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!newUser.email || !newUser.password) {
      setMessage({ type: 'error', text: 'Email и пароль обязательны' })
      return
    }

    setCreating(true)
    try {
      await api.post('/users', newUser)
      setMessage({ type: 'success', text: 'Пользователь создан' })
      setNewUser({ email: '', password: '', name: '', role: 'manager' })
      setShowCreateModal(false)
      fetchUsers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Ошибка создания пользователя' })
    } finally {
      setCreating(false)
    }
  }

  // Удаление пользователя
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`)
      setMessage({ type: 'success', text: 'Пользователь удалён' })
      setShowDeleteModal(null)
      fetchUsers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Ошибка удаления' })
    }
  }

  // Смена пароля пользователю
  const handleChangeUserPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть минимум 6 символов' })
      return
    }

    setChangingPassword(true)
    try {
      await api.put(`/users/${showPasswordModal.id}/password`, { newPassword })
      setMessage({ type: 'success', text: `Пароль пользователя ${showPasswordModal.email} изменён` })
      setShowPasswordModal(null)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Ошибка смены пароля' })
    } finally {
      setChangingPassword(false)
    }
  }

  // Изменение роли
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole })

      setUsers(prev =>
        sortUsers(prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ))
      )

      setMessage({ type: 'success', text: 'Роль изменена' })
      fetchUsers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Ошибка изменения роли' })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Загрузка пользователей...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Пользователи</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Управление пользователями системы</p>
        </div>
        {!readOnly && (
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Добавить
          </Button>
        )}
      </div>

      {/* Сообщения */}
      {message && (
        <div className="mb-4">
          <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert type="warning">{error}</Alert>
        </div>
      )}

      {/* Список пользователей */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">2FA</th>
                {!readOnly && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Действия</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map(user => {
                const roleInfo = ROLES[user.role] || ROLES.viewer
                const isCurrentUser = currentUser?.id === user.id
                const canManage = canManageUser(user)
                const canChangePass = canChangePassword(user)

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.name || user.nickname || 'Без имени'}
                            {isCurrentUser && <span className="ml-2 text-xs text-violet-600 dark:text-violet-400">(Вы)</span>}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {currentRole === 'admin' && !isCurrentUser && !readOnly ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer ${roleInfo.color}`}
                        >
                          {ROLE_ORDER.map((key) => (
                            <option key={key} value={key}>{ROLES[key].label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs font-medium rounded-full px-3 py-1 ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${
                        user.twoFactorEnabled
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        <ShieldIcon className="w-3.5 h-3.5" />
                        {user.twoFactorEnabled ? 'Включена' : 'Выключена'}
                      </span>
                    </td>
                    {!readOnly && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {canChangePass && (
                            <button
                              onClick={() => setShowPasswordModal(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                              title="Сменить пароль"
                            >
                              <KeyIcon className="w-4 h-4" />
                            </button>
                          )}
                          {canManage && (
                            <button
                              onClick={() => setShowDeleteModal(user.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Удалить"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                          {!canManage && !canChangePass && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модал создания пользователя */}
      {!readOnly && showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Новый пользователь</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input
                label="Имя/Никнейм"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Иван Иванов"
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                required
              />
              <Input
                label="Пароль"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Минимум 6 символов"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Роль</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {ROLE_ORDER
                    .filter((key) => ROLES[key].level < currentLevel)
                    .map((key) => (
                      <option key={key} value={key}>{ROLES[key].label}</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" loading={creating} className="flex-1">
                  Создать
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модал удаления */}
      {!readOnly && showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Удалить пользователя?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Это действие нельзя отменить.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(null)} className="flex-1">
                  Отмена
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(showDeleteModal)} className="flex-1">
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модал смены пароля */}
      {!readOnly && showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Сменить пароль
              </h3>
              <button onClick={() => { setShowPasswordModal(null); setNewPassword(''); setConfirmPassword('') }} className="p-1 text-slate-400 hover:text-slate-600">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Пользователь: <strong className="text-slate-700 dark:text-slate-200">{showPasswordModal.email}</strong>
            </p>
            <form onSubmit={handleChangeUserPassword} className="space-y-4">
              <Input
                label="Новый пароль"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
              />
              <Input
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
              />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowPasswordModal(null); setNewPassword(''); setConfirmPassword('') }} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" loading={changingPassword} className="flex-1">
                  Сменить пароль
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManager
