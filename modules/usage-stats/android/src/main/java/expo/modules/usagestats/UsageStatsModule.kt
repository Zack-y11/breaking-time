package expo.modules.usagestats

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.Build
import android.os.Process
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UsageStatsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("UsageStats")

    // Returns true if the PACKAGE_USAGE_STATS appops permission is granted.
    // The user must grant this manually in Settings > Usage access.
    AsyncFunction("hasPermission") {
      hasUsageStatsPermission()
    }

    // Opens the system Usage Access settings screen so the user can grant permission.
    AsyncFunction("requestPermission") {
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      appContext.reactContext?.startActivity(intent)
    }

    // Queries UsageStatsManager for the given time range.
    // Returns a list of { packageName, totalTimeInForeground, lastTimeUsed } objects.
    // Throws if permission has not been granted.
    AsyncFunction("getUsageStats") { startMs: Double, endMs: Double ->
      val context = appContext.reactContext
        ?: throw Exception("React context unavailable")

      if (!hasUsageStatsPermission()) {
        throw Exception("Usage stats permission not granted. Call requestPermission() first.")
      }

      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats = usm.queryUsageStats(
        UsageStatsManager.INTERVAL_BEST,
        startMs.toLong(),
        endMs.toLong()
      )

      stats
        ?.filter { it.totalTimeInForeground > 0 }
        ?.map { stat ->
          mapOf(
            "packageName"          to stat.packageName,
            "totalTimeInForeground" to stat.totalTimeInForeground.toDouble(),
            "lastTimeUsed"         to stat.lastTimeUsed.toDouble()
          )
        }
        ?: emptyList<Map<String, Any>>()
    }

    // Returns all installed apps with their display name and package name.
    // Used to let the user choose which apps count as "junk content".
    AsyncFunction("getInstalledApps") {
      val context = appContext.reactContext
        ?: throw Exception("React context unavailable")
      val pm = context.packageManager

      pm.getInstalledApplications(PackageManager.GET_META_DATA)
        .filter { appInfo ->
          // Only include apps the user intentionally installed (not system internals)
          appInfo.flags and ApplicationInfo.FLAG_SYSTEM == 0 ||
          appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP != 0
        }
        .mapNotNull { appInfo ->
          val appName = pm.getApplicationLabel(appInfo)?.toString() ?: return@mapNotNull null
          mapOf(
            "packageName" to appInfo.packageName,
            "appName"     to appName
          )
        }
        .sortedBy { it["appName"] as String }
    }
  }

  private fun hasUsageStatsPermission(): Boolean {
    val context = appContext.reactContext ?: return false
    val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      appOps.unsafeCheckOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
      )
    } else {
      @Suppress("DEPRECATION")
      appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
      )
    }
    return mode == AppOpsManager.MODE_ALLOWED
  }
}
