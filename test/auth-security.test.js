import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  normalizeAuthUser, getUserRole, hasRolePermission, isAdminUser,
  clearLegacyTotpSecrets,
} from '../src/utils/authSecurity.js'

test('missing, unknown, or incomplete server roles never become admin', () => {
  for (const role of [undefined, null, '', 'owner', 'Admin']) {
    const candidate = { id: 7, email: 'person@example.invalid', role }
    assert.equal(normalizeAuthUser(candidate), null)
    assert.equal(getUserRole(candidate), null)
    assert.equal(hasRolePermission(candidate, 'settings.edit'), false)
    assert.equal(isAdminUser(candidate), false)
  }
  assert.equal(isAdminUser(null), false)
})

test('validated API users keep only display fields', () => {
  const user = normalizeAuthUser({
    id: 7, email: 'person@example.invalid', role: 'manager', name: 'Test',
    twoFactorEnabled: true, totp_secret: 'must-not-be-cached', password: 'never',
  })
  assert.deepEqual(user, {
    id: 7, email: 'person@example.invalid', role: 'manager', name: 'Test',
    nickname: null, twoFactorEnabled: true,
  })
  assert.equal(hasRolePermission(user, 'settings.edit'), false)
  assert.equal(hasRolePermission({ role: 'admin' }, 'settings.edit'), true)
})

test('legacy browser TOTP credentials are removed without touching session token', () => {
  const map = new Map([
    ['token', 'session-token'], ['totp_secret_a@example.invalid', 'old-secret-a'],
    ['admin_user', '{}'], ['totp_secret_b@example.invalid', 'old-secret-b'],
  ])
  const storage = {
    get length() { return map.size },
    key(i) { return [...map.keys()][i] ?? null },
    removeItem(key) { map.delete(key) },
  }
  assert.equal(clearLegacyTotpSecrets(storage), 2)
  assert.equal(map.get('token'), 'session-token')
  assert.equal(map.has('totp_secret_a@example.invalid'), false)
  assert.equal(map.has('totp_secret_b@example.invalid'), false)
})

test('protected UI never restores an admin role from a missing server role', () => {
  const auth = readFileSync(new URL('../src/context/AuthContext.jsx', import.meta.url), 'utf8')
  const dash = readFileSync(new URL('../src/pages/Admin/Dashboard.jsx', import.meta.url), 'utf8')
  const twoFactor = readFileSync(new URL('../src/components/admin/TwoFactorSetup.jsx', import.meta.url), 'utf8')
  assert.match(auth, /api\.get\('\/auth\/me'\)/)
  assert.doesNotMatch(auth, /totp_secret_/)
  assert.doesNotMatch(dash, /totp_secret_/)
  assert.doesNotMatch(twoFactor, /totp_secret_|liveCode|getCurrentTOTPCode/)
  assert.doesNotMatch(auth, /role\s*\|\|\s*['"]admin['"]/)
  assert.doesNotMatch(dash, /role\s*\|\|\s*['"]admin['"]/)
})
