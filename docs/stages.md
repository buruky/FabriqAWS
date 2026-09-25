# Stages

| Stage | Status | Date | Notes |
|---|---|---|---|
| 0 Local React + mock data | done | 2026-09-24 | Lighthouse mobile: Perf 91, Accessibility 92, Best Practices 100, SEO 83 (updated after removing Landing hero image) |
| 1 S3 static hosting | done | 2026-09-25 | Bucket `fabriq-wardrobe-buruky`, us-east-2, console-only (no CLI). Endpoint: http://fabriq-wardrobe-buruky.s3-website.us-east-2.amazonaws.com |
| 2 CloudFront | blocked | 2026-09-25 | Blocked on AWS account verification (Basic Support case opened, category "Other Account Issues") before CloudFront distributions can be created. Config progress: distribution "fabriq-wardrobe" drafted (not created) with S3 REST origin + OAC per Option B below. |
| 3 IAM sandbox | not started | | |
| 4 Compute decision | not started | | |
| 5 Hello world API | not started | | |
| 6 Frontend fetches API | not started | | |
| 7 Database | not started | | |
| 8 Auth standalone | not started | | |
| 9 Auth on API | not started | | |
| 10 Login UI end to end | not started | | |
| 11+ IaC, CI, monitoring | not started | | |

## Decisions
<!-- one line per decision: stage, choice, options considered -->
- Stage 1: CLI access = console-only for this stage (Option A), deferring any IAM user/Identity Center setup to Stage 3. Options considered: console-only, minimal scoped IAM user, IAM Identity Center.
- Stage 1: region = us-east-2 (Ohio), chosen for simplicity over exact latency optimization; owner is West Coast. Acceptable per stage-gate guidance since CloudFront (Stage 2) will front it with edge caching regardless of origin region.
- Stage 2: origin type = S3 REST endpoint + Origin Access Control, bucket made private (Option B), over reusing the public S3 website endpoint (Option A). Trade-off accepted: deep-link SPA fallback must be reconfigured as a CloudFront custom error response (403 → /index.html, 200 override) instead of reusing S3's error-document setting from Stage 1.

## Accepted limitations
- Stage 0 (resolved): LCP was 5.6s (Performance 78/100) from the uncompressed `accent.jpg` hero image (~400KB) on Landing. Image removed from Landing entirely; LCP dropped to 3.2s, Performance to 91/100. FCP (2.2s) is now the next-largest opportunity if this gets revisited later — not addressed now.
- Stage 1 (resolved, bug found during testing): `crypto.randomUUID()` was called at module load in `services/clothing.ts` and `services/outfits.ts` for mock-data IDs. That API is unavailable outside a secure context (HTTPS or localhost), so it silently crashed the whole app on the plain-HTTP S3 endpoint before React could render anything (blank page, no visible error without opening DevTools). Fixed with a shared `services/id.ts` helper that feature-detects `crypto.randomUUID` and falls back to a `Math.random()`-based id otherwise. Worth remembering: anything that worked fine in local dev/preview (both secure contexts via localhost) can still break the first time it's tested on real infrastructure without HTTPS — this is exactly why Stage 1 tests on real hosting before Stage 2 adds HTTPS.
- Stage 1: account uses AWS Builder ID (social login) on a simplified/newer AWS console layout (\"Console Dot Dream\", credit-based free tier: $120 over 182 days), not a classic root email+password account. Classic IAM (Roles/Policies/IAM users) is locked behind \"Activate advanced features\", not activated. MFA was set on the Builder ID profile's Security page instead of the classic root security-credentials page. Revisit if Stage 3 (formal IAM sandbox) behaves differently under this account type than the stage-gate skill's default assumes.
