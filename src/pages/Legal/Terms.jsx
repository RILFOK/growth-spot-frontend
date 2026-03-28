/**
 * Страница условий использования
 */
import { Link } from 'react-router-dom'
import SEOHead from '../../components/seo/SEOHead'
import { LogoIcon } from '../../components/icons'

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead 
        title="Условия использования — Точка Роста"
        description="Условия использования сайта и услуг"
        canonical="https://growth-spot.ru/terms"
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
          Условия использования
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Настоящие Условия использования регулируют порядок использования сайта growth-spot.ru и предоставляемых услуг.
          </p>

          <h2>1. Общие положения</h2>
          <p>
            1.1. Используя сайт growth-spot.ru, вы соглашаетесь с настоящими Условиями использования.
          </p>
          <p>
            1.2. Если вы не согласны с какими-либо положениями, пожалуйста, прекратите использование сайта.
          </p>

          <h2>2. Описание услуг</h2>
          <p>
            2.1. Сайт предоставляет информацию об услугах веб-разработки, включая:
          </p>
          <ul>
            <li>Разработка сайтов под ключ</li>
            <li>Запуск и техническая настройка</li>
            <li>Техническое сопровождение</li>
          </ul>
          <p>
            2.2. Конкретные условия оказания услуг определяются индивидуальным договором.
          </p>

          <h2>3. Обязательства пользователя</h2>
          <p>
            3.1. Пользователь обязуется:
          </p>
          <ul>
            <li>Предоставлять достоверную информацию при заполнении форм</li>
            <li>Не использовать сайт в противоправных целях</li>
            <li>Не нарушать работу сайта</li>
          </ul>

          <h2>4. Интеллектуальная собственность</h2>
          <p>
            4.1. Все материалы сайта (тексты, изображения, код) являются объектами интеллектуальной собственности и защищены законодательством РФ.
          </p>
          <p>
            4.2. Копирование материалов без согласия владельца запрещено.
          </p>

          <h2>5. Ограничение ответственности</h2>
          <p>
            5.1. Информация на сайте предоставляется «как есть». Владелец сайта не несёт ответственности за возможные неточности.
          </p>
          <p>
            5.2. Владелец сайта не несёт ответственности за временную недоступность сайта.
          </p>

          <h2>6. Изменение условий</h2>
          <p>
            6.1. Владелец сайта оставляет за собой право изменять настоящие Условия без предварительного уведомления.
          </p>
          <p>
            6.2. Актуальная версия Условий всегда доступна на данной странице.
          </p>

          <h2>7. Применимое право</h2>
          <p>
            7.1. Настоящие Условия регулируются законодательством Российской Федерации.
          </p>

          <h2>8. Контакты</h2>
          <p>
            По всем вопросам: <a href="mailto:hello@tochkarosta.ru">hello@tochkarosta.ru</a>
          </p>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
              Дата последнего обновления: январь 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Terms
