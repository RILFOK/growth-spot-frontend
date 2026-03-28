/**
 * Секция "Что вы получите"
 * Список результатов работы после завершения проекта
 */
import { CheckIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const WhatYouGet = () => {
  const items = [
    {
      title: 'Готовый к работе сайт',
      description: 'Адаптивный, быстрый, оптимизированный под поисковики',
    },
    {
      title: 'Запуск на хостинге',
      description: 'Настрою домен, SSL, опубликую проект',
    },
    {
      title: 'Формы и интеграции',
      description: 'Работающие формы заявок и нужные подключения',
    },
    {
      title: 'Базовая админка',
      description: 'Возможность редактировать контент самостоятельно',
    },
    {
      title: 'Исходный код и доступы',
      description: 'Все материалы передаю вам — сайт полностью ваш',
    },
    {
      title: 'Поддержка после запуска',
      description: 'Остаюсь на связи и помогаю с вопросами',
    },
  ]

  const getDelay = (index) => Math.min(index * 100, 300)

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-violet-50/30 dark:from-slate-900 dark:to-slate-800/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll animation="slide-up" className="text-center mb-12 lg:mb-14">
            <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
              Результат
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Что вы получите
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              После завершения работы над проектом
            </p>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {items.map((item, index) => (
              <RevealOnScroll 
                key={index}
                animation="slide-up"
                delay={getDelay(index)}
                className="flex gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatYouGet
