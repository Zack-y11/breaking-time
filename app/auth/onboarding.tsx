import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  AppState,
  AppStateStatus,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PRESET_JUNK_APPS } from "@/lib/junkApps";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";

const C = {
  primary: "#325f3f",
  primaryFixed: "#bcefc5",
  surface: "#f8faf6",
  surfaceContainerLow: "#f2f4f0",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#1b1c1c",
  onSurfaceVariant: "#414941",
  secondary: "#5e5f5c",
  outlineVariant: "#c1c9bf",
} as const;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>(
    PRESET_JUNK_APPS.map((a) => a.packageName),
  );
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const { setTrackedApps } = useSettingsStore();
  const { setOnboardingComplete } = useAuthStore();

  useEffect(() => {
    if (step !== 1 || Platform.OS !== "android") return;
    checkPermission();
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        checkPermission();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [step]);

  async function checkPermission() {
    setCheckingPermission(true);
    try {
      const UsageStats = (await import("@/modules/usage-stats")).default;
      if (!UsageStats) {
        setPermissionGranted(false);
        return;
      }
      const has = await UsageStats.hasPermission();
      setPermissionGranted(has);
    } catch {
      setPermissionGranted(false);
    } finally {
      setCheckingPermission(false);
    }
  }

  async function handleGrantPermission() {
    try {
      const UsageStats = (await import("@/modules/usage-stats")).default;
      if (!UsageStats) {
        setStep(2);
        return;
      }
      await UsageStats.requestPermission();
    } catch {
      setStep(2);
    }
  }

  function toggleApp(packageName: string) {
    setSelectedApps((prev) =>
      prev.includes(packageName)
        ? prev.filter((p) => p !== packageName)
        : [...prev, packageName],
    );
  }

  async function handleFinish() {
    setTrackedApps(selectedApps);
    await AsyncStorage.setItem("onboardingComplete", "true");
    setOnboardingComplete(true);
    router.replace("/(tabs)");
  }

  function handleSkip() {
    if (step < 2) setStep(step + 1);
    else handleFinish();
  }

  function renderWelcome() {
    return (
      <View style={styles.stepCenter}>
        <Text style={styles.heroEmoji}>🌲</Text>
        <Text style={styles.welcomeTitle}>{"Welcome to\nBreaking Time"}</Text>
        <Text style={styles.welcomeSubtitle}>
          The app that shames you into putting down your phone.
        </Text>
        <View style={styles.bulletList}>
          {[
            { emoji: "🏆", text: "Compete with friends on less screen time" },
            { emoji: "🌳", text: "Grow a virtual forest together" },
            { emoji: "🔥", text: "Get roasted when you lose" },
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletEmoji}>{item.emoji}</Text>
              <Text style={styles.bulletText}>{item.text}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => setStep(1)}
          activeOpacity={0.82}
        >
          <Text style={styles.primaryBtnText}>{"Let's Get Started →"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderPermission() {
    if (Platform.OS !== "android") {
      return (
        <View style={styles.stepCenter}>
          <Text style={styles.heroEmoji}>⚠️</Text>
          <Text style={styles.stepTitle}>iOS Limitation</Text>
          <View style={styles.iosBanner}>
            <Text style={styles.iosBannerText}>
              Automatic tracking is not available on iOS. Apple does not provide
              a public API for reading screen time data.{"\n\n"}You can manually
              enter your junk time each day.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStep(2)}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.stepCenter}>
        <Text style={styles.heroEmoji}>📊</Text>
        <Text style={styles.stepTitle}>Grant Usage Access</Text>
        <Text style={styles.stepDescription}>
          Breaking Time needs to see how long you use junk apps. This data never
          leaves your device.
        </Text>

        {checkingPermission ? (
          <ActivityIndicator
            size="large"
            color={C.primary}
            style={styles.spinner}
          />
        ) : permissionGranted ? (
          <View style={styles.grantedGroup}>
            <View style={styles.grantedBadge}>
              <Text style={styles.grantedBadgeText}>✅ Permission Granted</Text>
            </View>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStep(2)}
              activeOpacity={0.82}
            >
              <Text style={styles.primaryBtnText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 32 }]}
            onPress={handleGrantPermission}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryBtnText}>Grant Permission →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderAppPicker() {
    return (
      <>
        <Text style={styles.stepTitle}>Pick Your Junk Apps</Text>
        <Text
          style={[
            styles.stepDescription,
            { marginBottom: 20, textAlign: "left" },
          ]}
        >
          {"We'll track time spent in these apps. Tap to toggle."}
        </Text>
        <ScrollView
          style={styles.chipScroll}
          contentContainerStyle={styles.chipsContainer}
          showsVerticalScrollIndicator={false}
        >
          {PRESET_JUNK_APPS.map((app) => {
            const selected = selectedApps.includes(app.packageName);
            return (
              <TouchableOpacity
                key={app.packageName}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleApp(app.packageName)}
                activeOpacity={0.72}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {app.displayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={[styles.primaryBtn, styles.finishBtn]}
          onPress={handleFinish}
          activeOpacity={0.82}
        >
          <Text style={styles.primaryBtnText}>Start Competing 🔥</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
        >
          <Text style={styles.skipText}>{step === 2 ? "Done" : "Skip →"}</Text>
        </TouchableOpacity>
      </View>

      {step === 2 ? (
        <View style={styles.pickerWrapper}>{renderAppPicker()}</View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && renderWelcome()}
          {step === 1 && renderPermission()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 4,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.outlineVariant,
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: C.primary,
  },
  skipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.onSurfaceVariant,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 32,
  },
  stepCenter: {
    alignItems: "center",
    paddingTop: 8,
  },
  heroEmoji: {
    fontSize: 72,
    marginBottom: 28,
  },
  welcomeTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 28,
    color: C.primary,
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 4,
  },
  bulletList: {
    alignSelf: "stretch",
    gap: 10,
    marginBottom: 40,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  bulletEmoji: {
    fontSize: 22,
  },
  bulletText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.onSurface,
    flex: 1,
    lineHeight: 20,
  },
  stepTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 26,
    color: C.onSurface,
    textAlign: "center",
    marginBottom: 12,
  },
  stepDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.secondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  spinner: {
    marginTop: 40,
  },
  grantedGroup: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 20,
    marginTop: 28,
  },
  grantedBadge: {
    backgroundColor: C.primaryFixed,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  grantedBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: C.primary,
  },
  iosBanner: {
    backgroundColor: "#fff8e1",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 24,
    alignSelf: "stretch",
  },
  iosBannerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#7a5800",
    lineHeight: 21,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  finishBtn: {
    marginTop: 16,
  },
  pickerWrapper: {
    flex: 1,
    paddingTop: 8,
  },
  chipScroll: {
    flex: 1,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 8,
  },
  chip: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  chipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.onSurface,
  },
  chipTextSelected: {
    color: "#ffffff",
  },
});
