/**
 * Контекст настроек сайта
 * Загружает публичные настройки из API и предоставляет их всему приложению
 * Используется для динамической подстановки контактов, ссылок, текстов
 */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузка настроек при монтировании
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/settings/public')
      setSettings(response.data)
      setError(null)
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err)
      setError(err)
      // Используем дефолтные значения при ошибке
      setSettings({
        site_name: 'Точка Роста',
        site_description: 'Создаю сайты, которые работают на ваш бизнес',
        phone: '+7 (999) 123-45-67',
        phone_raw: '+79991234567',
        email: 'hello@tochkarosta.ru',
        telegram_url: 'https://t.me/tochkarosta',
        telegram_label: '@tochkarosta',
        whatsapp_url: 'https://wa.me/79991234567',
        whatsapp_number: '+7 (999) 123-45-67',
        vk_url: 'https://vk.com/tochkarosta',
        vk_label: 'vk.com/tochkarosta',
        work_hours: 'Каждый день, 9:00–21:00',
        response_time: 'Обычно отвечаю в течение дня в рабочее время',
        hero_title: 'Сайт под ключ',
        hero_subtitle: '— с запуском и поддержкой',
        hero_description: 'Разрабатываю, запускаю и сопровождаю сайты для бизнеса. Вы получаете готовый проект и техническую поддержку после старта.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Функция для получения значения с fallback
  const get = (key, fallback = '') => {
    return settings[key] || fallback
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, error, get, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default SettingsContext
