import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const C = {
  primaryFixed: "#bcefc5",
  onSurface: "#1b1c1c",
  onSurfaceVariant: "#414941",
} as const;
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TABS = [
  {
    label: "HOME",
    active: "home" as IoniconsName,
    inactive: "home-outline" as IoniconsName,
  },
  {
    label: "LEADERBOARD",
    active: "stats-chart" as IoniconsName,
    inactive: "stats-chart-outline" as IoniconsName,
  },
  {
    label: "CIRCLES",
    active: "people" as IoniconsName,
    inactive: "people-outline" as IoniconsName,
  },
  {
    label: "PROFILE",
    active: "person" as IoniconsName,
    inactive: "person-outline" as IoniconsName,
  },
];

function TabItem({
  cfg,
  isFocused,
  onPress,
  onLongPress,
}: {
  cfg: (typeof TABS)[0];
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const p = useSharedValue(isFocused ? 1 : 0);
  useEffect(() => {
    p.value = withSpring(isFocused ? 1 : 0, {
      damping: 20,
      stiffness: 320,
      mass: 0.8,
    });
  }, [isFocused, p]);
  const bgStyle = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scaleX: 0.76 + p.value * 0.24 }],
  }));
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={cfg.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.75}
    >
      <Animated.View style={[styles.tabBg, bgStyle]} />
      <Ionicons
        name={isFocused ? cfg.active : cfg.inactive}
        size={22}
        color={isFocused ? C.onSurface : C.onSurfaceVariant}
      />
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {cfg.label}
      </Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom + 8, 24) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const cfg = TABS[i];
          if (!cfg) return null;
          const focused = state.index === i;
          const press = () => {
            const ev = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !ev.defaultPrevented)
              navigation.navigate(route.name);
          };
          const longPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });
          return (
            <TabItem
              key={route.key}
              cfg={cfg}
              isFocused={focused}
              onPress={press}
              onLongPress={longPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="leaderboard" />
      <Tabs.Screen name="groups" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const { width: W } = Dimensions.get("window");
const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    width: W * 0.9,
    maxWidth: 480,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#414941",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    overflow: "hidden",
    gap: 3,
  },
  tabBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.primaryFixed,
    borderRadius: 16,
  },
  tabLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 0.8,
    color: C.onSurfaceVariant,
  },
  tabLabelActive: { color: C.onSurface },
});
