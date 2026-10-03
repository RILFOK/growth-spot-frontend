/**
 * A Yandex Metrika counter comes from site settings, not source-code fallback.
 * Restrict it to a positive integer before embedding into analytics bootstrap.
 */
export const normalizeMetrikaId = (value) => {
  const raw = typeof value === 'string'
    ? value.trim()
    : (typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : '')

  if (!/^[1-9]\d{0,11}$/.test(raw)) return null
  return Number(raw)
}
