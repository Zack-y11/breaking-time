# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Breaking Time — Project Bible

## What This App Is

Friends compete to spend **less** time on junk content (TikTok, Instagram, YouTube Shorts, etc.). The less you scroll, the better you rank. Your group shames you when you lose and plants virtual trees together when you win — some of which become real trees via charity donations.

**Tagline:** "Reclaim your time. Grow your forest."

**Core loops:**
- Shame loop → losing → embarrassed → close TikTok → win
- Pride loop → winning → stay on top → keep grinding
- Chaos loop → funny moment → share → bring a new friend

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54, expo-router v6, New Architecture enabled |
| Language | TypeScript (strict) |
| Native module | Expo Modules API (Kotlin) — `modules/usage-stats/` |
| Backend | Supabase (Postgres, Realtime, Auth, Edge Functions) |
| State | Zustand (`store/`) |
| Animations | react-native-reanimated v4 (already installed) |
| Notifications | expo-notifications |
| Background sync | expo-background-fetch + expo-task-manager |
| Share cards | react-native-view-shot |
| Package manager | Bun |

**No separate backend server for MVP.** Supabase Edge Functions handle all server-side logic (notification triggers, badge awards, cron jobs).

---

## Project Structure

```
breaking-time/
  app/
    _layout.tsx                  ← root layout, auth guard
    (tabs)/
      _layout.tsx                ← 4 tabs: Home, Leaderboard, Groups, Profile
      index.tsx                  ← Home screen (score + neighborhood preview)
      leaderboard.tsx            ← "The Hierarchy" screen
      groups.tsx                 ← "The Accountability Pit" screen
      profile.tsx                ← Profile, badges, weekly recap, settings
    auth/
      sign-in.tsx
      sign-up.tsx
      onboarding.tsx             ← permission + app picker
    group/
      [id].tsx
      create.tsx
      join.tsx
    recap/
      [week].tsx                 ← shareable weekly roast card

  modules/
    usage-stats/                 ← Android native module (Kotlin)
      android/.../UsageStatsModule.kt
      src/UsageStats.types.ts
      src/UsageStatsModule.ts
      index.ts

  lib/
    supabase.ts                  ← Supabase client (SecureStore auth)
    scoreService.ts              ← UsageStats → score calculation
    titleSystem.ts               ← ms → brain rot title/emoji
    junkApps.ts                  ← preset package name list
    notificationService.ts       ← schedule + shame logic
    badgeEngine.ts               ← badge award logic
    neighborhoodService.ts       ← tree award/wilt + house condition

  store/
    authStore.ts                 ← session, user (Zustand)
    groupStore.ts                ← groups, leaderboard
    settingsStore.ts             ← tracked apps, preferences

  supabase/
    migrations/
      001_initial_schema.sql     ← all 14 tables + RLS + realtime
```

---

## Design System — "Organic Brutalism"

**Source of truth:** `stitch/` folder. Always refer to the screen PNGs and `DESIGN.md` files before implementing any UI. The `refined_typography` variants are the final versions to use.

### Design Files Reference

| Screen | File |
|---|---|
| UI Flow / App Map | `stitch/breaking_time_app_ui_flow.png/screen.png` |
| Home Screen | `stitch/home_the_neighborhood_refined_typography/` |
| Leaderboard | `stitch/leaderboard_refined_typography/` |
| Groups | `stitch/groups_refined_typography/` |
| Profile | `stitch/profile_refined_typography/` |
| Sign In / Onboarding | `stitch/sign_in_refined_typography/` |
| Design System (primary) | `stitch/sage_satire_refined/DESIGN.md` |
| Design System (alt) | `stitch/sage_satire/DESIGN.md` |

### Color Tokens

```
primary:                  #325f3f   ← sage green, success, growth
primary-container:        #4a7856   ← CTA gradient end
primary-fixed:            #d3e8d4   ← mint, winning energy
surface:                  #f8faf6   ← parchment base
surface-container-low:    #f2f4f0   ← card background
surface-container-lowest: #ffffff   ← inner card / floating
surface-container-high:   #eae8e7   ← bento tile
tertiary:                 #5443b6   ← NPC purple, shame, brain rot
tertiary-fixed:           #e5deff   ← shame chip background
on-tertiary-fixed:        #190064   ← shame chip text
on-surface:               #1b1c1c   ← primary text (never pure black)
on-surface-variant:       #414941   ← secondary text
outline-variant:          #c1c9bf   ← ghost borders (15% opacity only)
error:                    #ba1a1a   ← urgent loss, coral
```

