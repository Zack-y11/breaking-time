# Breaking Time Copilot Instructions

## Build, lint, and test commands
- Install dependencies (preferred): `bun install` (fallback: `npm install`)
- Start dev server: `bun start`
- Android native/dev build: `bun android`
- iOS native/dev build: `bun ios`
- Web dev server: `bun web`
- Full lint: `bun lint`
- Lint a single file: `bunx eslint app\auth\onboarding.tsx`
- Tests: no automated test script or test files are currently configured, so there is no single-test command yet.

## High-level architecture
- **App shell and routing:** Expo Router (`app/`). `app/_layout.tsx` is the root orchestrator: loads fonts, initializes auth state, enforces auth/onboarding redirects, and registers background score sync after sign-in.
- **State model:** Zustand stores in `store/` separate concerns: `authStore` (session/user/onboarding), `settingsStore` (tracked package names), `groupStore` (groups/leaderboard state).
- **Score pipeline:** `lib/scoreService.ts` gets Android usage stats, computes junk-time score, and submits reports to Supabase (`usage_reports`). It also defines the `expo-task-manager` background task at module scope and registers 15-minute background fetch.
- **Platform integration:** `modules/usage-stats/` is a local Expo native module (Kotlin on Android) used for `PACKAGE_USAGE_STATS` access.
- **Backend/data:** Supabase client in `lib/supabase.ts` (SecureStore-backed auth persistence). Database schema, RLS, policies, and realtime tables are in `supabase/migrations/001_initial_schema.sql`.

## Key conventions for this repo
- **Android-first usage tracking:** Always gate usage-stats calls with `Platform.OS === "android"` and use dynamic imports (e.g. `const UsageStats = (await import("@/modules/usage-stats")).default`).
- **Milliseconds are the source of truth:** Keep score/time values in ms across services and DB; only format for UI display via `formatJunkTime` in `lib/titleSystem.ts`.
- **Task registration location matters:** Keep `TaskManager.defineTask(...)` at module top-level (`lib/scoreService.ts`), not inside components.
- **Supabase auth env vars:** Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` (matching `lib/supabase.ts`).
- **RLS is mandatory:** New Supabase tables should be added through migrations with RLS enabled and explicit policies.
- **Path/import style:** Use the `@/` alias configured in `tsconfig.json` for app imports.
- **Native rebuild rule:** After native module changes or dependency wiring changes, use full `bun android`; JS reload is not enough.
- **Design/copy source of truth:** Follow `CLAUDE.md` + `GEMINI.md` and `stitch/*refined_typography` assets. Use in-app terminology consistently (e.g., **The Hierarchy**, **Circles**, **The Accountability Pit**).
