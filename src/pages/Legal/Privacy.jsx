/**
 * Страница политики конфиденциальности (краткая версия)
 */
import { Link } from 'react-router-dom'
import SEOHead from '../../components/seo/SEOHead'
import { LogoIcon } from '../../components/icons'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead 
        title="Политика конфиденциальности — Точка Роста"
        description="Политика конфиденциальности и обработки персональных данных"
        canonical="https://growth-spot.ru/privacy"
      />
      
      {/* Шапка */}
      <header className="border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <LogoIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Точка Роста
            </span>
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">
            ← На главную
          </Link>
        </div>
      </header>

      {/* Контент */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Политика конфиденциальности
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта growth-spot.ru
          </p>

          <h2>1. Общие положения</h2>
          <p>
            Используя сайт и отправляя заявки, вы соглашаетесь с условиями данной Политики конфиденциальности.
          </p>

          <h2>2. Какие данные мы собираем</h2>
          <ul>
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Сообщение (если указано)</li>
          </ul>

          <h2>3. Цели обработки данных</h2>
          <p>
            Персональные данные используются исключительно для связи с вами по вопросам оказания услуг.
          </p>

          <h2>4. Защита данных</h2>
          <p>
            Мы принимаем необходимые меры для защиты ваших персональных данных от несанкционированного доступа.
          </p>

          <h2>5. Передача данных третьим лицам</h2>
          <p>
            Ваши данные не передаются третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством РФ.
          </p>

          <h2>6. Контакты</h2>
          <p>
            По вопросам обработки персональных данных: <a href="mailto:hello@tochkarosta.ru">hello@tochkarosta.ru</a>
          </p>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
              Дата последнего обновления: январь 2025
            </p>
            <Link to="/privacy-full" className="text-sm text-violet-600 hover:text-violet-700">
              Читать полную версию →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Privacy
