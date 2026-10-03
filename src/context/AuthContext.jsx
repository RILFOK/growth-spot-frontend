import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as OTPAuth from 'otpauth'
import api from '../api/client'
import { normalizeAuthUser, hasRolePermission, isAdminUser, clearLegacyTotpSecrets } from '../utils/authSecurity'

const AuthContext = createContext(null)

export const generateTOTPSecret = (email = 'admin') => {
  const secret = new OTPAuth.Secret()
  const totp = new OTPAuth.TOTP({
    issuer: 'Точка Роста',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  })

  return {
    secret: secret.base32,
    uri: totp.toString(),
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [require2FA, setRequire2FA] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    let active = true
    const restoreSession = async () => {
      clearLegacyTotpSecrets(localStorage)
      const token = localStorage.getItem('token')
      if (!token) {
        localStorage.removeItem('admin_user')
        if (active) setLoading(false)
        return
      }

      // Never trust a role restored from browser storage without API verification.
      try {
        const response = await api.get('/auth/me')
        if (!active) return
        const confirmedUser = normalizeAuthUser(response.data)
        if (!confirmedUser) throw new Error('Некорректный ответ сервера')
        setUser(confirmedUser)
        localStorage.setItem('admin_user', JSON.stringify(confirmedUser))
      } catch {
        if (!active) return
        localStorage.removeItem('token')
        localStorage.removeItem('admin_user')
        setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    restoreSession()
    return () => { active = false }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const {
        token,
        tempToken,
        user: userData,
        require2FA: need2FA,
      } = response.data

      setApiAvailable(true)

      if (need2FA) {
        if (typeof tempToken !== 'string' || !tempToken) {
          return { success: false, error: 'Не удалось начать проверку 2FA' }
        }
        setPendingUser({ email, tempToken })
        setRequire2FA(true)
        return { success: true, require2FA: true }
      }

      const userToSave = normalizeAuthUser(userData)
      if (!userToSave || typeof token !== 'string' || !token) {
        return { success: false, error: 'Некорректный ответ сервера' }
      }

      localStorage.setItem('token', token)
      localStorage.setItem('admin_user', JSON.stringify(userToSave))
      setUser(userToSave)

      return { success: true, require2FA: false }
    } catch (err) {
      setApiAvailable(false)
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка входа',
      }
    }
  }

  const verify2FA = async (code) => {
    if (!pendingUser?.tempToken) {
      return { success: false, error: 'Сессия истекла, войдите снова' }
    }

    try {
      const response = await api.post('/auth/verify-2fa', {
        code,
        tempToken: pendingUser.tempToken,
      })

      const { token, user: userData } = response.data
      const userToSave = normalizeAuthUser(userData)
      if (!userToSave || typeof token !== 'string' || !token) {
        return { success: false, error: 'Некорректный ответ сервера' }
      }

      localStorage.setItem('token', token)
      localStorage.setItem('admin_user', JSON.stringify(userToSave))
      setUser(userToSave)
      setPendingUser(null)
      setRequire2FA(false)
      setApiAvailable(true)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка верификации',
      }
    }
  }

  const cancel2FA = () => {
    setPendingUser(null)
    setRequire2FA(false)
  }

  const enable2FA = async (secret, code) => {
    if (!user?.email) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    try {
      await api.post('/auth/enable-2fa', { secret, code })

      // TOTP secret is sent to the API for enrollment but never stored locally.

      const updatedUser = { ...user, twoFactorEnabled: true }
      localStorage.setItem('admin_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setApiAvailable(true)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Не удалось включить 2FA',
      }
    }
  }

  const disable2FA = async (code) => {
    if (!user?.email) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    try {
      await api.post('/auth/disable-2fa', { code })

      clearLegacyTotpSecrets(localStorage)

      const updatedUser = { ...user, twoFactorEnabled: false }
      localStorage.setItem('admin_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setApiAvailable(true)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Не удалось отключить 2FA',
      }
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_user')
    clearLegacyTotpSecrets(localStorage)
    setUser(null)
    setPendingUser(null)
    setRequire2FA(false)
  }, [])

  const hasPermission = useCallback((permission) =>
    hasRolePermission(user, permission), [user])

  const isAdmin = useCallback(() => isAdminUser(user), [user])
  const canEditSettings = useCallback(() => hasPermission('settings.edit'), [hasPermission])
  const canDeleteLeads = useCallback(() => hasPermission('leads.delete'), [hasPermission])
  const canEditLeads = useCallback(() => hasPermission('leads.edit'), [hasPermission])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error: null,
        isAuthenticated: !!user,
        require2FA,
        pendingUser,
        apiAvailable,
        login,
        verify2FA,
        cancel2FA,
        enable2FA,
        disable2FA,
        logout,
        hasPermission,
        isAdmin,
        canEditSettings,
        canDeleteLeads,
        canEditLeads,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
