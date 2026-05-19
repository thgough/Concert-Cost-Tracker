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

## Features

### Insights Hub (`/dashboard`)

The dashboard is now an **Insights** hub with a time-period filter (all time, this year, last 12 months), auto-generated insight cards, and tabs for **Overview** (stats + category chart), **Trends** (monthly spending line chart), and **Leaderboard** (sortable table of your shows).

### Concert Compare (`/compare`)

Pick any two logged concerts and see them side by side with deltas for total cost, fun rating, cost per hour, Fun Points per $100, distance, hours, and a category-by-category breakdown.

### Budget Goals (`/budget`)

Set a yearly concert budget stored in Supabase (`user_budgets`, row-level security per user). The page shows progress for the selected year, stat cards (budget, spent, remaining, % used), and a pace insight based on your average spend per show.

## Email sign-up

If sign-up requires email confirmation, check your inbox or turn off “Confirm email” under Supabase → Authentication → Providers → Email for easier local testing.
