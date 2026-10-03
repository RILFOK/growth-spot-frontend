// Frontend permission checks affect presentation only; the API enforces access.
const VALID_ROLES = new Set(['admin', 'moderator', 'manager', 'viewer'])
const ROLE_PERMISSIONS = Object.freeze({
  admin: ['settings.edit', 'leads.delete', 'leads.edit'],
  moderator: ['leads.delete', 'leads.edit'],
  manager: ['leads.edit'],
  viewer: [],
})

export const getUserRole = (user) =>
  VALID_ROLES.has(user?.role) ? user.role : null

// Keep a restricted cache of display fields rather than persisting API payloads.
export const normalizeAuthUser = (raw) => {
  if (!raw || typeof raw !== 'object' || !getUserRole(raw) ||
      typeof raw.email !== 'string' || !raw.email ||
      raw.id === null || raw.id === undefined) return null

  return {
    id: raw.id,
    email: raw.email,
    role: raw.role,
    name: typeof raw.name === 'string' ? raw.name : null,
    nickname: typeof raw.nickname === 'string' ? raw.nickname : null,
    twoFactorEnabled: raw.twoFactorEnabled === true,
  }
}

export const hasRolePermission = (user, permission) =>
  (ROLE_PERMISSIONS[getUserRole(user)] || []).includes(permission)

export const isAdminUser = (user) => getUserRole(user) === 'admin'

// Clean credentials persisted by previous public versions, without logging them.
export const clearLegacyTotpSecrets = (storage) => {
  const keys = []
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key?.startsWith('totp_secret_')) keys.push(key)
  }
  for (const key of keys) storage.removeItem(key)
  return keys.length
}
