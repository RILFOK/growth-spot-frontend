import { useEffect, useRef, useState, useMemo } from 'react'

/**
 * Хук для отслеживания появления элемента во viewport
 * Использует Intersection Observer API
 * 
 * @param {Object} options - Опции для IntersectionObserver
 * @param {number} options.threshold - Порог видимости (0-1), по умолчанию 0.1
 * @param {string} options.rootMargin - Отступы от viewport
 * @param {boolean} options.triggerOnce - Срабатывать только один раз (по умолчанию true)
 * @returns {[React.RefObject, boolean]} - Ref для элемента и флаг видимости
 */
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  // Мемоизируем опции чтобы избежать бесконечных ререндеров
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  
  const memoizedOptions = useMemo(
    () => ({ threshold, rootMargin }),
    [threshold, rootMargin]
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // Отключаем наблюдатель после первого появления если triggerOnce
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      memoizedOptions
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [memoizedOptions, triggerOnce])

  return [ref, isInView]
}

export default useInView
