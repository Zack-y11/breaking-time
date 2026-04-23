import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const C = {
  primary: "#325f3f",
  surface: "#f8faf6",
  surfaceContainerLowest: "#ffffff",
  outlineVariant: "#c1c9bf",
  onSurface: "#1b1c1c",
  onSurfaceVariant: "#414941",
  secondary: "#5e5f5c",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
};

export default function SignUpScreen() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signUpWithEmail } = useAuthStore();

  async function handleSubmit() {
    setError(null);
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (!isSignIn && !username.trim()) {
      setError("Username is required.");
      return;
    }
    setIsLoading(true);
    try {
      if (isSignIn) {
        const { error: err } = await signInWithEmail(email.trim(), password);
        if (err) {
          setError(err);
          return;
        }
        router.replace("/(tabs)");
      } else {
        const { error: err } = await signUpWithEmail(
          email.trim(),
          password,
          username.trim(),
        );
        if (err) {
          setError(err);
          return;
        }
        router.replace("/auth/onboarding");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isSignIn ? "Welcome Back" : "Create Account"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignIn
              ? "Sign in to continue growing your forest."
              : "Join the revolution. Less scroll, more soul."}
          </Text>
          <View style={styles.form}>
            {!isSignIn && (
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your_username"
                  placeholderTextColor={C.outlineVariant}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            )}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={C.outlineVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor={C.outlineVariant}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
          {error && (
            <View style={styles.errorChip}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.82}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isSignIn ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleLink}
            onPress={() => {
              setError(null);
              setIsSignIn((v) => !v);
            }}
          >
            <Text style={styles.toggleLinkText}>
              {isSignIn
                ? "Don't have an account? Sign up →"
                : "Already have an account? Sign in →"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48, gap: 20 },
  backBtn: { alignSelf: "flex-start", paddingVertical: 4 },
  backBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.onSurfaceVariant,
  },
  title: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 30,
    color: C.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.secondary,
    lineHeight: 22,
    marginTop: -8,
  },
  form: { gap: 16 },
  inputWrap: { gap: 6 },
  inputLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: C.onSurfaceVariant,
  },
  input: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.onSurface,
    borderWidth: 1,
    borderColor: "rgba(193,201,191,0.3)",
  },
  errorChip: {
    backgroundColor: "#ffdad6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.error,
    lineHeight: 19,
  },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 16,
    color: "#ffffff",
  },
  toggleLink: { alignItems: "center", paddingVertical: 8 },
  toggleLinkText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.primary,
  },
});
