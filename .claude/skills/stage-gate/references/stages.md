# Per-stage defaults

Starting points only. Adapt to decisions recorded in `docs/stages.md`. Anything in brackets depends on a choice the developer has not made yet.

## Stage 0: Local React with mock data
- Primitive test: `npm run build` then `npm run preview`, open on desktop and a phone (same network or devtools device mode).
- Exit criteria:
  - `npm run build` succeeds with no TypeScript errors.
  - Every route (landing, wardrobe, outfits, account) renders from mock data, and refreshing on a deep link works in preview.
  - Mock data lives in one place with a shape close to what the API will return, so Stage 6 is a swap, not a rewrite.
  - Lighthouse mobile performance score recorded as a baseline.
- Cost: none.

## Stage 1: S3 static hosting
- Prerequisite outside the app: AWS Budgets alarm set at a low amount, root account has MFA.
- Primitive test: `curl -I http://<bucket>.s3-website-<region>.amazonaws.com`
- Exit criteria:
  - Website endpoint returns 200 and the app loads.
  - Deep link (e.g. /wardrobe) loads on refresh. S3 website hosting needs the error document set to index.html for this; know why.
  - Bucket policy allows only `s3:GetObject` on the bucket's objects, nothing else public.
  - Can explain what Block Public Access did and why it had to change.
- Cost: free tier, pennies after.

## Stage 2: CloudFront
- Decision to surface: origin type (S3 website endpoint vs S3 REST endpoint with Origin Access Control and a private bucket).
- Primitive test: `curl -I https://<id>.cloudfront.net`
- Exit criteria:
  - HTTPS returns 200; HTTP redirects to HTTPS.
  - Second request shows `x-cache: Hit from cloudfront`.
  - After a new build is uploaded, an invalidation (or hashed asset names plus short index.html caching) serves the new version.
  - Deep links work (custom error responses mapping 403/404 to /index.html with 200, if using a private bucket).
  - If OAC chosen: direct S3 URL returns 403.
  - Compression on; JS/CSS served with long cache headers, index.html with short.
- Cost: free tier covers a lot; custom domain adds Route 53 hosted zone cost and needs an ACM cert in us-east-1.

## Stage 3: IAM sandbox (separate from the app)
- Decision to surface: IAM user with access keys vs IAM Identity Center for CLI access.
- Primitive test: `aws sts get-caller-identity --profile <sandbox>` plus one allowed and one denied call.
- Exit criteria:
  - Daily work no longer uses root.
  - A policy scoped to one action on one resource ARN exists.
  - Allowed call succeeds; a call outside the policy returns AccessDenied.
  - Can read a policy statement aloud: effect, action, resource, condition.
- Cost: none.

## Stage 4: Compute decision
- No build. Output is a decision.
- Exit criteria:
  - Options compared (e.g. [Lambda + API Gateway], [ECS Fargate], [EC2], [App Runner]) on cost at this scale, idle cost, cold starts, operational work, and learning value.
  - Choice recorded in `docs/stages.md` with the reason.
  - Stages 5 to 7 adjusted in `docs/stages.md` if the choice changes them.

## Stage 5: Hello world API
- Primitive test: curl or Postman only. No React.
- Exit criteria:
  - `curl -i <endpoint>/health` returns 200, `content-type: application/json`, static JSON body.
  - Unknown route returns a 4xx, not a 500.
  - The invocation appears in CloudWatch logs.
  - Execution role has only the permissions it needs (logs, for now).
- Cost: [depends on Stage 4 choice; flag idle cost if not serverless].

## Stage 6: Frontend fetches the API
- Primitive test: browser devtools network tab.
- Exit criteria:
  - Mock data replaced by a fetch to the API; API URL comes from an env variable, not hardcoded.
  - CORS allows only the CloudFront origin (and localhost for dev), preflight succeeds.
  - Loading and error states render; app does not crash when the API is down.
  - Works from the deployed CloudFront site on a phone.

## Stage 7: Database
- Decision to surface: [relational (RDS/Aurora) vs key-value (DynamoDB)], driven by access patterns: clothes and outfits with tags, many-to-many outfit to clothes, sorting by multiple fields.
- Primitive test, part 1: write and read directly via console, CLI, or a DB client. No API.
- Primitive test, part 2: curl the API endpoints.
- Exit criteria:
  - Access patterns written down first (e.g. list clothes by user sorted by date, get outfit with its clothes, filter by tag).
  - Standalone create, read, update, delete works.
  - Compute role scoped to this one table or database.
  - curl create then read returns the same item; data survives a redeploy.
- Cost: flag heavily. RDS bills while idle; DynamoDB on-demand does not.

## Stage 8: Auth standalone
- Decision to surface: [Cognito vs alternatives], hosted UI vs custom forms.
- Primitive test: CLI only (e.g. sign-up, confirm, initiate-auth).
- Exit criteria:
  - A test user can sign up, confirm, and log in from the CLI.
  - Login returns ID, access, and refresh tokens.
  - Can decode a token locally and explain the claims (sub, aud or client_id, exp, token_use).
- Cost: free tier covers this scale.

## Stage 9: Auth enforced on the API
- Primitive test: curl, no React.
- Exit criteria:
  - No token: 401.
  - Valid token: 200.
  - Tampered or expired token: 401.
  - Backend reads the user id from the verified token, not from the request body, and a user cannot read another user's items.

## Stage 10: Login UI end to end
- Primitive test: the real app on a phone.
- Exit criteria:
  - Sign up, log in, add a clothing item, build an outfit, refresh (still logged in), log out (token cleared).
  - Token storage choice made knowingly and recorded.
  - Tokens do not appear in logs or URLs.
  - Lighthouse mobile score compared against the Stage 0 baseline.

## Stage 11+: IaC, CI, monitoring
- Decision to surface: [Terraform vs CDK vs SAM], CI auth method (GitHub OIDC role vs stored keys; OIDC avoids long-lived keys).
- Exit criteria:
  - Console-built resources destroyed and recreated from code; every earlier stage's exit test passes again.
  - Push to main builds and deploys without manual steps.
  - A CloudWatch alarm fires on a forced error and notifies.
  - For the EC2/ECS comparison: same exit tests pass against the second backend, and cost and latency differences recorded.
