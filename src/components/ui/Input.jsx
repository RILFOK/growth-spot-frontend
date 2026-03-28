/**
 * Компоненты Input и Textarea
 * Переиспользуемые поля ввода с поддержкой валидации и dark mode
 */
import { forwardRef } from 'react'

/**
 * Компонент текстового поля ввода
 * Использует forwardRef для работы с react-hook-form
 */
export const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 
          text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
          disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
          }
          ${className}
        `}
        {...props}
      />
      {/* Сообщение об ошибке */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

/**
 * Компонент многострочного текстового поля
 * Использует forwardRef для работы с react-hook-form
 */
export const Textarea = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 
          text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
          transition-all duration-200 resize-none
          focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
          disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
          }
          ${className}
        `}
        {...props}
      />
      {/* Сообщение об ошибке */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input
