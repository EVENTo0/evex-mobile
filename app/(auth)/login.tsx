import React, { useState, useCallback } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { t } from "@/lib/i18n";
import { useAuthStore } from "@/lib/store/auth";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { textAlign } = useRTL();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      setUser({ id: "1", email, name: email.split("@")[0], locale: "ar" });
      setTokens("mock-access-token", "mock-refresh-token");
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <View style={styles.branding}>
          <Text variant="display" bold center color={colors.primary}>EVEX</Text>
          <Text variant="body" color={colors.textSecondary} center>{t("app.tagline")}</Text>
        </View>
        <View style={styles.form}>
          <TextInput value={email} onChangeText={setEmail} placeholder={t("auth.email")} placeholderTextColor={colors.textTertiary} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { color: colors.text, borderColor: colors.border, textAlign }]} />
          <TextInput value={password} onChangeText={setPassword} placeholder={t("auth.password")} placeholderTextColor={colors.textTertiary} secureTextEntry style={[styles.input, { color: colors.text, borderColor: colors.border, textAlign }]} />
          <Button title={t("auth.login")} variant="primary" size="lg" fullWidth loading={loading} onPress={handleLogin} />
          <Button title={t("auth.register")} variant="ghost" fullWidth onPress={() => router.push("/(auth)/register")} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: Spacing.lg },
  branding: { marginBottom: Spacing.xxl },
  form: { gap: Spacing.md },
  input: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, fontSize: 16 },
});
