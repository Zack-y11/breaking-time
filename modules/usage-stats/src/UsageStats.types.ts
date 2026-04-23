/** Per-app usage stats for a given time window. */
export interface AppUsageStat {
  packageName: string;
  /** Total time the app was in the foreground, in milliseconds. */
  totalTimeInForeground: number;
  /** Unix timestamp (ms) of the last time the app was used. */
  lastTimeUsed: number;
}

/** Basic info about an installed app. */
export interface InstalledApp {
  packageName: string;
  appName: string;
}
