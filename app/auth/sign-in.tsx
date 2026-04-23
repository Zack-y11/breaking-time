import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const COLORS = {
  primary: "#325f3f",
  primaryFixed: "#bcefc5",
  surface: "#f8faf6",
  surfaceContainerLow: "#f2f4f0",
  surfaceContainerLowest: "#ffffff",
  outlineVariant: "#c1c9bf",
  tertiary: "#5443b6",
  tertiaryFixed: "#e5deff",
  onTertiaryFixed: "#190064",
  onSurface: "#1b1c1c",
  secondary: "#5e5f5c",
};

interface AppChip {
  id: string;
  name: string;
  emoji: string;
}

const APP_CHIPS: AppChip[] = [
  { id: "com.zhiliaoapp.musically", name: "TikTok", emoji: "🎵" },
  { id: "com.instagram.android", name: "Instagram", emoji: "📸" },
  { id: "com.google.android.youtube", name: "YouTube", emoji: "▶️" },
  { id: "com.twitter.android", name: "X / Twitter", emoji: "🐦" },
  { id: "com.amazon.avod.thirdpartyclient", name: "Prime Video", emoji: "📦" },
];

export default function SignInScreen() {
  const [selectedApps, setSelectedApps] = useState<string[]>([
    "com.instagram.android",
  ]);

  function toggleApp(id: string) {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  function handleGoogle() {
    Alert.alert(
      "Coming Soon",
      "Google sign-in will be available in a future update.",
    );
  }

  function handleApple() {
    Alert.alert(
      "Coming Soon",
      "Apple sign-in will be available in a future update.",
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.treeIcon}>🌲</Text>
          </View>
          <Text style={styles.appName}>Breaking Time</Text>
          <Text style={styles.tagline1}>Reclaim your time.</Text>
          <Text style={styles.tagline2}>Grow your forest.</Text>
        </View>

        {/* App Picker Preview Card */}
        <View style={styles.card}>
          <Text style={styles.cardLeaf}>🍃</Text>

          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STEP 01</Text>
            </View>
            <Text style={styles.cardTitle}>Pick your junk apps</Text>
          </View>

          <View style={styles.chips}>
            {APP_CHIPS.map((app) => {
              const selected = selectedApps.includes(app.id);
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleApp(app.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.chipEmoji}>{app.emoji}</Text>
                  <Text
                    style={[
                      styles.chipName,
                      selected && styles.chipNameSelected,
                    ]}
                  >
                    {app.name}
                  </Text>
                  {selected && <Text style={styles.chipCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.cardFootnote}>
            {"We'll lock these while your forest grows."}
          </Text>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogle}
            activeOpacity={0.82}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.appleBtn}
            onPress={handleApple}
            activeOpacity={0.82}
          >
            <Text style={styles.appleIcon}>🍎</Text>
            <Text style={styles.appleBtnText}>Sign in with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/sign-up")}
            style={styles.emailLink}
            activeOpacity={0.7}
          >
            <Text style={styles.emailLinkText}>OR USE EMAIL ADDRESS</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By growing your forest, you agree to our{" "}
            <Text style={styles.footerLink}>Terms</Text> and{" "}
            <Text style={styles.footerLink}>Digital Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 32,
  },

  // Hero
  hero: {
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  treeIcon: {
    fontSize: 44,
  },
  appName: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 36,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline1: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.secondary,
  },
  tagline2: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.primary,
  },

  // Card
  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    position: "relative",
  },
  cardLeaf: {
    position: "absolute",
    top: -8,
    right: -4,
    fontSize: 64,
    opacity: 0.1,
    transform: [{ rotate: "25deg" }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  stepBadge: {
    backgroundColor: COLORS.tertiaryFixed,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLORS.onTertiaryFixed,
  },
  cardTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 18,
    color: COLORS.onSurface,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(193,201,191,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipEmoji: {
    fontSize: 15,
  },
  chipName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: COLORS.onSurface,
  },
  chipNameSelected: {
    color: "#ffffff",
  },
  chipCheck: {
    fontSize: 12,
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
  },
  cardFootnote: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.secondary,
    opacity: 0.8,
  },

  // Auth
  authSection: {
    gap: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(193,201,191,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  googleG: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 16,
    color: "#4285f4",
    width: 20,
    textAlign: "center",
  },
  googleBtnText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 15,
    color: COLORS.onSurface,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.onSurface,
    borderRadius: 20,
    paddingVertical: 18,
  },
  appleIcon: {
    fontSize: 18,
  },
  appleBtnText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 15,
    color: "#ffffff",
  },
  emailLink: {
    paddingVertical: 12,
    alignItems: "center",
  },
  emailLinkText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.secondary,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.7,
  },
  footerLink: {
    fontFamily: "Inter_600SemiBold",
    textDecorationLine: "underline",
  },
});
