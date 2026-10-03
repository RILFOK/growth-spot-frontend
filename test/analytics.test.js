import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { normalizeMetrikaId } from '../src/utils/analytics.js'

test('analytics counter is opt-in and numeric', () => {
  assert.equal(normalizeMetrikaId(undefined), null)
  assert.equal(normalizeMetrikaId(''), null)
  assert.equal(normalizeMetrikaId(' 108251909 '), 108251909)
  assert.equal(normalizeMetrikaId(108251909), 108251909)
})

test('analytics rejects unsafe or malformed counter IDs', () => {
  for (const input of ['0', '-1', '01', 'not-an-id', '123;alert(1)', '1);alert(1)//',
    '9999999999999', {}, Infinity, NaN]) {
    assert.equal(normalizeMetrikaId(input), null, String(input))
  }
})

test('analytics source no longer injects an unvalidated historic ID', () => {
  const source = readFileSync(
    new URL('../src/components/analytics/YandexMetrika.jsx', import.meta.url),
    'utf8'
  )
  assert.match(source, /normalizeMetrikaId\(get\('yandex_metrika_id'\)\)/)
  assert.doesNotMatch(source, /DEFAULT_METRIKA_ID|script\.innerHTML/)
})
