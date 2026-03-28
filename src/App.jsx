/**
 * Корневой компонент приложения
 * Настраивает роутинг и провайдеры контекста:
 * - ThemeProvider: управление темой (светлая/тёмная)
 * - SettingsProvider: загрузка публичных настроек сайта из API
 * - AuthProvider: управление авторизацией и правами доступа
 */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import YandexMetrika from './components/analytics/YandexMetrika'
import Home from './pages/Home'
// Юридические страницы (в отдельной папке с общим layout)
import Privacy from './pages/Legal/Privacy'
import PrivacyFull from './pages/Legal/PrivacyFull'
import Consent from './pages/Legal/Consent'
import Terms from './pages/Legal/Terms'
import Login from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'

/**
 * Компонент-обёртка для условного подключения аналитики
 * Яндекс.Метрика подключается только на публичных страницах (не /admin/*)
 */
const AnalyticsWrapper = ({ children }) => {
  const location = useLocation()
  
  // Не подключаем метрику на страницах админки
  const isAdminPage = location.pathname.startsWith('/admin')
  
  return (
    <>
      {!isAdminPage && <YandexMetrika />}
      {children}
    </>
  )
}

function App() {
  return (
    // Провайдер темы — управляет светлой/тёмной темой
    <ThemeProvider>
      {/* Провайдер настроек — загружает контакты, ссылки, тексты из API */}
      <SettingsProvider>
        <BrowserRouter>
          {/* Провайдер авторизации — управляет сессией и правами */}
          <AuthProvider>
            <AnalyticsWrapper>
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<Home />} />
                
                {/* Юридические документы */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/privacy-full" element={<PrivacyFull />} />
                <Route path="/consent" element={<Consent />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Админ-панель (без метрики) */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<Dashboard />} />
              </Routes>
            </AnalyticsWrapper>
          </AuthProvider>
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
