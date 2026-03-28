/**
 * Секция "Для кого"
 * Описывает целевые аудитории и их потребности
 */
import { CheckIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const ForWhom = () => {
  const audiences = [
    {
      title: 'Малый бизнес',
      description: 'Нужен сайт для продаж или представительства в интернете',
      items: ['Первый сайт компании', 'Лендинг для рекламы', 'Сайт-визитка'],
    },
    {
      title: 'Средний бизнес',
      description: 'Требуется корпоративный сайт с расширенным функционалом',
      items: ['Каталог продукции', 'Интеграции с CRM', 'Формы заявок'],
    },
    {
      title: 'Агентства и студии',
      description: 'Ищете подрядчика для клиентских проектов',
      items: ['White-label разработка', 'Соблюдение NDA', 'Гибкие сроки'],
    },
  ]

  const delays = [0, 100, 200]

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70 dark:bg-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="slide-up" className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            Для кого
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Кому подойдут мои услуги
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Работаю с разными задачами — от простых лендингов до проектов с сопровождением
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <RevealOnScroll 
              key={index}
              animation="slide-up"
              delay={delays[index]}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {audience.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
                {audience.description}
              </p>
              
              <ul className="space-y-2.5">
                {audience.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ForWhom
