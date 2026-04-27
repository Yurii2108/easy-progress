# Easy Progress

Easy Progress is a SaaS task planner with notes, folders, progress tracking, reminders, and shareable plans.

## Stack

- Next.js App Router
- React + TypeScript
- Supabase Auth + Postgres + Row Level Security
- Zustand for lightweight client state
- Vercel deployment

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Create a Supabase project, copy the project URL and anon key into `.env.local`.

4. Run the SQL in `supabase/schema.sql` inside the Supabase SQL Editor.

5. Start locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deployment

1. Create a GitHub repository, for example `easy-progress`.
2. Initialize and push:

```bash
git init
git add .
git commit -m "Initial Easy Progress SaaS scaffold"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/easy-progress.git
git push -u origin main
```

3. In Vercel, import the GitHub repository.
4. Add these environment variables in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

5. Deploy. Every push to `main` will trigger a production deployment, and pull requests will get preview URLs.

Example URLs:

```txt
https://easy-progress.vercel.app
https://easy-progress.vercel.app/dashboard
https://easy-progress.vercel.app/plan/demo
```

## Sharing Model

Share URLs follow this pattern:

```txt
https://easyprogress.app/plan/<share_token>
```

Each plan can be:

- `private`: only owner and invited collaborators
- `link_view`: anyone with link can view
- `link_edit`: anyone with link can edit

## Production Checklist

- Enable Supabase email or Google Auth provider.
- Keep RLS enabled on all exposed tables.
- Add a custom Vercel domain.
- Add error monitoring later, for example Sentry.
- Add analytics later, for example Vercel Analytics or PostHog.

## References

- Vercel Next.js deployment: https://vercel.com/docs/frameworks/nextjs
- Vercel Git deployments: https://vercel.com/docs/deployments
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
Deployment trigger update.
