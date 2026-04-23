import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import { useAuthStore } from "@/store/authStore";
import { registerBackgroundSync } from "@/lib/scoreService";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const {
    session,
    isLoading,
    isOnboardingComplete,
    initialize,
    setOnboardingComplete,
  } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsub = initialize();
    return unsub;
  }, [initialize]);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "auth";

    if (!session) {
      if (!inAuthGroup) router.replace("/auth/sign-in");
      return;
    }

    if (!isOnboardingComplete) {
      AsyncStorage.getItem("onboardingComplete").then((val) => {
        if (val === "true") {
          setOnboardingComplete(true);
          if (inAuthGroup) router.replace("/(tabs)");
        } else {
          router.replace("/auth/onboarding");
        }
      });
      return;
    }

    if (inAuthGroup) router.replace("/(tabs)");
  }, [
    session,
    isLoading,
    isOnboardingComplete,
    fontsLoaded,
    router,
    segments,
    setOnboardingComplete,
  ]);

  useEffect(() => {
    if (session) registerBackgroundSync().catch(console.warn);
  }, [session]);

  if (isLoading || !fontsLoaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/sign-in" />
        <Stack.Screen name="auth/sign-up" />
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="group/create" options={{ presentation: "modal" }} />
        <Stack.Screen name="group/join" options={{ presentation: "modal" }} />
        <Stack.Screen name="group/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" backgroundColor="#f8faf6" />
    </>
  );
}
