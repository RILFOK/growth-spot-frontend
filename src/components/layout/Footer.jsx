/**
 * Footer компонент
 * Подвал сайта с навигацией, контактами и социальными сетями
 * Данные загружаются из настроек (useSettings)
 */
import { Link } from 'react-router-dom'
import { LogoIcon, PhoneIcon, MailIcon } from '../icons'
import { useSettings } from '../../context/SettingsContext'

// Иконка Telegram
const TelegramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

// Иконка VK
const VKIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.779.677.847 2.49 2.27 4.673 2.86 4.673.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.305-.491.745-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
  </svg>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  // Получаем настройки из контекста
  const { get } = useSettings()

  // Плавная прокрутка к секции
  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { href: '#services', label: 'Услуги' },
    { href: '#benefits', label: 'Преимущества' },
    { href: '#process', label: 'Как я работаю' },
    { href: '#contact', label: 'Контакты' },
  ]

  const services = [
    'Лендинги',
    'Корпоративные сайты',
    'Техническая поддержка',
    'Доработка сайтов',
  ]

  // Социальные сети из настроек
  const socials = [
    { 
      icon: TelegramIcon, 
      href: get('telegram_url', 'https://t.me/tochkarosta'), 
      label: 'Telegram' 
    },
    { 
      icon: VKIcon, 
      href: get('vk_url', 'https://vk.com/tochkarosta'), 
      label: 'VK' 
    },
  ]

  // Юридические документы
  const legalLinks = [
    { to: '/privacy', label: 'Политика конфиденциальности' },
    { to: '/privacy-full', label: 'Расширенная версия' },
    { to: '/consent', label: 'Согласие на обработку ПД' },
    { to: '/terms', label: 'Условия использования' },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <LogoIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold text-white">
                Точка Роста
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Создаю сайты, которые работают на ваш бизнес
            </p>
            {/* Социальные сети */}
            <div className="flex gap-2">
              {socials.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-violet-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Навигация</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Услуги</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-slate-400 text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`tel:${get('phone_raw', '+79991234567')}`}
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-violet-600/20 flex items-center justify-center transition-colors">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{get('phone', '+7 (999) 123-45-67')}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${get('email', 'hello@tochkarosta.ru')}`}
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-violet-600/20 flex items-center justify-center transition-colors">
                    <MailIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{get('email', 'hello@tochkarosta.ru')}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт и юридические документы */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Точка Роста. Все права защищены.
            </p>
            
            {/* Ссылки на юридические документы */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {legalLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
