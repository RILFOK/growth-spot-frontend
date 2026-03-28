/**
 * SEO компонент для управления мета-тегами страницы
 * Обновляет title, description и другие мета-теги динамически
 * 
 * @param {Object} props
 * @param {string} props.title - Заголовок страницы
 * @param {string} props.description - Описание страницы
 * @param {string} props.canonical - Канонический URL
 * @param {string} props.type - Тип страницы для Open Graph (website, article)
 */
import { useEffect } from 'react'

const SEOHead = ({
  title = 'Точка Роста — Веб-разработка для бизнеса',
  description = 'Разрабатываю современные сайты для бизнеса: лендинги, корпоративные сайты, техническое сопровождение. Полный цикл — от дизайна до запуска и поддержки.',
  canonical = 'https://growth-spot.ru/',
  type = 'website'
}) => {
  useEffect(() => {
    // Обновляем title
    document.title = title
    
    // Обновляем мета-теги
    const updateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attr}="${name}"]`)
      
      if (meta) {
        meta.setAttribute('content', content)
      } else {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    }
    
    // Основные мета-теги
    updateMeta('description', description)
    
    // Open Graph
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:url', canonical, true)
    updateMeta('og:type', type, true)
    
    // Twitter
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    
    // Канонический URL
    let link = document.querySelector('link[rel="canonical"]')
    if (link) {
      link.setAttribute('href', canonical)
    } else {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      link.setAttribute('href', canonical)
      document.head.appendChild(link)
    }
  }, [title, description, canonical, type])
  
  // Компонент не рендерит ничего в DOM
  return null
}

export default SEOHead
