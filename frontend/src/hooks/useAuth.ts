import { useUserContext } from '../context/UserContext'

// Thin wrapper over UserContext, matching the current app's hooks/services split.
export function useAuth() {
  return useUserContext()
}
