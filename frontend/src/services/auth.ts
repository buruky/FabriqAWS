// TODO: wire to whichever auth backend is chosen (Cognito, or keep Supabase).
// See FRONTEND_REBUILD_SPEC.md "Open decisions to resolve before scaffolding".
// Kept as its own module (rather than folded into context/UserContext.tsx) so
// the actual network calls stay separate from React state, matching the
// current app's hooks/services split.
export {}
