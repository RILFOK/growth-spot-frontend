/**
 * Компонент уведомления/алерта
 * Поддерживает типы: success, error, warning, info
 */
import { CloseIcon } from '../icons'

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose,
  className = '' 
}) => {
  // Стили для каждого типа алерта
  const types = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      title: 'text-emerald-800 dark:text-emerald-300',
      text: 'text-emerald-700 dark:text-emerald-400',
      close: 'text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-300',
      text: 'text-red-700 dark:text-red-400',
      close: 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
      title: 'text-amber-800 dark:text-amber-300',
      text: 'text-amber-700 dark:text-amber-400',
      close: 'text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-400',
      close: 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    },
  }

  const styles = types[type]

  // Иконки для каждого типа
  const icons = {
    success: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 ${className}`}>
      <div className="flex gap-3">
        {/* Иконка */}
        <div className={`w-9 h-9 rounded-lg ${styles.icon} flex items-center justify-center flex-shrink-0`}>
          {icons[type]}
        </div>
        
        {/* Контент */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold ${styles.title} mb-0.5`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${styles.text}`}>
            {children}
          </p>
        </div>
        
        {/* Кнопка закрытия */}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${styles.close} flex-shrink-0 self-start`}
            aria-label="Закрыть"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