### Typography

| Role | Font | Usage |
|---|---|---|
| Display / Headlines | **Manrope** (extrabold 800) | Big score, section titles, "The Hierarchy" |
| Body / Paragraphs | **Inter** | Descriptions, subtitles, body text |
| Labels / Badges | **Inter** or **Space Grotesk** | Status chips, counters, rank tags |

**Install these fonts:** `expo-font` with `useFonts({ Manrope_800ExtraBold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold })`.

### Layout Rules (NON-NEGOTIABLE)

1. **No 1px borders for sectioning.** Use background color shifts between surface tiers instead.
2. **No dividers/horizontal rules.** Use `spacing-6` (24px) or larger to separate blocks.
3. **No pure black.** Always use `on-surface` (#1b1c1c) for text.
4. **No sharp corners.** Minimum `rounded-xl` (16px). Prefer `rounded-2xl`, `rounded-3xl`.
5. **No flat CTAs.** Primary buttons use gradient: `#325f3f → #4a7856` at 135°.
6. **Glassmorphism for nav bar.** Bottom nav: `surface` at 70–80% opacity + `backdrop-blur-xl`. Floating pill shape, not full-width.
7. **Ghost borders only.** If a border is functionally required, use `outline-variant` at 15% opacity max.
8. **Asymmetric spacing is intentional.** Slightly larger top padding than bottom (e.g., p-top: 8, p-bottom: 6) feels premium.

### Component Patterns

**Bottom Navigation**
- Floating pill: `rounded-3xl`, glassmorphism, centered, 90% width
- Active tab: `bg-primary-fixed` pill highlight inside the nav
- Inactive tabs: `on-surface-variant` color, no background

**Cards**
- Outer wrap: `surface-container-low` with `rounded-3xl`
- Inner content: `surface-container-lowest` (white) with `rounded-[1.9rem]`
- Creates depth without shadows or borders — the "stacked paper" effect

**Shame/Accountability Chips**
- Background: `tertiary-fixed` (#e5deff)
- Text: `on-tertiary-fixed` (#190064)
- Font: `Space Grotesk` or `Inter`, bold, uppercase, tight tracking
- Examples: "🤡 Clown Moment", "🧠 Brain Rotted", "SCROLLING ZOMBIE"

**Rank Title Badges**
- Small pill on leaderboard rows
- Green variants for winners: `primary-fixed` bg
- Purple variants for losers: `tertiary-fixed` bg
- Examples from design: "ZEN", "UNBOTHERED SAGE", "FOCUS PRACTITIONER", "SCROLLING ZOMBIE", "NPC MODE"

**Bento Grid (Home screen)**
- Two equal `aspect-square` cards in a 2-col grid
- Left: streak (fire icon, primary color)
- Right: social/shame stat (purple/tertiary tone, `tertiary-fixed/40`)

**COPE + TAUNT Buttons (Leaderboard)**
- Appear ONLY on the current user's row when they are losing
- COPE: `secondary-container` background, subdued
- TAUNT: outline/ghost style
- Reaction emojis: skull 💀, clap 👏, clown 🤡, pressed 😤 — tap on opponent's row

---

## In-App Terminology (Use These Exact Names)

| Design Term | Do NOT call it |
|---|---|
| **The Hierarchy** | "Leaderboard" (in-app label) |
| **Circles** | "Groups" (in-app label) |
| **The Accountability Pit** | Groups screen header |
| **Sanctuary** | User's personal space/yard |
| **The Neighborhood** | Yard + group map |
| **Shame Queue** | Custom notification approval list |
| **Hall of Shame** | Bad badge section on Profile |
| **Notification Rituals** | Notification settings |
| **Enclave** | Private group variant |
| **Trees Planted** | Total clean-session trees |
| **Consistency Streak** | Personal daily streak |
| **Neighborhood Watch** | Friends currently losing |

---

## Brain Rot Title System

| Daily Junk Time | Title | Emoji |
|---|---|---|
| 0 min | Touched Grass | 🌿 |
| 1–15 min | Digital Monk / Unbothered Sage | 🧘 |
| 15–30 min | Functioning Human / Focus Practitioner | ✅ |
| 30–60 min | Mildly Cooked | 📱 |
| 1–2h | Chronically Online / Scrolling Zombie | 🌀 |
| 2–4h | Brain Rotted | 🧠 |
| 4h+ | NPC Mode Activated | 🤖 |

---

## Gamification Systems (All 9)

1. **Brain Rot Titles** — dynamic rank name based on daily junk ms
2. **Shame Notifications** — default system + user-created custom (140 chars, group approval queue, `{user}` `{app}` `{time}` `{rank}` placeholders)
3. **Cope Button** — pre-written excuses sent to group when losing
4. **Reactions & Taunts** — skull/clap/clown/pressed on leaderboard rows
5. **Badges** — earned (Grass Toucher, Digital Monk, Comeback Kid, Main Character) + shame-assigned (NPC of the Week, Skill Issue, Fully Cooked, Coped Hard)
6. **Weekly Roast Recap** — Spotify Wrapped-style shareable card, every Monday
7. **Streaks** — win streak 🔥 + personal consistency streak ⬇️
8. **The Neighborhood** — passive tree growing (30 clean min = 1 tree 🌱→🎄), group pixel-art map, house condition reflects daily score (palace→ruins), collective buildings unlock at milestones, 100 group trees = real donation to tree-planting org
9. **Group Challenges** — No TikTok Tuesday (3x multiplier), Detox Weekend, Speedrun

---

## iOS Limitation (Important)

**This app is Android-first.** Apple does not provide a public API to read screen time data programmatically.

- `UsageStatsManager` (Android) = full programmatic access ✅
- `DeviceActivity` framework (iOS) = requires Apple's `FamilyControls` entitlement (rarely granted, parental control apps only), cannot export raw numbers ❌

**MVP iOS behavior:** Self-report mode — user manually enters their junk time. Show a persistent banner explaining why automatic tracking isn't available. Do not hide this limitation.

---

## Database Tables

```sql
users, groups, group_members, usage_reports,
badges, reactions, taunts, group_challenges, streaks,
custom_notifications, custom_notification_votes,
yard_trees, neighborhood_buildings, group_donations
```

Full schema: `supabase/migrations/001_initial_schema.sql`

Realtime enabled on: `usage_reports`, `reactions`, `taunts`, `streaks`, `yard_trees`, `neighborhood_buildings`

---

## Build Phases

### ✅ Phase 0 — Foundation
- Expo dev-client, Supabase schema, all dependencies installed
- App structure: 4 tabs, auth screens, group screens (all placeholder)
- `lib/supabase.ts`, `lib/titleSystem.ts`, `lib/junkApps.ts`
- `store/authStore.ts`, `store/groupStore.ts`, `store/settingsStore.ts`

### ✅ Phase 1 — Android Native Module
- `modules/usage-stats/` with Expo Modules API (Kotlin)
- `hasPermission()`, `requestPermission()`, `getUsageStats(start, end)`, `getInstalledApps()`
- `PACKAGE_USAGE_STATS` declared in AndroidManifest
- `lib/scoreService.ts` — clean-window score calculation

### ⬜ Phase 2 — Auth + Onboarding
- Sign in / sign up screens (Supabase auth)
- Onboarding: concept explanation → permission request → junk app picker
- Root layout auth guard via `useAuthStore`
- Follow `stitch/sign_in_refined_typography/` design exactly

### ⬜ Phase 3 — Core Score Loop
- `scoreService.getTodayScore()` wired to Home screen
- Background sync: `expo-background-fetch` every 15 min
- Score submitted to `usage_reports` table
- Home screen: big score number, brain rot title, streak, neighborhood mini-preview
- Follow `stitch/home_the_neighborhood_refined_typography/` design exactly

### ⬜ Phase 4 — Groups + Leaderboard
- Create group + 6-char invite code + join flow
- "The Hierarchy" leaderboard with Realtime subscription
- Title badges on each row, COPE + TAUNT on current user's row
- Reactions (skull/clap/clown/pressed) on tap
- Follow `stitch/leaderboard_refined_typography/` and `stitch/groups_refined_typography/` exactly

### ⬜ Phase 5 — Shame Notifications
- `expo-notifications` permission + setup
- Supabase Edge Function: `on_score_insert` → compare → fire shame push
- Scheduled Edge Function cron: 9pm daily recap
- Streak tracking (win streak + personal streak)

### ⬜ Phase 6 — Badges + Cope + Custom Notifications
- `lib/badgeEngine.ts` — evaluate conditions on score insert
- Cope button + pre-written excuse sheet
- Custom notification creation UI (140 chars + placeholder chips)
- Group approval queue (vote 👍/👎)
- Admin delete control

### ⬜ Phase 7 — The Neighborhood
- `lib/neighborhoodService.ts` — parse clean 30-min windows → award/wilt trees
- `yard_trees` table: tree type based on streak, is_dead on junk-app interruption
- Neighborhood screen: pixel-art group map, each member's house + yard
- House condition derived from `usage_reports` (nice → regular → crumbling → ruins)
- Collective building unlocks at group milestones
- Real-tree donation milestone (100 trees = donation record + community badge)
- Share button: `react-native-view-shot` → native share sheet

### ⬜ Phase 8 — Weekly Roast Recap
- Animated full-screen recap card every Monday
- Funny contextual copy based on performance
- Shareable via native share sheet
- "NPC of the Week" badge auto-assigned via Edge Function cron
- Follow `stitch/profile_refined_typography/` for the recap card style

---

## Critical Rules

### Code
- **Never use 1px borders for UI sections** — use background color shifts
- **Never use pure black** — always `on-surface` (#1b1c1c) or `on-surface-variant` (#414941)
- **Always use `rounded-2xl` minimum** — prefer `rounded-3xl` for cards
- **Gradient CTAs only** — `from-primary to-primary-container` on all primary buttons
- **Android only for native module** — wrap every `UsageStats` call with `Platform.OS === 'android'` check, graceful fallback for iOS
- **Supabase RLS is always on** — never disable it, add policies for every new table
- **All Supabase calls use the typed client** — don't use raw SQL from the client
- **Score is always in milliseconds** — convert to human-readable only at display time using `formatJunkTime(ms)` from `lib/titleSystem.ts`

### Design
- Always check the relevant `stitch/` screen before implementing any UI component
- The `refined_typography` variants are final — use those, not the base variants
- Bottom nav is always a floating pill with glassmorphism — never full-width tab bar
- Leaderboard label in-app = "The Hierarchy", Groups label = "Circles"
- The Cope + Taunt buttons only appear on YOUR row, only when losing

### Architecture
- No separate backend server for MVP — all logic in Supabase Edge Functions or client-side
- State lives in Zustand stores — no prop drilling
- Native module import is always dynamic: `const UsageStats = (await import('@/modules/usage-stats')).default`
- Background tasks registered at root layout level, not inside screens

---

## Environment Variables

```bash
# .env.local (gitignored)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Running the App

```bash
# Install dependencies
bun install

# Run on Android (requires connected device or emulator)
# First time: this triggers a full Gradle build (~10 min)
bun android

# Start dev server only (after first native build)
bun start

# Lint
bun lint
```

**Emulator tip:** Boot the emulator and wait for the Android home screen before running `bun android`. Expo polls ADB for ~30 s after launch and will time out if the emulator is still booting.

**To test UsageStats:** After installing on a real Android device, go to Settings → Digital Wellbeing (or Apps → Special app access) → Usage access → toggle Breaking Time on.

---

## Native Module Wiring

`modules/usage-stats/` is a local Expo native module. For Expo's autolinking to discover it, it must be:

1. Declared as a file dependency in root `package.json`: `"usage-stats": "file:./modules/usage-stats"`
2. Have its own `modules/usage-stats/package.json` (already exists)

After any change to `package.json` dependencies or the module's native Kotlin/Java code, a full `bun android` rebuild is required — a JS-only reload won't pick up native changes.

The module is imported dynamically in JS to avoid crashing on iOS:
```ts
const UsageStats = (await import('@/modules/usage-stats')).default;
```
Always wrap calls with `Platform.OS === 'android'` guards.

---

## Known Build Quirks

- **`libworklets.so` duplicate**: `react-native-reanimated` v4 and its peer dep `react-native-worklets` both ship `libworklets.so`. Resolved via `android.packagingOptions.pickFirsts=**/libworklets.so` in `android/gradle.properties`. Do not remove this line.
