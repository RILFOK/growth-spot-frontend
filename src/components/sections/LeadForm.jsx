/**
 * Форма захвата лидов
 * Отправляет данные на API и показывает состояния загрузки/успеха/ошибки
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { Input, Textarea } from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import { CheckIcon } from '../icons'
import {
  formatPhone,
  normalizeName,
  normalizePhone,
  normalizeSpaces,
  validateLeadMessage,
  validatePhone,
  validateRussianName,
} from '../../utils/leadValidation'

const LeadForm = () => {
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [blockedInfo, setBlockedInfo] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      message: '',
    }
  })

  const onSubmit = async (data) => {
    try {
      setSubmitStatus(null)
      setErrorMessage('')
      setBlockedInfo(null)

      const payload = {
        name: normalizeName(data.name),
        phone: normalizePhone(data.phone),
        message: normalizeSpaces(data.message || ''),
      }

      await api.post('/leads', payload)

      setSubmitStatus('success')
      reset()

      setTimeout(() => {
        setSubmitStatus(null)
      }, 10000)
    } catch (error) {
      console.error('Ошибка отправки формы:', error.response?.data || error.message)

      const responseData = error.response?.data || {}

      if (responseData.blocked || responseData.spam) {
        setBlockedInfo({
          ip: responseData.ip || null,
          message: responseData.message || 'Обнаружена подозрительная активность. Отправка заявок временно заблокирована.',
        })
      }

      setSubmitStatus('error')
      setErrorMessage(
        responseData.message ||
        'Произошла ошибка при отправке. Попробуйте ещё раз или свяжитесь со мной по телефону.'
      )
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Спасибо за обращение. Свяжусь с вами в течение часа в рабочее время.
        </p>
        <button
          onClick={() => setSubmitStatus(null)}
          className="text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  const nameRegister = register('name', {
    required: 'Укажите ваше имя',
    validate: validateRussianName,
    onChange: (e) => {
      const value = e.target.value
      const hasEnglish = /[A-Za-z]/.test(value)
      const cleaned = hasEnglish ? value : normalizeName(value)

      setValue('name', cleaned, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    onBlur: (e) => {
      const cleaned = normalizeName(e.target.value)
      setValue('name', cleaned, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  })

  const phoneRegister = register('phone', {
    required: 'Укажите телефон для связи',
    validate: validatePhone,
    onChange: (e) => {
      const formatted = formatPhone(e.target.value)
      setValue('phone', formatted, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    onBlur: (e) => {
      const formatted = formatPhone(e.target.value)
      setValue('phone', formatted, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  })

  const messageRegister = register('message', {
    validate: validateLeadMessage,
    onBlur: (e) => {
      const cleaned = normalizeSpaces(e.target.value)
      setValue('message', cleaned, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  })

  return (
    <div className="space-y-6">
      {submitStatus === 'error' && (
        <Alert
          type="error"
          title={blockedInfo ? 'Отправка заблокирована' : 'Не удалось отправить'}
          onClose={() => {
            setSubmitStatus(null)
            setBlockedInfo(null)
          }}
        >
          <div className="space-y-2">
            <div>{errorMessage}</div>
            {blockedInfo?.ip && (
              <div className="text-xs font-mono opacity-80">
                Ваш IP: {blockedInfo.ip}
              </div>
            )}
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Ваше имя"
          placeholder="Как к вам обращаться?"
          autoComplete="name"
          maxLength={40}
          error={errors.name?.message}
          {...nameRegister}
        />

        <Input
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={18}
          error={errors.phone?.message}
          {...phoneRegister}
        />

        <Textarea
          label="Расскажите о проекте"
          placeholder="Кратко опишите, какой сайт вам нужен и для чего..."
          rows={4}
          maxLength={1000}
          error={errors.message?.message}
          {...messageRegister}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
        </Button>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-2">
          Отправляя форму, вы соглашаетесь с{' '}
          <Link
            to="/privacy"
            className="text-violet-600 dark:text-violet-400 hover:underline"
          >
            Политикой конфиденциальности
          </Link>
          {' '}и{' '}
          <Link
            to="/consent"
            className="text-violet-600 dark:text-violet-400 hover:underline"
          >
            Согласием на обработку персональных данных
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LeadForm
