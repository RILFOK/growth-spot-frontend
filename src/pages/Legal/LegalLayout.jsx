/**
 * Layout для юридических страниц
 * Общий хедер с навигацией и футер
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogoIcon } from '../../components/icons'

// Иконка стрелки назад
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

// Иконка документа
const DocumentIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const LegalLayout = ({ children, title, subtitle, lastUpdated }) => {
  const location = useLocation()
  
  // Обновляем мета-теги для SEO
  useEffect(() => {
    if (title) {
      document.title = `${title} | Точка Роста`
      
      // Обновляем description
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && subtitle) {
        metaDesc.setAttribute('content', `${subtitle}. ${title} сайта growth-spot.ru`)
      }
      
      // Обновляем canonical
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', `https://growth-spot.ru${location.pathname}`)
      }
      
      // Обновляем Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', `${title} | Точка Роста`)
      
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', `https://growth-spot.ru${location.pathname}`)
    }
  }, [title, subtitle, location.pathname])

  // Навигация по документам
  const legalLinks = [
    { path: '/privacy', label: 'Краткая версия' },
    { path: '/privacy-full', label: 'Полная версия' },
    { path: '/consent', label: 'Согласие на обработку' },
    { path: '/terms', label: 'Условия использования' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Хедер */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Логотип */}
            <Link to="/" className="flex items-center gap-2 group">
              <LogoIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Точка Роста
              </span>
            </Link>

            {/* Кнопка "На главную" */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">На главную</span>
            </Link>
          </div>
        </div>

        {/* Навигация по документам */}
        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 py-2 overflow-x-auto">
              {legalLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                      ${isActive
                        ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="flex-grow py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок страницы */}
          {title && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/40 mb-4">
                <DocumentIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                  {subtitle}
                </p>
              )}
              {lastUpdated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Последнее обновление: {lastUpdated}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Контент страницы */}
          {children}
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Точка Роста. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Главная
              </Link>
              <Link
                to="/#contact"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LegalLayout
