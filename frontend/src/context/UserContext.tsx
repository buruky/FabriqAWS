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
// This provider exists so pages can render against the real shape now;
// login/register throw until that decision is made and wired in.
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading] = useState(false)

  const login: UserContextValue['login'] = async () => {
    throw new Error('Auth backend not yet decided — see FRONTEND_REBUILD_SPEC.md')
  }

  const register: UserContextValue['register'] = async () => {
    throw new Error('Auth backend not yet decided — see FRONTEND_REBUILD_SPEC.md')
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
