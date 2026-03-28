/**
 * Контекст темы приложения
 * Управляет светлой/тёмной/системной темой
 * Сохраняет выбор пользователя в localStorage
 */
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Читаем сохранённую тему или используем 'system' по умолчанию
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved
    }
    return 'system'
  })

  // Реальная применённая тема ('light' или 'dark')
  const [resolvedTheme, setResolvedTheme] = useState('light')

  /**
   * Эффект применения темы
   * Добавляет/убирает класс 'dark' на html элементе
   * Следит за системными настройками если выбрано 'system'
   */
  useEffect(() => {
    const root = window.document.documentElement
    
    const applyTheme = (isDark) => {
      if (isDark) {
        root.classList.add('dark')
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        setResolvedTheme('light')
      }
    }

    if (theme === 'system') {
      // Следим за системными настройками
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)
      
      const handler = (e) => applyTheme(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      // Применяем выбранную тему напрямую
      applyTheme(theme === 'dark')
    }
  }, [theme])

  /**
   * Сохраняет тему в state и localStorage
   */
  const setThemeAndSave = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  /**
   * Переключает между светлой и тёмной темой
   */
  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setThemeAndSave(next)
  }

  /**
   * Циклически переключает: light -> dark -> system -> light
   */
  const cycleTheme = () => {
    const order = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(theme)
    const nextIndex = (currentIndex + 1) % order.length
    setThemeAndSave(order[nextIndex])
  }

  return (
    <ThemeContext.Provider value={{ 
      theme,           // Текущая настройка: 'light' | 'dark' | 'system'
      resolvedTheme,   // Реально применённая: 'light' | 'dark'
      setTheme: setThemeAndSave, 
      toggleTheme,
      cycleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Хук для использования темы в компонентах
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
