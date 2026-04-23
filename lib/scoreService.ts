import { Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import type { AppUsageStat } from "@/modules/usage-stats";
import { PRESET_PACKAGE_NAMES } from "./junkApps";
import { supabase } from "@/lib/supabase";

export interface ScoreResult {
  totalJunkMs: number;
  appBreakdown: Record<string, number>;
  periodStart: number;
  periodEnd: number;
}

interface UsageStatsModuleShape {
  hasPermission(): Promise<boolean>;
  getUsageStats(startMs: number, endMs: number): Promise<AppUsageStat[]>;
}

/**
 * Returns the start and end timestamps (ms) for "today" — midnight to now.
 */
export function getTodayRange(): { startMs: number; endMs: number } {
  const now = new Date();
  const startMs = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  return { startMs, endMs: now.getTime() };
}

function createZeroScore(periodStart: number, periodEnd: number): ScoreResult {
  return {
    totalJunkMs: 0,
    appBreakdown: {},
    periodStart,
    periodEnd,
  };
}

async function loadUsageStatsModule(): Promise<UsageStatsModuleShape | null> {
  try {
    const module = (await import("@/modules/usage-stats")).default as
      | UsageStatsModuleShape
      | undefined;

    if (
      !module ||
      typeof module.hasPermission !== "function" ||
      typeof module.getUsageStats !== "function"
    ) {
      console.warn("[ScoreService] UsageStats native module is unavailable");
      return null;
    }

    return module;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[ScoreService] Failed to load UsageStats module: ${message}`);
    return null;
  }
}

/**
 * Calculates the junk content score from raw UsageStats.
 * Only counts apps in the user's tracked list (defaults to preset list).
 */
export function calculateScore(
  stats: AppUsageStat[],
  trackedApps: string[] = PRESET_PACKAGE_NAMES,
  periodStart: number,
  periodEnd: number,
): ScoreResult {
  const appBreakdown: Record<string, number> = {};
  let totalJunkMs = 0;

  for (const stat of stats) {
    if (
      trackedApps.includes(stat.packageName) &&
      stat.totalTimeInForeground > 0
    ) {
      appBreakdown[stat.packageName] = stat.totalTimeInForeground;
      totalJunkMs += stat.totalTimeInForeground;
    }
  }

  return { totalJunkMs, appBreakdown, periodStart, periodEnd };
}

/**
 * Fetches today's usage stats and returns a ScoreResult.
 * Android only — returns a zero score on other platforms.
 */
export async function getTodayScore(
  trackedApps: string[] = PRESET_PACKAGE_NAMES,
): Promise<ScoreResult> {
  const { startMs, endMs } = getTodayRange();
  const zeroScore = createZeroScore(startMs, endMs);

  if (Platform.OS !== "android") {
    return zeroScore;
  }

  // Dynamic import so the module is only loaded on Android.
  const usageStats = await loadUsageStatsModule();
  if (!usageStats) return zeroScore;

  const hasPermission = await usageStats.hasPermission();
  if (!hasPermission) {
    return zeroScore;
  }

  const stats = await usageStats.getUsageStats(startMs, endMs);
  return calculateScore(stats, trackedApps, startMs, endMs);
}

// ─── Supabase Reporting ───────────────────────────────────────────────────────

/**
 * Submits today's usage report to Supabase.
 * Called by background sync and on app foreground.
 */
export async function submitTodayScore(
  userId: string,
  trackedApps: string[] = PRESET_PACKAGE_NAMES,
): Promise<{ error: string | null }> {
  const scoreResult = await getTodayScore(trackedApps);

  const { error } = await supabase.from("usage_reports").insert({
    user_id: userId,
    period_start: new Date(scoreResult.periodStart).toISOString(),
    period_end: new Date(scoreResult.periodEnd).toISOString(),
    total_junk_ms: scoreResult.totalJunkMs,
    app_breakdown: scoreResult.appBreakdown,
    tracked_apps: trackedApps,
  });

  if (error) return { error: error.message };
  return { error: null };
}

// ─── Background Sync ─────────────────────────────────────────────────────────

export const BACKGROUND_SCORE_TASK = "background-score-sync";

// Must be called at module level — TaskManager requires top-level registration.
TaskManager.defineTask(BACKGROUND_SCORE_TASK, async () => {
  try {
    const { useAuthStore } = await import("@/store/authStore");
    const { useSettingsStore } = await import("@/store/settingsStore");

    const userId = useAuthStore.getState().user?.id;
    const trackedApps = useSettingsStore.getState().trackedApps;

    if (!userId) return BackgroundFetch.BackgroundFetchResult.NoData;

    const apps = trackedApps.length > 0 ? trackedApps : PRESET_PACKAGE_NAMES;
    const { error } = await submitTodayScore(userId, apps);

    if (error) return BackgroundFetch.BackgroundFetchResult.Failed;
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Registers the background fetch task (every 15 minutes).
 * Call this from the root layout once auth is established.
 */
export async function registerBackgroundSync(): Promise<void> {
  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    console.warn("[BackgroundSync] BackgroundFetch is not available");
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_SCORE_TASK,
  );
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SCORE_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
