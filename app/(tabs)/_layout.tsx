import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { t } from "@/lib/i18n";
import { Colors, Spacing } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: Colors.dark.border,
          borderTopWidth: 1,
          paddingTop: Spacing.xs,
          paddingBottom: Platform.OS === "ios" ? Spacing.lg : Spacing.sm,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.dashboard"), tabBarLabel: t("tabs.dashboard") }} />
      <Tabs.Screen name="workout" options={{ title: t("tabs.workout"), tabBarLabel: t("tabs.workout") }} />
      <Tabs.Screen name="lab" options={{ title: t("tabs.lab"), tabBarLabel: t("tabs.lab") }} />
      <Tabs.Screen name="coach" options={{ title: t("tabs.coach"), tabBarLabel: t("tabs.coach") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile"), tabBarLabel: t("tabs.profile") }} />
    </Tabs>
  );
}
