/**
 * Компонент Яндекс.Метрики для React SPA
 * 
 * Функции:
 * - Загружает скрипт метрики при монтировании
 * - Отслеживает переходы между страницами
 * - Берёт ID метрики из настроек (SettingsContext)
 * - Не загружается если ID не указан
 * 
 * Включённые опции:
 * - webvisor: запись действий посетителей
 * - clickmap: карта кликов
 * - trackLinks: отслеживание внешних ссылок
 * - accurateTrackBounce: точный показатель отказов
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { normalizeMetrikaId } from '../../utils/analytics'

const YandexMetrika = () => {
  const location = useLocation()
  const { get, loading } = useSettings()
  const isInitialized = useRef(false)
  const currentMetrikaId = useRef(null)
  
  // Do not send preview/portfolio traffic to a historic production counter.
  // Validate the value before interpolating it into inline analytics bootstrap.
  const metrikaId = normalizeMetrikaId(get('yandex_metrika_id'))

  /**
   * Инициализация метрики при первой загрузке
   */
  useEffect(() => {
    // Ждём пока настройки загрузятся
    if (loading) return
    
    // Если ID не указан — не загружаем метрику
    if (!metrikaId) {
      console.log('Яндекс.Метрика: ID не указан, метрика не загружена')
      return
    }

    // Если уже инициализировали с этим ID — пропускаем
    if (isInitialized.current && currentMetrikaId.current === metrikaId) {
      return
    }

    // Загружаем скрипт метрики
    const script = document.createElement('script')
    script.textContent = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

      ym(${metrikaId}, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: 'dataLayer'
      });
    `
    document.head.appendChild(script)
    
    isInitialized.current = true
    currentMetrikaId.current = metrikaId
    
    console.log('Яндекс.Метрика инициализирована, ID:', metrikaId)
  }, [metrikaId, loading])

  /**
   * Отслеживание переходов между страницами в SPA
   * При каждом изменении URL отправляем hit в метрику
   */
  useEffect(() => {
    if (!isInitialized.current || !metrikaId) return
    
    // Отправляем информацию о просмотре страницы
    if (typeof window.ym === 'function') {
      window.ym(Number(metrikaId), 'hit', location.pathname + location.search, {
        title: document.title,
        referer: document.referrer
      })
    }
  }, [location, metrikaId])

  // Компонент ничего не рендерит
  return null
}

export default YandexMetrika
