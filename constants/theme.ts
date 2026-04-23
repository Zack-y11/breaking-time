import { Platform } from "react-native";

// ─── Design Token Colors (Organic Brutalism design system) ───────────────────
export const COLORS = {
  primary: "#325f3f",
  primaryContainer: "#4a7856",
  primaryFixed: "#bcefc5",
  primaryFixedDim: "#a1d2aa",
  onPrimary: "#ffffff",
  onPrimaryFixed: "#00210d",
  onPrimaryFixedVariant: "#225031",

  secondary: "#5e5f5c",
  secondaryContainer: "#e0e0dc",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#626360",
  secondaryFixed: "#e3e2df",

  tertiary: "#5443b6",
  tertiaryContainer: "#6d5dd0",
  tertiaryFixed: "#e5deff",
  tertiaryFixedDim: "#c8bfff",
  onTertiary: "#ffffff",
  onTertiaryFixed: "#190064",
  onTertiaryFixedVariant: "#4532a6",
  onTertiaryContainer: "#f5f0ff",

  surface: "#f8faf6",
  surfaceBright: "#f8faf6",
  surfaceDim: "#dcd9d9",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f2f4f0",
  surfaceContainer: "#f0eded",
  surfaceContainerHigh: "#eae8e7",
  surfaceContainerHighest: "#e4e2e1",
  surfaceVariant: "#e4e2e1",
  inverseSurface: "#303030",
  inverseOnSurface: "#f3f0f0",

  onSurface: "#1b1c1c",
  onSurfaceVariant: "#414941",
  onBackground: "#1b1c1c",
  background: "#f8faf6",

  outline: "#717971",
  outlineVariant: "#c1c9bf",

  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",

  inversePrimary: "#a1d2aa",
  surfaceTint: "#3a6847",
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONTS = {
  headline: "Manrope_800ExtraBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  full: 9999,
} as const;

// ─── Spacing (multiples of 4) ────────────────────────────────────────────────
export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
} as const;

// ─── Backward-compatible Colors export ───────────────────────────────────────
// Kept so existing imports of Colors from '@/constants/theme' still compile.
export const Colors = {
  light: {
    text: COLORS.onSurface,
    background: COLORS.surface,
    tint: COLORS.primary,
    icon: COLORS.onSurfaceVariant,
    tabIconDefault: COLORS.onSurfaceVariant,
    tabIconSelected: COLORS.primary,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: COLORS.primaryFixed,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: COLORS.primaryFixed,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
