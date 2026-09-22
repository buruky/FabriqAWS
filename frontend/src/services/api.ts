// Base API client. Points at VITE_API_BASE_URL, which is safe to expose to the
// client (it's just a URL) — actual credentials/secrets never belong in a
// VITE_-prefixed var. See .env.example and FRONTEND_REBUILD_SPEC.md #2.2.3.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}
