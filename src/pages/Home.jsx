/**
 * Главная страница сайта
 * Собирает все секции лендинга в единую композицию
 */
import SEOHead from '../components/seo/SEOHead'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import Benefits from '../components/sections/Benefits'
import Process from '../components/sections/Process'
import ForWhom from '../components/sections/ForWhom'
import Pricing from '../components/sections/Pricing'
import WhatYouGet from '../components/sections/WhatYouGet'
import FAQ from '../components/sections/FAQ'
import Contact from '../components/sections/Contact'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* SEO мета-теги */}
      <SEOHead 
        title="Точка Роста — Веб-разработка для бизнеса | Создание сайтов под ключ"
        description="Разрабатываю современные сайты для бизнеса: лендинги, корпоративные сайты, техническое сопровождение. Полный цикл — от дизайна до запуска и поддержки. Санкт-Петербург."
        canonical="https://growth-spot.ru/"
      />
      
      {/* Шапка сайта с навигацией */}
      <Header />
      
      <main className="flex-grow">
        {/* Hero — главный экран с заголовком и CTA */}
        <Hero />
        
        {/* Услуги — что я делаю */}
        <Services />
        
        {/* Преимущества — почему выбирают меня */}
        <Benefits />
        
        {/* Для кого — целевые аудитории */}
        <ForWhom />
        
        {/* Процесс — этапы работы */}
        <Process />
        
        {/* Тарифы на сопровождение */}
        <Pricing />
        
        {/* Что вы получите — результаты работы */}
        <WhatYouGet />
        
        {/* FAQ — частые вопросы */}
        <FAQ />
        
        {/* Контакты и форма заявки */}
        <Contact />
      </main>
      
      {/* Подвал сайта */}
      <Footer />
    </div>
  )
}

export default Home
