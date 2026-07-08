import React, { useState } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";
import { useRTL } from "@/lib/hooks/useRTL";
import { t } from "@/lib/i18n";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { textAlign } = useRTL();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <Text variant="heading" style={styles.title}>{t("auth.register")}</Text>
        <View style={styles.form}>
          <TextInput value={name} onChangeText={setName} placeholder="الاسم" placeholderTextColor={colors.textTertiary} style={[styles.input, { color: colors.text, borderColor: colors.border, textAlign }]} />
          <TextInput value={email} onChangeText={setEmail} placeholder={t("auth.email")} placeholderTextColor={colors.textTertiary} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { color: colors.text, borderColor: colors.border, textAlign }]} />
          <TextInput value={password} onChangeText={setPassword} placeholder={t("auth.password")} placeholderTextColor={colors.textTertiary} secureTextEntry style={[styles.input, { color: colors.text, borderColor: colors.border, textAlign }]} />
          <Button title={t("auth.register")} variant="primary" size="lg" fullWidth />
          <Button title={t("common.back")} variant="ghost" fullWidth onPress={() => router.back()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: Spacing.lg },
  title: { marginBottom: Spacing.xl },
  form: { gap: Spacing.md },
  input: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, fontSize: 16 },
});
