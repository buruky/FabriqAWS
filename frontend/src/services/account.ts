// Stage 0 mock data layer for the account profile — name, photo, sizes,
// style preferences, settings. Kept separate from context/UserContext.tsx,
// which only holds the bare auth identity (id/email), matching CLAUDE.md's
// "Account" field list being broader than login state.
export interface AccountSizes {
  tops?: string
  bottoms?: string
  shoes?: string
  outerwear?: string
}

export interface AccountSettings {
  emailNotifications: boolean
}

export interface AccountProfile {
  name: string
  photoUrl?: string
  sizes: AccountSizes
  stylePreferences: string[]
  settings: AccountSettings
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let profile: AccountProfile = {
  name: 'Jordan Avery',
  photoUrl: undefined,
  sizes: { tops: 'M', bottoms: '30x32', shoes: '9', outerwear: 'M' },
  stylePreferences: ['minimalist', 'streetwear'],
  settings: { emailNotifications: true },
}

function cloneProfile(source: AccountProfile): AccountProfile {
  return {
    ...source,
    sizes: { ...source.sizes },
    stylePreferences: [...source.stylePreferences],
    settings: { ...source.settings },
  }
}

export async function getAccountProfile(): Promise<AccountProfile> {
  return delay(cloneProfile(profile))
}

export async function updateAccountProfile(patch: Partial<AccountProfile>): Promise<AccountProfile> {
  profile = {
    ...profile,
    ...patch,
    sizes: { ...profile.sizes, ...(patch.sizes ?? {}) },
    settings: { ...profile.settings, ...(patch.settings ?? {}) },
  }
  return delay(cloneProfile(profile))
}
