/**
 * Секция преимуществ компании
 * Показывает 4 ключевых преимущества в виде карточек
 */
import { RocketIcon, ProcessIcon, CodeIcon, SupportIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const Benefits = () => {
  const benefits = [
    {
      icon: RocketIcon,
      title: 'Всё под ключ',
      description: 'Беру на себя полный цикл: от дизайна до запуска и настройки на хостинге. Вам не нужно искать отдельных специалистов.',
      accent: 'violet',
    },
    {
      icon: ProcessIcon,
      title: 'Понятный процесс',
      description: 'Работаю поэтапно с согласованием каждого шага. Вы видите, что происходит с проектом, и можете вносить правки.',
      accent: 'blue',
    },
    {
      icon: CodeIcon,
      title: 'Современный стек',
      description: 'Использую React, Next.js, Tailwind. Сайты быстрые, адаптивные и удобные для дальнейшей поддержки.',
      accent: 'indigo',
    },
    {
      icon: SupportIcon,
      title: 'Поддержка после запуска',
      description: 'Не исчезаю после сдачи проекта. Помогаю с обновлениями, правками и техническими вопросами.',
      accent: 'emerald',
    },
  ]

  const accentClasses = {
    violet: {
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
      hoverBorder: 'hover:border-violet-200 dark:hover:border-violet-700',
    },
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-700',
    },
    indigo: {
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      hoverBorder: 'hover:border-indigo-200 dark:hover:border-indigo-700',
    },
    emerald: {
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-200 dark:hover:border-emerald-700',
    },
  }

  const delays = [0, 100, 200, 300]

  return (
    <section id="benefits" className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="slide-up" className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            Преимущества
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Как я работаю
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Простой и понятный подход — от первого звонка до запущенного сайта с поддержкой
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            const colors = accentClasses[benefit.accent]
            
            return (
              <RevealOnScroll 
                key={index}
                animation="slide-up"
                delay={delays[index]}
                className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 ${colors.hoverBorder} hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}>
                  <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Benefits
