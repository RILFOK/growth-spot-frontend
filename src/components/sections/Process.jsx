/**
 * Секция процесса работы
 * Показывает 5 этапов разработки проекта
 */
import { ChatIcon, PenToolIcon, CodeIcon, PlayIcon, SupportIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const Process = () => {
  const steps = [
    {
      number: '01',
      icon: ChatIcon,
      title: 'Обсуждение',
      description: 'Знакомимся, выясняю задачи и цели проекта. Обсуждаем сроки, бюджет и формат работы.',
    },
    {
      number: '02',
      icon: PenToolIcon,
      title: 'Проектирование',
      description: 'Создаю структуру и макеты. Согласовываем дизайн до начала разработки.',
    },
    {
      number: '03',
      icon: CodeIcon,
      title: 'Разработка',
      description: 'Верстаю и программирую. Показываю промежуточные результаты, вношу правки.',
    },
    {
      number: '04',
      icon: PlayIcon,
      title: 'Запуск',
      description: 'Настраиваю хостинг, домен, SSL. Выкладываю сайт, подключаю аналитику.',
    },
    {
      number: '05',
      icon: SupportIcon,
      title: 'Поддержка',
      description: 'Остаюсь на связи после запуска. Помогаю с обновлениями, правками и вопросами.',
    },
  ]

  return (
    <section id="process" className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="slide-up" className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            Процесс
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Этапы работы
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            От первого звонка до работающего сайта с поддержкой
          </p>
        </RevealOnScroll>

        {/* Desktop версия */}
        <RevealOnScroll animation="fade" className="hidden lg:block relative">
          <div className="absolute top-[4.5rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
          
          <div className="grid grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              
              return (
                <div key={index} className="relative text-center">
                  <div className="relative inline-flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-3 relative z-10">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center z-20">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </RevealOnScroll>
        
        {/* Mobile версия */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isLast = index === steps.length - 1
            
            return (
              <RevealOnScroll 
                key={index} 
                animation="slide-up" 
                delay={Math.min(index * 100, 300)}
                className="relative flex gap-4"
              >
                {!isLast && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-slate-200 dark:bg-slate-700" style={{ height: 'calc(100% - 2rem)' }} />
                )}
                
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1 pb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Process
