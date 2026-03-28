/**
 * Страница согласия на обработку персональных данных
 */
import { Link } from 'react-router-dom'
import SEOHead from '../../components/seo/SEOHead'
import { LogoIcon } from '../../components/icons'

const Consent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead 
        title="Согласие на обработку персональных данных — Точка Роста"
        description="Согласие на обработку персональных данных"
        canonical="https://growth-spot.ru/consent"
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
          Согласие на обработку персональных данных
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Отправляя заявку через форму на сайте growth-spot.ru, вы даёте согласие на обработку своих персональных данных на следующих условиях:
          </p>

          <h2>1. Оператор персональных данных</h2>
          <p>
            Оператором персональных данных является владелец сайта growth-spot.ru (далее — Оператор).
          </p>

          <h2>2. Перечень обрабатываемых данных</h2>
          <ul>
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Текст сообщения (при наличии)</li>
          </ul>

          <h2>3. Цели обработки</h2>
          <p>
            Персональные данные обрабатываются в целях:
          </p>
          <ul>
            <li>Связи с вами для обсуждения вашего запроса</li>
            <li>Предоставления информации об услугах</li>
            <li>Заключения и исполнения договоров</li>
          </ul>

          <h2>4. Способы обработки</h2>
          <p>
            Обработка персональных данных осуществляется с использованием средств автоматизации и/или без использования таких средств, включая сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу, обезличивание, блокирование, удаление, уничтожение.
          </p>

          <h2>5. Срок действия согласия</h2>
          <p>
            Согласие действует до момента его отзыва. Отзыв согласия осуществляется путём направления письменного заявления на адрес: <a href="mailto:hello@tochkarosta.ru">hello@tochkarosta.ru</a>
          </p>

          <h2>6. Права субъекта персональных данных</h2>
          <p>
            Вы имеете право:
          </p>
          <ul>
            <li>Получать информацию об обработке ваших персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения данных</li>
            <li>Отозвать данное согласие</li>
          </ul>

          <div className="mt-8 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
            <p className="text-sm text-violet-700 dark:text-violet-300 m-0">
              <strong>Важно:</strong> Отправляя форму заявки, вы подтверждаете, что ознакомлены с настоящим согласием и <Link to="/privacy" className="underline">Политикой конфиденциальности</Link>, и даёте своё согласие на обработку персональных данных.
            </p>
          </div>

          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
              Дата последнего обновления: январь 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Consent
