/**
 * Секция FAQ (Часто задаваемые вопросы)
 * Аккордеон с вопросами и ответами
 */
import { useState } from 'react'
import { ChevronDownIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'Сколько стоит сайт?',
      answer: 'Разработка лендинга — от 30 000 ₽. Итоговая стоимость зависит от структуры, объёма работ, функционала и задач проекта. Домен, хостинг и сторонние сервисы при необходимости оплачиваются отдельно.',
    },
    {
      question: 'Сколько времени занимает разработка?',
      answer: 'В среднем лендинг занимает от 7 до 14 рабочих дней, корпоративный сайт — от 2 до 4 недель. Сроки зависят от сложности проекта, скорости согласований и готовности материалов.',
    },
    {
      question: 'Что входит в сопровождение?',
      answer: 'Сопровождение может включать мониторинг сайта, резервные копии, обновления, мелкие правки, поддержку форм заявок и помощь по техническим вопросам после запуска.',
    },
    {
      question: 'Можно ли передать вам серверную поддержку?',
      answer: 'Да, при необходимости могу взять на себя техническое сопровождение проекта, включая настройку хостинга/VPS, деплой, SSL, мониторинг и базовое администрирование.',
    },
    {
      question: 'Что нужно от меня для начала работы?',
      answer: 'Для старта достаточно понимания, какой сайт вам нужен и для чего. Если есть референсы, тексты, логотип — отлично. Если нет — помогу с контентом и подберу решение.',
    },
    {
      question: 'Можно ли будет самому редактировать сайт?',
      answer: 'Да, при необходимости делаю сайты с базовой панелью управления. Вы сможете сами менять тексты и добавлять контент. Покажу, как всё работает.',
    },
  ]

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll animation="slide-up" className="text-center mb-12 lg:mb-14">
            <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Частые вопросы
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Отвечаю на популярные вопросы о работе со мной
            </p>
          </RevealOnScroll>

          <RevealOnScroll animation="fade" className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              
              return (
                <div 
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 ${
                    isOpen 
                      ? 'border-violet-200 dark:border-violet-700 bg-violet-50/30 dark:bg-violet-900/20' 
                      : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-semibold transition-colors ${
                      isOpen ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-white'
                    }`}>
                      {faq.question}
                    </span>
                    <ChevronDownIcon 
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                        isOpen 
                          ? 'rotate-180 text-violet-600 dark:text-violet-400' 
                          : 'text-slate-400 dark:text-slate-500'
                      }`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export default FAQ
