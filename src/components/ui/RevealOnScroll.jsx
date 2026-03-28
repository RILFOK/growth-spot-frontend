import useInView from '../../hooks/useInView'

/**
 * Компонент для плавного появления элементов при скролле
 * Без резкого мигания: использует transition вместо keyframe-классов
 */
const RevealOnScroll = ({
  children,
  animation = 'fade',
  delay = 0,
  threshold = 0.1,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const [ref, isInView] = useInView({ threshold })

  const hiddenClasses = {
    fade: 'opacity-0',
    'slide-up': 'opacity-0 translate-y-8',
    'slide-down': 'opacity-0 -translate-y-8',
    'slide-left': 'opacity-0 translate-x-8',
    'slide-right': 'opacity-0 -translate-x-8',
    scale: 'opacity-0 scale-95',
  }

  const visibleClasses = {
    fade: 'opacity-100',
    'slide-up': 'opacity-100 translate-y-0',
    'slide-down': 'opacity-100 translate-y-0',
    'slide-left': 'opacity-100 translate-x-0',
    'slide-right': 'opacity-100 translate-x-0',
    scale: 'opacity-100 scale-100',
  }

  const hiddenClass = hiddenClasses[animation] || hiddenClasses.fade
  const visibleClass = visibleClasses[animation] || visibleClasses.fade

  return (
    <Component
      ref={ref}
      className={`
        ${className}
        transform-gpu will-change-transform
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isInView ? visibleClass : hiddenClass}
      `.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default RevealOnScroll
