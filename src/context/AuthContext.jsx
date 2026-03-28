import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as OTPAuth from 'otpauth'
import api from '../api/client'

const AuthContext = createContext(null)

const ROLE_PERMISSIONS = {
  admin: ['settings.edit', 'leads.delete', 'leads.edit'],
  moderator: ['leads.delete', 'leads.edit'],
  manager: ['leads.edit'],
  viewer: [],
}

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

export const verifyTOTPCode = (secret, code) => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'Точка Роста',
      label: 'admin',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, '').toUpperCase()),
    })

    const delta = totp.validate({
      token: code.replace(/\s/g, ''),
      window: 1,
    })

    return delta !== null
  } catch {
    return false
  }
}

export const getCurrentTOTPCode = (secret) => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'Точка Роста',
      label: 'admin',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, '').toUpperCase()),
    })

    return totp.generate()
  } catch {
    return ''
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [require2FA, setRequire2FA] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('admin_user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('admin_user')
      }
    }

    setLoading(false)
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
        setPendingUser({ ...userData, email, tempToken: tempToken || token })
        setRequire2FA(true)
        return { success: true, require2FA: true }
      }

      const userToSave = userData || { email, role: 'admin', name: 'Администратор' }

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
      const userToSave = userData || { ...pendingUser, twoFactorEnabled: true }
      delete userToSave.tempToken

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

      localStorage.setItem(`totp_secret_${user.email}`, secret)

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

      localStorage.removeItem(`totp_secret_${user.email}`)

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
    setUser(null)
    setPendingUser(null)
    setRequire2FA(false)
  }, [])

  const hasPermission = useCallback((permission) => {
    if (!user) return false
    const role = user.role || 'admin'
    return (ROLE_PERMISSIONS[role] || []).includes(permission)
  }, [user])

  const isAdmin = useCallback(() => (user?.role || 'admin') === 'admin', [user])
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
