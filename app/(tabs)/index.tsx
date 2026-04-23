import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { getTodayScore, ScoreResult } from "@/lib/scoreService";
import { getTitle, formatJunkTime } from "@/lib/titleSystem";
import { useSettingsStore } from "@/store/settingsStore";

const C = {
  primary: "#325f3f",
  primaryContainer: "#4a7856",
  primaryFixed: "#bcefc5",
  surface: "#f8faf6",
  surfaceContainerLow: "#f2f4f0",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#eae8e7",
  tertiaryFixed40: "rgba(229,222,255,0.4)",
  onTertiaryFixed: "#190064",
  onTertiaryFixedVariant: "#4532a6",
  onSurface: "#1b1c1c",
  secondary: "#5e5f5c",
} as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { trackedApps } = useSettingsStore();
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [streak] = useState(0);
  const headerH = 64 + insets.top;

  useFocusEffect(
    useCallback(() => {
      getTodayScore(trackedApps.length > 0 ? trackedApps : undefined).then(
        setScore,
      );
    }, [trackedApps]),
  );

  if (!score)
    return (
      <View style={styles.loading}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );

  const { emoji, title } = getTitle(score.totalJunkMs);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top, height: headerH }]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.headerTitle}>Breaking Time</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakPillText}>
            {streak > 0 ? `${streak}d Streak` : "Day 1"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingTop: headerH + 28, paddingBottom: 120 + insets.bottom },
        ]}
      >
        {/* Hero score */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>{"TODAY'S JUNK TIME"}</Text>
          <View style={styles.scoreWrap}>
            <Text style={styles.bigScore}>
              {formatJunkTime(score.totalJunkMs)}
            </Text>
            <View style={styles.titleBadge}>
              <Text style={styles.titleBadgeText}>
                {emoji} {title.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Neighborhood card */}
        <View style={styles.nbOuter}>
          <View style={styles.nbInner}>
            <View style={styles.nbHeader}>
              <View style={{ flex: 1, gap: 4, marginRight: 12 }}>
                <Text style={styles.nbTitle}>The Neighborhood</Text>
                <Text style={styles.nbSub}>
                  Your digital sanctuary is flourishing.
                </Text>
              </View>
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>LVL 4 YARD</Text>
              </View>
            </View>
            <View style={styles.landscape}>
              <View style={styles.lSky} />
              <View style={styles.lGround} />
              <View style={[StyleSheet.absoluteFill, styles.lOverlay]}>
                <View style={styles.parkBtn}>
                  <Text style={{ fontSize: 28 }}>🌲</Text>
                </View>
                <View style={styles.progTrack}>
                  <View style={styles.progFill} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bento */}
        <View style={styles.bento}>
          <View style={styles.streakCard}>
            <Text style={{ fontSize: 28 }}>🔥</Text>
            <View>
              <Text style={styles.streakVal}>
                {streak > 0 ? `${streak} Days` : "0 Days"}
              </Text>
              <Text style={styles.streakLbl}>{"CONSISTENCY\nSTREAK"}</Text>
            </View>
          </View>
          <View style={styles.watchCard}>
            <Text style={{ fontSize: 28 }}>👥</Text>
            <View>
              <Text style={styles.watchVal}>{"0 Friends\nCooked"}</Text>
              <Text style={styles.watchLbl}>{"NEIGHBORHOOD\nWATCH"}</Text>
            </View>
          </View>
        </View>

        {/* Share */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={async () => {
            try {
              await Share.share({
                message: `${emoji} I spent only ${formatJunkTime(score.totalJunkMs)} on junk apps today!\nStatus: ${title}\n\nCome compete 🌲`,
              });
            } catch {}
          }}
          activeOpacity={0.82}
        >
          <Text style={styles.shareBtnText}>📤 Share My Yard</Text>
        </TouchableOpacity>

        {/* Quote */}
        <View style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
          <Text style={styles.quote}>
            {'"The best time to plant a tree was 20 years ago. The second best time is after you put down the phone."'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  loading: {
    flex: 1,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: "rgba(248,250,246,0.92)",
    shadowColor: "#414941",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  flame: { fontSize: 20 },
  headerTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 20,
    color: C.primary,
    letterSpacing: -0.3,
  },
  streakPill: {
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  streakPillText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 11,
    color: C.primary,
  },
  body: { paddingHorizontal: 20, gap: 24 },
  heroSection: { alignItems: "center" },
  heroLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: C.secondary,
    opacity: 0.7,
    marginBottom: 8,
  },
  scoreWrap: { position: "relative", alignItems: "center" },
  bigScore: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 80,
    color: C.primary,
    letterSpacing: -3,
    lineHeight: 88,
  },
  titleBadge: {
    position: "absolute",
    right: -56,
    top: -6,
    backgroundColor: C.primaryFixed,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    transform: [{ rotate: "12deg" }],
  },
  titleBadgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.onSurface,
  },
  nbOuter: {
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 28,
    padding: 4,
  },
  nbInner: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(193,201,191,0.15)",
  },
  nbHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
  },
  nbTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    color: C.onSurface,
    letterSpacing: -0.3,
  },
  nbSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.secondary,
    lineHeight: 19,
  },
  levelPill: {
    backgroundColor: "rgba(229,222,255,1)",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelPillText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: C.onTertiaryFixed,
  },
  landscape: {
    aspectRatio: 1.78,
    overflow: "hidden",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  lSky: { flex: 1, backgroundColor: "#deeeff" },
  lGround: { flex: 1, backgroundColor: "#d4edd9" },
  lOverlay: { alignItems: "center", justifyContent: "center", gap: 12 },
  parkBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 6,
  },
  progTrack: {
    width: 200,
    height: 8,
    backgroundColor: "rgba(0,0,0,0.07)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progFill: {
    width: "65%",
    height: "100%",
    backgroundColor: C.primary,
    borderRadius: 4,
  },
  bento: { flexDirection: "row", gap: 12 },
  streakCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(193,201,191,0.10)",
  },
  watchCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: C.tertiaryFixed40,
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(84,67,182,0.05)",
  },
  streakVal: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 28,
    color: C.onSurface,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  streakLbl: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.secondary,
    lineHeight: 13,
  },
  watchVal: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: C.onTertiaryFixed,
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 2,
  },
  watchLbl: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.onTertiaryFixedVariant,
    lineHeight: 13,
  },
  shareBtn: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 17,
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  quote: {
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    fontSize: 13,
    color: C.secondary,
    textAlign: "center",
    lineHeight: 21,
    opacity: 0.8,
  },
});
