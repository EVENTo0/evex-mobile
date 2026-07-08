import React, { useCallback } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { t, setLocale, getLocale } from "@/lib/i18n";
import { useAppStore } from "@/lib/store/app";
import { useAuthStore } from "@/lib/store/auth";
import { Spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { flexDirection } = useRTL();
  const appStore = useAppStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const toggleLocale = useCallback(() => {
    const newLocale = getLocale() === "ar" ? "en" : "ar";
    setLocale(newLocale);
    appStore.setLocale(newLocale);
  }, []);

  const toggleTheme = useCallback(() => {
    appStore.setTheme(appStore.theme === "dark" ? "light" : "dark");
  }, [appStore.theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="heading" style={styles.title}>{t("tabs.profile")}</Text>
        <Card elevated style={styles.userCard}>
          <View style={styles.avatar}><Text variant="heading" center>{user?.name?.charAt(0) ?? "؟"}</Text></View>
          <Text variant="subheading" center>{user?.name ?? t("auth.login")}</Text>
          <Text variant="caption" color={colors.textSecondary} center>{user?.email ?? ""}</Text>
        </Card>
        <Card style={styles.settingsCard}>
          <Pressable onPress={toggleLocale} style={[styles.settingRow, { flexDirection }]}>
            <Text variant="body">اللغة / Language</Text>
            <Text variant="label" color={colors.primary}>{getLocale() === "ar" ? "العربية" : "English"}</Text>
          </Pressable>
          <Pressable onPress={toggleTheme} style={[styles.settingRow, { flexDirection }]}>
            <Text variant="body">{appStore.theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}</Text>
            <Text variant="label" color={colors.primary}>{appStore.theme === "dark" ? "🌙" : "☀️"}</Text>
          </Pressable>
        </Card>
        <Button title={t("auth.login")} variant="outline" fullWidth onPress={logout} style={styles.logoutBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md },
  title: { marginBottom: Spacing.lg },
  userCard: { alignItems: "center", marginBottom: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#6C63FF20", alignItems: "center", justifyContent: "center", marginBottom: Spacing.sm },
  settingsCard: { marginBottom: Spacing.lg },
  settingRow: { justifyContent: "space-between", alignItems: "center", paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: "#2A2A2A" },
  logoutBtn: { marginTop: Spacing.md },
});
