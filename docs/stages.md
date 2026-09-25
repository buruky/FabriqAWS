# Stages

| Stage | Status | Date | Notes |
|---|---|---|---|
| 0 Local React + mock data | done | 2026-09-24 | Lighthouse mobile: Perf 91, Accessibility 92, Best Practices 100, SEO 83 (updated after removing Landing hero image) |
| 1 S3 static hosting | not started | | |
| 2 CloudFront | not started | | |
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

## Accepted limitations
- Stage 0 (resolved): LCP was 5.6s (Performance 78/100) from the uncompressed `accent.jpg` hero image (~400KB) on Landing. Image removed from Landing entirely; LCP dropped to 3.2s, Performance to 91/100. FCP (2.2s) is now the next-largest opportunity if this gets revisited later — not addressed now.
