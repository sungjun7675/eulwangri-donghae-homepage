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
```

Do not place a Supabase `service_role` key in this frontend project.

The optional review table SQL is prepared at:

```text
supabase/migrations/20260719123000_create_homepage_reviews.sql
supabase/migrations/20260719130500_add_review_source_fields.sql
supabase/migrations/20260720001000_add_admin_reviews_and_photos.sql
```

Review registration rules and SQL examples are documented at:

```text
docs/review-operations.md
```

## Review admin app

The hidden mobile admin app is available after deployment at:

```text
https://sungjun7675.github.io/eulwangri-donghae-homepage/#admin
```

It uses Supabase Auth, RLS, and the public `review-photos` storage bucket created by the admin migration. Keep using only the browser-safe anon key in GitHub secrets.

## GitHub Pages deployment

The repository includes `.github/workflows/deploy-pages.yml`.

In GitHub, set repository secrets before production deployment:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
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
