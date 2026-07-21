# Eulwangri Donghae Homepage

Project scaffold for the Eulwangri Donghae homepage.

## Local setup

```bash
npm install
npm run dev
```

## Supabase connection

Create `.env.local` from `.env.example` and fill only browser-safe values.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_USE_ADMIN_EDGE_FUNCTIONS=false
VITE_SITE_URL=https://eulwangri-donghae-homepage.vercel.app/
```

Do not place a Supabase `service_role` key in this frontend project.

The optional review table SQL is prepared at:

```text
supabase/migrations/20260719123000_create_homepage_reviews.sql
supabase/migrations/20260719130500_add_review_source_fields.sql
supabase/migrations/20260720001000_add_admin_reviews_and_photos.sql
supabase/migrations/20260720223000_harden_admin_reviews_security.sql
supabase/migrations/20260720230000_harden_admin_boundary_and_rate_limit.sql
```

Review registration rules and SQL examples are documented at:

```text
docs/review-operations.md
```

Launch, search registration, share preview, and custom-domain tasks are documented at:

```text
docs/launch-checklist.md
```

Security hardening notes are documented at:

```text
docs/security-hardening.md
```

## Review admin app

The hidden mobile admin app is available after deployment at:

```text
https://eulwangri-donghae-homepage.vercel.app/admin
```

The legacy hash route still works for old bookmarks:

```text
https://eulwangri-donghae-homepage.vercel.app/#admin
```

Use `/admin` as the canonical admin URL on Vercel so the server can apply `Cache-Control: no-store`.

It uses Supabase Auth, RLS, and the private `review-photos` storage bucket created by the security migrations. Keep using only the browser-safe anon key in deployment secrets.

For the highest security boundary, deploy `supabase/functions/admin-review` and set:

```text
VITE_USE_ADMIN_EDGE_FUNCTIONS=true
```

## Vercel deployment

The repository includes `vercel.json` for Vite routing, SPA rewrites, and production HTTP security headers.

Vercel environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_USE_ADMIN_EDGE_FUNCTIONS=true
VITE_SITE_URL=https://eulwangri-donghae-homepage.vercel.app/
```

Build settings:

```text
Framework Preset: Vite
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
```

After Vercel deploys, verify HTTP response headers:

```bash
npm run security:headers -- https://eulwangri-donghae-homepage.vercel.app/
```

The manual GitHub workflow `Deploy Supabase security boundary` can apply the Supabase migrations
and deploy the Edge Function when these repository secrets are configured:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_DB_URL
```

## GitHub Pages deployment

GitHub Pages remains available as a fallback deployment, but it cannot set custom HTTP response headers.
Use Vercel as production when the security header score matters.

The repository includes `.github/workflows/deploy-pages.yml`.

The workflow runs the repository and Supabase boundary security checks before building:

```bash
npm run security:check
npm run security:supabase
```

In GitHub, set repository secrets before production deployment:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_USE_ADMIN_EDGE_FUNCTIONS
```

Then open `Settings > Pages` and select `GitHub Actions` as the Pages source. The site URL will be:

```text
https://sungjun7675.github.io/eulwangri-donghae-homepage/
```

If the first workflow run fails at `Configure Pages`, enable the Pages source above and re-run the workflow.

## GitHub remote

Target account:

```text
https://github.com/sungjun7675
```

Expected repository name:

```text
eulwangri-donghae-homepage
```
