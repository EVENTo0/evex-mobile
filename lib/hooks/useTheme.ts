import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";
import { useAppStore } from "@/lib/store/app";

export function useTheme() {
  const systemScheme = useColorScheme();
  const themePreference = useAppStore((s) => s.theme);

  const effectiveTheme =
    themePreference === "system"
      ? systemScheme ?? "dark"
      : themePreference;

  const colors = effectiveTheme === "dark" ? Colors.dark : Colors.light;

  return {
    colors,
    isDark: effectiveTheme === "dark",
    theme: effectiveTheme,
  };
}

export default useTheme;
