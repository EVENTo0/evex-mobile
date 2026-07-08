import { create } from "zustand";
import type { Locale } from "@/lib/i18n";

type Theme = "dark" | "light" | "system";

interface AppState {
  theme: Theme;
  locale: Locale;
  isOnboarded: boolean;
  isOffline: boolean;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setOnboarded: (value: boolean) => void;
  setOffline: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  locale: "ar",
  isOnboarded: false,
  isOffline: false,
  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),
  setOffline: (isOffline) => set({ isOffline }),
}));

export default useAppStore;
