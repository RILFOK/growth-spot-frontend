/**
 * Компонент смены пароля для текущего пользователя
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { forceLogoutToLogin } from '../../api/client'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

const ChangePassword = () => {
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Введите текущий пароль' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Новый пароль должен быть минимум 6 символов' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' })
      return
    }

    if (currentPassword === newPassword) {
      setMessage({ type: 'error', text: 'Новый пароль должен отличаться от текущего' })
      return
    }

    setLoading(true)

    try {
      await api.put('/users/me/password', {
        currentPassword,
        newPassword,
      })

      setMessage({
        type: 'success',
        text: 'Пароль изменён. Требуется повторный вход в аккаунт.',
      })

      setTimeout(() => {
        forceLogoutToLogin('Пароль был изменён. Требуется войти заново.')
        navigate('/admin/login', { replace: true })
      }, 1200)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Не удалось изменить пароль. Проверьте текущий пароль.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert type={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Текущий пароль"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Введите текущий пароль"
          autoComplete="current-password"
        />

        <Input
          label="Новый пароль"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Минимум 6 символов"
          autoComplete="new-password"
        />

        <Input
          label="Подтвердите новый пароль"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите новый пароль"
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Сохранение...' : 'Изменить пароль'}
        </Button>
      </form>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        После смены пароля потребуется повторный вход в аккаунт
      </p>
    </div>
  )
}

export default ChangePassword
