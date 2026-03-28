const PROFANITY_PATTERNS = [
  /х(?:у|y|\*)[йиеёяю]/iu,
  /п(?:и|\*)з(?:д|\*)/iu,
  /б(?:л|\*)я/iu,
  /с(?:у|\*)к(?:а|и|о|y)/iu,
  /e?б(?:а|л|н|\*)/iu,
  /муд[ао]к/iu,
  /гандон/iu,
  /долбо[её]б/iu,
  /уеб/iu,
  /наху/iu,
  /поху/iu,
]

const GARBAGE_PATTERNS = [
  /(.)\1{4,}/u,
  /[!@#$%^&*_=+\[\]{};:\\|<>/~`]{4,}/u,
  /(https?:\/\/|www\.)/iu,
]

export const normalizeSpaces = (value = '') =>
  value.replace(/\s+/g, ' ').trim()

export const normalizeName = (value = '') =>
  normalizeSpaces(value)
    .replace(/[^А-Яа-яЁё\s-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/\s{2,}/g, ' ')
    .trim()

export const validateRussianName = (value = '') => {
  const name = normalizeSpaces(value)

  if (!name) return 'Укажите ваше имя'
  if (/[A-Za-z]/.test(value)) return 'Имя должно быть только на русском'
  if (name.length < 2) return 'Имя должно быть не короче 2 символов'
  if (name.length > 40) return 'Имя должно быть не длиннее 40 символов'
  if (/\d/.test(name)) return 'Имя не должно содержать цифры'
  if (!/^[А-Яа-яЁё\s-]+$/.test(name)) return 'Используйте только русские буквы, пробел и дефис'
  if (!/[А-Яа-яЁё]{2,}/.test(name)) return 'Введите корректное имя'
  if (/--|\s{2,}|^-|-$/.test(name)) return 'Введите корректное имя'

  return true
}

export const normalizePhone = (value = '') => {
  const digits = value.replace(/\D/g, '')

  if (!digits) return ''

  let normalized = digits

  if (normalized.startsWith('8') && normalized.length === 11) {
    normalized = '7' + normalized.slice(1)
  }

  if (normalized.startsWith('9') && normalized.length === 10) {
    normalized = '7' + normalized
  }

  if (normalized.startsWith('7') && normalized.length === 11) {
    return `+${normalized}`
  }

  return value
}

export const formatPhone = (value = '') => {
  const digits = value.replace(/\D/g, '')

  if (!digits) return ''

  let phone = digits

  if (phone.startsWith('8')) phone = '7' + phone.slice(1)
  if (phone.startsWith('9')) phone = '7' + phone

  phone = phone.slice(0, 11)

  if (phone.length <= 1) return `+${phone}`
  if (phone.length <= 4) return `+${phone[0]} (${phone.slice(1)}`
  if (phone.length <= 7) return `+${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4)}`
  if (phone.length <= 9) return `+${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`
  return `+${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
}

export const validatePhone = (value = '') => {
  const digits = normalizePhone(value).replace(/\D/g, '')

  if (!digits) return 'Укажите телефон для связи'
  if (!/^7\d{10}$/.test(digits)) return 'Введите корректный номер телефона'

  return true
}

export const containsProfanity = (value = '') => {
  const text = value.toLowerCase().replace(/\s+/g, '')
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(text))
}

export const containsGarbage = (value = '') => {
  const text = normalizeSpaces(value)
  if (!text) return false
  if (text.length > 1000) return true

  return GARBAGE_PATTERNS.some((pattern) => pattern.test(text))
}

export const validateLeadMessage = (value = '') => {
  const text = normalizeSpaces(value)

  if (!text) return true
  if (text.length < 5) return 'Опишите задачу чуть подробнее'
  if (text.length > 1000) return 'Сообщение слишком длинное'
  if (containsProfanity(text)) return 'Пожалуйста, без нецензурных выражений'
  if (containsGarbage(text)) return 'Сообщение содержит некорректные символы или мусор'

  return true
}
