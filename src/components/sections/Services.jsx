/**
 * Секция услуг
 * Показывает 3 основных направления работы
 */
import { WebsiteIcon, LaunchIcon, SupportIcon, ArrowRightIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const Services = () => {
  const services = [
    {
      icon: WebsiteIcon,
      title: 'Разработка сайта под ключ',
      description: 'Создаю лендинги и корпоративные сайты с адаптивной вёрсткой, формами обратной связи и базовой панелью управления.',
      features: [
        'Лендинги и корпоративные сайты',
        'Адаптивный дизайн',
        'Формы и интеграции',
        'Базовая админка',
      ],
      color: 'violet',
      popular: true,
    },
    {
      icon: LaunchIcon,
      title: 'Запуск и техническая настройка',
      description: 'Беру на себя всю техническую часть запуска: домен, хостинг, SSL, деплой проекта и настройку почты.',
      features: [
        'Регистрация домена',
        'Настройка хостинга / VPS',
        'SSL-сертификат',
        'Деплой и публикация',
      ],
      color: 'blue',
      popular: false,
    },
    {
      icon: SupportIcon,
      title: 'Техническое сопровождение',
      description: 'После запуска не пропадаю — помогаю с обновлениями, резервными копиями, мелкими правками и техническими вопросами.',
      features: [
        'Мониторинг и бэкапы',
        'Обновления и правки',
        'Поддержка форм заявок',
        'Помощь по вопросам',
      ],
      color: 'emerald',
      popular: false,
    },
  ]

  const colorClasses = {
    violet: {
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      icon: 'text-violet-600 dark:text-violet-400',
      border: 'hover:border-violet-200 dark:hover:border-violet-700',
    },
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-200 dark:hover:border-blue-700',
    },
    emerald: {
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-200 dark:hover:border-emerald-700',
    },
  }

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const delays = [0, 100, 200]

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50/70 dark:bg-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="slide-up" className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            Услуги
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Что я делаю
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Полный цикл: от разработки до технического сопровождения после запуска
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const colors = colorClasses[service.color]
            
            return (
              <RevealOnScroll
                key={index}
                animation="slide-up"
                delay={delays[index]}
                className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700 ${colors.border} hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer flex flex-col`}
                onClick={scrollToContact}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-6">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium rounded-full shadow-sm">
                      Основная услуга
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}>
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  {service.title}
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                
                <div className="mt-auto">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <svg className={`w-4 h-4 ${colors.icon} flex-shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
        
        <RevealOnScroll animation="fade" delay={100} className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Дополнительные решения
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Для отдельных проектов можем реализовать расширенные технические возможности: 
                уведомления, автоматизации, интеграции с Telegram или email, внутренние инструменты для контроля проекта. 
                Обсудим на этапе планирования.
              </p>
            </div>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors flex-shrink-0"
            >
              Узнать подробнее
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default Services
