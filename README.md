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
```

Review registration rules and SQL examples are documented at:

```text
docs/review-operations.md
```

## GitHub remote

Target account:

```text
https://github.com/sungjun7675
```

Expected repository name:

```text
eulwangri-donghae-homepage
```
