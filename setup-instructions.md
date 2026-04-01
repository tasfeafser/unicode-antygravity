# Service Integrations Setup

This boilerplate includes dependencies for several powerful services. Here's how to set each of them up:

## 1. Clerk (Authentication)
1. Go to [Clerk](https://clerk.com/) and create an application.
2. Copy your keys and add them to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Wrap your root layout with `<ClerkProvider>` and use the provided middleware.

## 2. Supabase (Database)
1. Go to [Supabase](https://supabase.com/) and create a project.
2. Under Settings > API, copy your Project URL and service role key.
3. Add them to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Setup the Supabase SSR client in `@/lib/supabase.ts`.

## 3. Anthropic (AI)
1. Get an API key from the [Anthropic Console](https://console.anthropic.com/).
2. Add it to `.env.local`:
   - `ANTHROPIC_API_KEY`
3. Use the `anthropic` package to call Claude models.

## 4. Pinecone (Vector Database)
1. Create an index on [Pinecone](https://pinecone.io).
2. Get your API key.
3. Add it to `.env.local`:
   - `PINECONE_API_KEY`

## 5. Upstash (Redis / Rate Limiting)
1. Create a database on [Upstash Redis](https://upstash.com/).
2. Find your REST URL and Token.
3. Add them to `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## 6. Stripe (Payments)
1. Create an account on [Stripe](https://stripe.com).
2. Copy your publishable and secret keys from the Developer dashboard.
3. Add them to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

## 7. Resend (Email)
1. Create an API key on [Resend](https://resend.com/).
2. Add it to `.env.local`:
   - `RESEND_API_KEY`

## 8. PostHog (Analytics)
1. Create a project on [PostHog](https://posthog.com).
2. Copy your project API key and host URL.
3. Add them to `.env.local`:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`

## 9. Sentry (Error Tracking)
1. Create a Next.js project on [Sentry](https://sentry.io).
2. The setup wizard (`npx @sentry/wizard@latest -i nextjs`) is recommended, or manually add your DSN to `.env.local`:
   - `SENTRY_DSN`
