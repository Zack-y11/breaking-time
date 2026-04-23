import { NativeModule, requireOptionalNativeModule } from "expo";

import { AppUsageStat, InstalledApp } from "./UsageStats.types";

declare class UsageStatsModule extends NativeModule {
  /** Returns true if the PACKAGE_USAGE_STATS permission has been granted. */
  hasPermission(): Promise<boolean>;

  /** Opens Settings > Usage access so the user can grant permission. */
  requestPermission(): Promise<void>;

  /**
   * Returns per-app usage stats for the given time range.
   * @param startMs - Start of the range as a Unix timestamp in milliseconds.
   * @param endMs   - End of the range as a Unix timestamp in milliseconds.
   */
  getUsageStats(startMs: number, endMs: number): Promise<AppUsageStat[]>;

  /** Returns all user-installed apps with their display name and package name. */
  getInstalledApps(): Promise<InstalledApp[]>;
}

export default requireOptionalNativeModule<UsageStatsModule>("UsageStats");
