import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  email: string
}

interface UserContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

// Auth backend (Cognito vs. keeping Supabase) is an open decision — see
// FRONTEND_REBUILD_SPEC.md "Open decisions to resolve before scaffolding".
// Until that's wired in, login/register unconditionally fake a session, the
// same way services/clothing.ts, services/outfits.ts, and services/account.ts
// serve mock data during Stage 0 (see CLAUDE.md) — this runs the same in dev,
// build/preview, and the deployed Stage 1 site. Password is intentionally
// ignored. Once a real backend/auth provider is chosen, this fake path gets
// replaced with real calls into services/auth.ts.
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading] = useState(false)

  const login: UserContextValue['login'] = async (email) => {
    setUser({ id: 'dev-user', email })
  }

  const register: UserContextValue['register'] = async (email) => {
    setUser({ id: 'dev-user', email })
  }

  const logout: UserContextValue['logout'] = async () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used within a UserProvider')
  return ctx
}
