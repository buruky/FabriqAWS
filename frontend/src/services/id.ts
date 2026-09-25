// Shared id helper for the Stage 0/1 mock services (clothing.ts, outfits.ts).
// Prefers crypto.randomUUID when available, but that API only exists in a
// "secure context" (HTTPS or localhost) and is undefined otherwise — which
// is how this app is served during AWS Stage 1 (S3 static website endpoint,
// plain HTTP; CloudFront/HTTPS lands in Stage 2). Falls back to a
// Math.random()-based id there: fine for mock data uniqueness, not
// cryptographically meaningful.
export function generateId(prefix: string): string {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : randomFallbackId()
  return `${prefix}-${id}`
}

function randomFallbackId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
