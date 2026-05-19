# Concert Cost Tracker

Track concert spending, fun ratings, and value per dollar. Built with Next.js, Tailwind CSS, daisyUI, Supabase, and Recharts.

## Local setup

1. Copy `.env.local.example` to `.env.local`.
2. In [Supabase](https://supabase.com), open your **ConcertCosts** project → **Connect** or **Settings → API Keys**.
3. Copy the **Project URL** and **publishable** key (or legacy anon public key) into `.env.local`.
4. Install dependencies: `npm install`
5. Start the app: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

After changing `.env.local`, stop the dev server (Ctrl+C) and run `npm run dev` again.

## Email sign-up

If sign-up requires email confirmation, check your inbox or turn off “Confirm email” under Supabase → Authentication → Providers → Email for easier local testing.
