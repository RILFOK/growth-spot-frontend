/**
 * Header компонент
 * Шапка сайта с навигацией, переключателем темы и мобильным меню
 */
import { useState, useEffect } from 'react'
import { LogoIcon, MenuIcon, CloseIcon } from '../icons'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

// Иконки для переключателя темы
const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MonitorIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Отслеживаем скролл для изменения стиля шапки
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Блокируем скролл страницы при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '#services', label: 'Услуги' },
    { href: '#process', label: 'Процесс' },
    { href: '#pricing', label: 'Сопровождение' },
    { href: '#contact', label: 'Контакты' },
  ]

  // Плавная прокрутка к секции
  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Светлая', icon: SunIcon },
    { value: 'dark', label: 'Тёмная', icon: MoonIcon },
    { value: 'system', label: 'Системная', icon: MonitorIcon },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm dark:shadow-slate-800/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Логотип */}
            <a 
              href="/" 
              className="flex items-center gap-2 group"
            >
              <LogoIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Точка Роста
              </span>
            </a>

            {/* Desktop навигация */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium rounded-lg hover:bg-violet-50/80 dark:hover:bg-violet-900/20 transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop: Переключатель темы + CTA */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Dropdown выбора темы */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Сменить тему"
                >
                  {resolvedTheme === 'dark' ? (
                    <MoonIcon className="w-5 h-5" />
                  ) : (
                    <SunIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Выпадающее меню темы */}
                {isThemeMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsThemeMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-20">
                      {themeOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTheme(option.value)
                              setIsThemeMenuOpen(false)
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                              theme === option.value
                                ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              <Button 
                size="sm"
                onClick={() => scrollToSection('#contact')}
              >
                Обсудить проект
              </Button>
            </div>

            {/* Mobile: Переключатель темы + меню */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Быстрое переключение темы (циклическое) */}
              <button
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
                  setTheme(next)
                }}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Сменить тему"
              >
                {resolvedTheme === 'dark' ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>

              {/* Кнопка меню */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Меню"
              >
                {isMobileMenuOpen ? (
                  <CloseIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Мобильное меню (overlay) */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Затемнение фона */}
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Панель меню */}
        <div 
          className={`absolute top-16 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-5 transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-4 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 font-medium rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button 
              className="w-full"
              onClick={() => scrollToSection('#contact')}
            >
              Обсудить проект
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
