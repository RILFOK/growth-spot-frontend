/**
 * Hero секция — главный экран сайта
 * Содержит заголовок, описание, CTA кнопки и иллюстрацию
 * Тексты загружаются из настроек (useSettings)
 * Интерактивные плавающие карточки с автоматической анимацией
 */
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import { ArrowRightIcon, CheckIcon } from '../icons'
import useInView from '../../hooks/useInView'
import { useSettings } from '../../context/SettingsContext'

// ==========================================
// Интерактивная плавающая карточка
// С автоматической анимацией плавания
// ==========================================
const FloatingCard = ({ icon, label, color, position, delay, floatType = 'float', size = 'normal', hideOnMobile = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const colorClasses = {
    violet: {
      bg: 'bg-violet-100 dark:bg-violet-900/40',
      icon: 'text-violet-600 dark:text-violet-400',
      ring: 'ring-violet-400/50',
      glow: 'shadow-violet-500/25',
      pulse: 'bg-violet-500',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-400/50',
      glow: 'shadow-emerald-500/25',
      pulse: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      icon: 'text-blue-600 dark:text-blue-400',
      ring: 'ring-blue-400/50',
      glow: 'shadow-blue-500/25',
      pulse: 'bg-blue-500',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      icon: 'text-amber-600 dark:text-amber-400',
      ring: 'ring-amber-400/50',
      glow: 'shadow-amber-500/25',
      pulse: 'bg-amber-500',
    },
  }[color]

  const floatAnimations = {
    float: 'animate-float',
    'float-slow': 'animate-float-slow',
    'float-delayed': 'animate-float-delayed',
    'float-reverse': 'animate-float-reverse',
  }

  const sizeClasses = {
    normal: 'p-3',
    small: 'p-2.5',
  }

  const iconSizeClasses = {
    normal: 'w-8 h-8',
    small: 'w-7 h-7',
  }

  const textSizeClasses = {
    normal: 'text-sm',
    small: 'text-xs',
  }

  const visibilityClass = hideOnMobile ? 'hidden lg:block' : 'hidden sm:block'

  return (
    <div 
      className={`
        absolute ${position} 
        bg-white dark:bg-slate-800 
        rounded-xl shadow-lg 
        ${isHovered ? `shadow-xl ${colorClasses.glow} ring-2 ${colorClasses.ring} scale-110 z-20` : 'shadow-slate-200/50 dark:shadow-slate-900/50'}
        ${sizeClasses[size]} ${visibilityClass}
        transition-all duration-300 ease-out
        cursor-pointer select-none
        ${floatAnimations[floatType]}
      `}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <div className={`
          ${iconSizeClasses[size]} rounded-lg ${colorClasses.bg} 
          flex items-center justify-center 
          transition-transform duration-300 
          ${isHovered ? 'scale-110 rotate-12' : ''}
        `}>
          <span className={colorClasses.icon}>{icon}</span>
        </div>
        <span className={`
          ${textSizeClasses[size]} font-medium text-slate-700 dark:text-slate-200 
          transition-all duration-300 
          ${isHovered ? 'translate-x-0.5' : ''}
        `}>
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${colorClasses.pulse} animate-pulse`} />
      </div>
      
      {isHovered && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
        </div>
      )}
    </div>
  )
}

// ==========================================
// Анимированный счётчик
// ==========================================
const AnimatedCounter = ({ value, label, suffix = '', isVisible }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isVisible) return
    
    let start = 0
    const end = parseInt(value)
    const duration = 2000
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value, isVisible])
  
  return (
    <div className="text-center group cursor-default">
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

// ==========================================
// Декоративные фоновые элементы
// ==========================================
const HeroDecoration = () => (
  <>
    <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/60 via-indigo-200/40 to-blue-200/60 dark:from-violet-900/30 dark:via-indigo-900/20 dark:to-blue-900/30 rounded-full blur-3xl animate-pulse-soft" />
    <div 
      className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-violet-300/40 to-purple-200/30 dark:from-violet-900/20 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse-soft" 
      style={{ animationDelay: '2s' }} 
    />
    <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-t from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-full blur-3xl" />
    <div className="absolute top-20 right-1/4 w-4 h-4 bg-violet-400/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
    <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full animate-float-slow" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 right-10 w-2 h-2 bg-indigo-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
  </>
)

// ==========================================
// SVG иллюстрация
// ==========================================
const HeroIllustration = ({ className, isHovered }) => {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none">
      <circle cx="200" cy="200" r="160" fill="url(#heroGrad1)" opacity="0.1" className="animate-pulse-soft" />
      <circle cx="200" cy="200" r="140" stroke="url(#heroGrad1)" strokeWidth="1" strokeDasharray="20 10" fill="none" opacity="0.2" className="animate-rotate-slow" style={{ transformOrigin: '200px 200px' }} />
      <path d="M200 60 L320 140 L320 260 L200 340 L80 260 L80 140 Z" fill="url(#heroGrad2)" opacity={isHovered ? "0.25" : "0.15"} className="transition-opacity duration-500" />
      <path d="M200 100 L280 150 L280 250 L200 300 L120 250 L120 150 Z" stroke="url(#heroGrad3)" strokeWidth={isHovered ? "3" : "2"} fill="none" opacity="0.4" className="transition-all duration-500" />
      <circle cx="200" cy="200" r={isHovered ? "55" : "50"} fill="url(#heroGrad4)" opacity="0.9" className="transition-all duration-500 animate-pulse-glow" />
      <circle cx="200" cy="200" r="35" fill="white" opacity="0.9" />
      <path d="M195 180 L210 180 L205 198 L215 198 L190 225 L197 205 L187 205 Z" fill="url(#heroGrad5)" className="animate-pulse" />
      <g className="animate-float" style={{ animationDelay: '0s', transformOrigin: '200px 100px' }}>
        <circle cx="200" cy="100" r={isHovered ? "8" : "6"} fill="#8B5CF6" opacity="0.8" className="transition-all duration-300" />
      </g>
      <g className="animate-float" style={{ animationDelay: '0.5s', transformOrigin: '280px 150px' }}>
        <circle cx="280" cy="150" r={isHovered ? "7" : "5"} fill="#6366F1" opacity="0.6" className="transition-all duration-300" />
      </g>
      <g className="animate-float-slow" style={{ animationDelay: '1s', transformOrigin: '280px 250px' }}>
        <circle cx="280" cy="250" r={isHovered ? "6" : "4"} fill="#3B82F6" opacity="0.7" className="transition-all duration-300" />
      </g>
      <g className="animate-float" style={{ animationDelay: '1.5s', transformOrigin: '200px 300px' }}>
        <circle cx="200" cy="300" r={isHovered ? "8" : "6"} fill="#8B5CF6" opacity="0.8" className="transition-all duration-300" />
      </g>
      <g className="animate-float-slow" style={{ animationDelay: '2s', transformOrigin: '120px 250px' }}>
        <circle cx="120" cy="250" r={isHovered ? "7" : "5"} fill="#6366F1" opacity="0.6" className="transition-all duration-300" />
      </g>
      <g className="animate-float" style={{ animationDelay: '2.5s', transformOrigin: '120px 150px' }}>
        <circle cx="120" cy="150" r={isHovered ? "6" : "4"} fill="#3B82F6" opacity="0.7" className="transition-all duration-300" />
      </g>
      <line x1="200" y1="100" x2="280" y2="150" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
      <line x1="280" y1="150" x2="280" y2="250" stroke="#6366F1" strokeWidth="1" opacity="0.3" />
      <line x1="280" y1="250" x2="200" y2="300" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="300" x2="120" y2="250" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
      <line x1="120" y1="250" x2="120" y2="150" stroke="#6366F1" strokeWidth="1" opacity="0.3" />
      <line x1="120" y1="150" x2="200" y2="100" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
      <circle cx="320" cy="120" r="12" fill="#E0E7FF" className="dark:opacity-50 animate-float" style={{ animationDelay: '0.3s' }} />
      <circle cx="340" cy="200" r="8" fill="#DDD6FE" className="dark:opacity-50 animate-float-slow" style={{ animationDelay: '0.8s' }} />
      <circle cx="60" cy="180" r="10" fill="#E0E7FF" className="dark:opacity-50 animate-float" style={{ animationDelay: '1.3s' }} />
      <circle cx="80" cy="280" r="6" fill="#DDD6FE" className="dark:opacity-50 animate-float-slow" style={{ animationDelay: '1.8s' }} />
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="heroGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="heroGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="heroGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ==========================================
// Иконки для плавающих карточек
// ==========================================
const CheckSvg = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ShieldSvg = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const RocketSvg = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
)

const CodeSvg = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const StarSvg = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// ==========================================
// Основной компонент Hero
// ==========================================
const Hero = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [isIllustrationHovered, setIsIllustrationHovered] = useState(false)
  const { get } = useSettings()

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    'Разработка под ключ',
    'Запуск и настройка',
    'Сопровождение',
  ]

  const floatingCards = [
    { icon: <CheckSvg />, label: 'Запуск', color: 'violet', position: 'left-[1%] top-[12%]', delay: 0, floatType: 'float', size: 'normal' },
    { icon: <ShieldSvg />, label: 'Поддержка', color: 'emerald', position: 'left-1/2 -translate-x-1/2 bottom-[5%]', delay: 0.7, floatType: 'float-slow', size: 'normal' },
    { icon: <RocketSvg />, label: 'Быстро', color: 'blue', position: 'left-[3%] bottom-[35%]', delay: 1.4, floatType: 'float-delayed', size: 'small' },
    { icon: <CodeSvg />, label: 'Современно', color: 'amber', position: 'right-[4%] top-[18%]', delay: 0.3, floatType: 'float', size: 'small' },
    { icon: <StarSvg />, label: 'Качество', color: 'violet', position: 'right-[8%] top-[48%]', delay: 1.0, floatType: 'float-slow', size: 'small', hideOnMobile: true },
  ]

  return (
    <section 
      ref={ref} 
      className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-gradient-to-b from-slate-50 via-white to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden transition-colors duration-300"
    >
      <HeroDecoration />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Контент */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-violet-100/80 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm ${isInView ? 'animate-fade-in' : 'opacity-0'}`}>
              <span className="w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full animate-pulse" />
              Веб-студия полного цикла
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight transition-colors duration-300 ${isInView ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
              {get('hero_title', 'Сайт под ключ')}
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {get('hero_subtitle', '— с запуском и поддержкой')}
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 transition-colors duration-300 ${isInView ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
              {get('hero_description', 'Разрабатываем, запускаем и сопровождаем сайты для бизнеса. Вы получаете готовый проект и техническую поддержку после старта.')}
            </p>
            
            <div className={`flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-10 ${isInView ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400 cursor-default">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${isInView ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
              <Button size="lg" onClick={() => scrollToSection('#contact')} className="group">
                Обсудить проект
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('#services')}>
                Мои услуги
              </Button>
            </div>

          </div>
          
          {/* Иллюстрация */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div 
              className={`relative ${isInView ? 'animate-scale-in delay-200' : 'opacity-0'}`}
              onMouseEnter={() => setIsIllustrationHovered(true)}
              onMouseLeave={() => setIsIllustrationHovered(false)}
            >
              <HeroIllustration className="w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] animate-float-slow cursor-pointer" isHovered={isIllustrationHovered} />
              
              {floatingCards.map((card, index) => (
                <FloatingCard
                  key={index}
                  icon={card.icon}
                  label={card.label}
                  color={card.color}
                  position={card.position}
                  delay={card.delay}
                  floatType={card.floatType}
                  size={card.size || 'normal'}
                  hideOnMobile={card.hideOnMobile || false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
