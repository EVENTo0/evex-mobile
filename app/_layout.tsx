import React, { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initLocale } from "@/lib/i18n";
import { AppConfig } from "@/lib/config";

initLocale();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: AppConfig.queryStaleTime,
      gcTime: AppConfig.queryCacheTime,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 1 },
  },
});

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(I18nManager.isRTL);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: "#0A0A0A" } }} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
