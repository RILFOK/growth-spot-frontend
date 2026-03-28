/**
 * Секция контактов
 * Форма обратной связи + контактная информация
 */
import LeadForm from './LeadForm'
import { PhoneIcon, MailIcon } from '../icons'
import RevealOnScroll from '../ui/RevealOnScroll'
import { useSettings } from '../../context/SettingsContext'

const TelegramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const Contact = () => {
  const { get } = useSettings()

  const contacts = [
    {
      icon: PhoneIcon,
      label: 'Телефон',
      value: get('phone', '+7 (999) 123-45-67'),
      href: `tel:${get('phone_raw', '+79991234567')}`,
      description: get('work_hours', 'Каждый день, 9:00–21:00'),
    },
    {
      icon: MailIcon,
      label: 'Email',
      value: get('email', 'hello@tochkarosta.ru'),
      href: `mailto:${get('email', 'hello@tochkarosta.ru')}`,
      description: 'Отвечу в течение дня',
    },
  ]

  const messengers = [
    {
      icon: TelegramIcon,
      label: get('telegram_label', 'Telegram'),
      href: get('telegram_url', 'https://t.me/tochkarosta'),
      color: 'hover:bg-[#229ED9]/10 hover:text-[#229ED9] dark:hover:bg-[#229ED9]/20',
    },
    {
      icon: WhatsAppIcon,
      label: get('whatsapp_number', 'WhatsApp'),
      href: get('whatsapp_url', 'https://wa.me/79991234567'),
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366] dark:hover:bg-[#25D366]/20',
    },
  ]

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100/50 dark:bg-violet-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll animation="fade">
          <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
              Контакты
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Обсудим ваш проект?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Оставьте заявку или свяжитесь со мной напрямую — отвечу в течение часа
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          <RevealOnScroll animation="slide-right" className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Готовы начать?
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Расскажите о своей задаче — проведём бесплатную консультацию и предложим решение.
              </p>
            </div>

            <div className="space-y-3">
              {contacts.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <a 
                    key={index}
                    href={contact.href}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-600 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/60 transition-colors">
                      <IconComponent className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {contact.value}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{contact.description}</div>
                    </div>
                  </a>
                )
              })}
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Или напишите в мессенджер:</p>
              <div className="flex gap-3">
                {messengers.map((messenger, index) => {
                  const IconComponent = messenger.icon
                  return (
                    <a
                      key={index}
                      href={messenger.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-300 ${messenger.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm font-medium">{messenger.label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white text-sm mb-0.5">Время ответа</div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {get('response_time', 'Обычно отвечаем в течение дня в рабочее время')}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="slide-left" delay={200} className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-slate-900/30 border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Оставить заявку
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Заполните форму, и я свяжусь с вами для обсуждения проекта
                </p>
              </div>
              <LeadForm />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export default Contact
