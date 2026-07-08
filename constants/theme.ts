/**
 * EVEX Design System - Theme constants
 * Optimized for Arabic-first, dark mode default.
 */

export const Colors = {
  dark: {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    surfaceElevated: "#242424",
    primary: "#6C63FF",
    primaryLight: "#8B85FF",
    secondary: "#00D4AA",
    accent: "#FF6B6B",
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    textTertiary: "#6B6B6B",
    border: "#2A2A2A",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    cardBg: "#1E1E1E",
  },
  light: {
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    primary: "#6C63FF",
    primaryLight: "#8B85FF",
    secondary: "#00D4AA",
    accent: "#FF6B6B",
    text: "#1A1A1A",
    textSecondary: "#6B6B6B",
    textTertiary: "#A0A0A0",
    border: "#E8E8E8",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    cardBg: "#FFFFFF",
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const FontFamily = {
  ar: {
    regular: "Cairo-Regular",
    medium: "Cairo-Medium",
    semiBold: "Cairo-SemiBold",
    bold: "Cairo-Bold",
  },
  en: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
} as const;
