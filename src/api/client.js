/**
 * API клиент на базе axios
 * Настраивает базовый URL и интерцепторы для авторизации
 */
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const AUTH_MESSAGE_KEY = 'auth_message'

const saveAuthMessage = (message) => {
  if (!message) return
  sessionStorage.setItem(AUTH_MESSAGE_KEY, message)
}

const clearAuthStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('admin_user')
}

const forceLogoutToLogin = (message) => {
  saveAuthMessage(message)
  clearAuthStorage()

  if (window.location.pathname.startsWith('/admin')) {
    window.location.href = '/admin/login'
  }
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const serverMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Сессия недействительна. Войдите снова.'

      forceLogoutToLogin(serverMessage)
    }

    return Promise.reject(error)
  }
)

export { AUTH_MESSAGE_KEY, saveAuthMessage, clearAuthStorage, forceLogoutToLogin }
export default api
