# Breaking Time - Gemini Instructional Context

Breaking Time is a gamified screen time reduction app where friends compete to spend **less** time on "junk content" (TikTok, Instagram, YouTube Shorts, etc.). It features social competition, "shame" loops, and environmental rewards (planting virtual and real trees).

## 🚀 Project Overview

- **Tagline:** "Reclaim your time. Grow your forest."
- **Primary Platform:** Android (Native usage tracking).
- **Secondary Platform:** iOS (Self-report mode due to API limitations).
- **Core Tech Stack:**
  - **Framework:** Expo SDK 54 (React Native) with `expo-router` v6.
  - **Language:** TypeScript (Strict).
  - **Native Module:** Custom Expo Module in Kotlin (`modules/usage-stats/`) for Android usage data.
  - **Backend:** Supabase (Auth, Postgres, Realtime, Edge Functions).
  - **State Management:** Zustand (`store/`).
  - **Animations:** React Native Reanimated v4.
  - **Package Manager:** `bun` (preferred).

## 🏗️ Architecture & Development Conventions

### Native Tracking (Android-First)
The app relies on the `PACKAGE_USAGE_STATS` permission on Android. The custom module `modules/usage-stats` provides the bridge to native `UsageStatsManager`.
- **Note:** Always wrap native module calls with `Platform.OS === 'android'` checks.
- **Dynamic Import:** Import the native module dynamically to avoid crashes on iOS:
  ```ts
  const UsageStats = (await import('@/modules/usage-stats')).default;
  ```

### Design System: "Organic Brutalism"
- **Colors:** Sage green (`#325f3f`), NPC purple (`#5443b6`), Parchment (`#f8faf6`).
- **Typography:** **Manrope** (Headlines), **Inter** (Body), **Space Grotesk** (Labels).
- **UI Rules:**
  - No 1px borders (use color shifts).
  - No pure black (use `on-surface` `#1b1c1c`).
  - Minimum `rounded-2xl` (16px) corners.
  - Floating pill-shaped bottom nav with glassmorphism.

### State & Logic
- **Auth:** Managed via `store/authStore.ts` using Supabase Auth.
- **Onboarding:** Required before reaching `(tabs)`. Tracks completion in `AsyncStorage` and `authStore`.
- **Background Sync:** Uses `expo-background-fetch` and `expo-task-manager` to sync usage data every 15 minutes.
- **Server Logic:** No separate Node.js server; all backend logic resides in Supabase Edge Functions.

## 🛠️ Key Commands

| Command | Action |
|---|---|
| `bun install` | Install dependencies |
| `bun android` | Run full native build for Android (required for native changes) |
| `bun start` | Start Expo development server (JS-only updates) |
| `bun lint` | Run ESLint |
| `bun reset-project` | Reset to a blank Expo template (use with caution) |

## 📂 Project Structure

- `app/`: Expo Router file-based routing.
  - `(tabs)/`: Main app screens (Home, Hierarchy, Circles, Profile).
  - `auth/`: Sign-in, Sign-up, and Onboarding.
  - `group/`, `recap/`: Secondary app flows.
- `modules/usage-stats/`: Native Android Kotlin module.
- `lib/`: Core services (Supabase, Scoring, Junk Apps list, Notifications).
- `store/`: Zustand state stores.
- `supabase/`: Migrations and Edge Function definitions.
- `stitch/`: (External Reference) Design source of truth (PNGs, MDs).

## ⚠️ Important Files

1. **`CLAUDE.md`**: The "Project Bible". Contains exhaustive details on every system, naming convention, and rule. **Read this first for any implementation task.**
2. **`lib/supabase.ts`**: Client configuration.
3. **`lib/junkApps.ts`**: The list of tracked packages.
4. **`app/_layout.tsx`**: Root provider, font loading, and auth-guard logic.

## 📝 Ongoing Development Notes

- **Realtime:** Subscriptions are critical for "The Hierarchy" (leaderboard) and "The Neighborhood" (real-time tree growth).
- **Shame Logic:** Handled via Supabase Edge Functions triggering push notifications.
- **iOS Fallback:** iOS users must have a functional "Self-report" UI as a placeholder for the missing native API.
