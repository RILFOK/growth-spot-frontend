/**
 * Секция тарифов на сопровождение
 * Показывает 3 тарифных плана с возможностью выбора
 */
import { CheckIcon, ArrowRightIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const Pricing = () => {
  const plans = [
    {
      name: 'Базовый',
      price: '5 000',
      period: '/ мес',
      description: 'Для небольших сайтов, которым нужен минимальный контроль',
      features: [
        'Мониторинг работы сайта',
        'Резервные копии',
        'Мелкие правки (до 2 ч/мес)',
        'Консультации по вопросам',
      ],
      color: 'slate',
      popular: false,
    },
    {
      name: 'Стандарт',
      price: '10 000',
      period: '/ мес',
      description: 'Оптимальный вариант для активно работающих сайтов',
      features: [
        'Всё из тарифа «Базовый»',
        'Обновления и патчи',
        'Поддержка форм заявок',
        'Техническая поддержка сайта',
        'Правки до 4 ч/мес',
      ],
      color: 'violet',
      popular: true,
    },
    {
      name: 'Расширенный',
      price: '15 000',
      period: '/ мес',
      description: 'Для проектов с VPS и повышенными требованиями',
      features: [
        'Всё из тарифа «Стандарт»',
        'Поддержка VPS / сервера',
        'Деплой обновлений',
        'Диагностика сбоев',
        'Приоритетная реакция',
      ],
      color: 'blue',
      popular: false,
    },
  ]

  const colorClasses = {
    slate: {
      badge: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
      button: 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white',
      border: 'border-slate-200 dark:border-slate-700',
      check: 'text-slate-600 dark:text-slate-400',
    },
    violet: {
      badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
      button: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25',
      border: 'border-violet-200 dark:border-violet-700',
      check: 'text-violet-600 dark:text-violet-400',
    },
    blue: {
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-200 dark:border-blue-700',
      check: 'text-blue-600 dark:text-blue-400',
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
    <section id="pricing" className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="slide-up" className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            Сопровождение
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Тарифы на сопровождение
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Поддержка сайта после запуска — чтобы всё работало стабильно и без сбоев
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const colors = colorClasses[plan.color]
            
            return (
              <RevealOnScroll 
                key={index}
                animation="slide-up"
                delay={delays[index]}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border ${colors.border} ${plan.popular ? 'shadow-xl shadow-violet-500/10 scale-[1.02] lg:scale-105' : 'hover:shadow-lg dark:hover:shadow-slate-900/50'} transition-all duration-300 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium rounded-full shadow-sm whitespace-nowrap">
                      Рекомендуем
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-500 dark:text-slate-400">от</span>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-lg text-slate-500 dark:text-slate-400">₽</span>
                    <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckIcon className={`w-5 h-5 ${colors.check} flex-shrink-0 mt-0.5`} />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={scrollToContact}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${colors.button}`}
                >
                  Выбрать тариф
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </RevealOnScroll>
            )
          })}
        </div>
        
        <RevealOnScroll animation="fade" className="mt-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Стоимость зависит от сложности проекта и объёма задач. 
            Итоговые условия обсуждаем индивидуально.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default Pricing
